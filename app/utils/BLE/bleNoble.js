// @flow
/* **********************************************************
* File: utils/BLE/bleNoble.js
*
* Brief: Contains the MICA API for interacting with BLE
* devices via Noble.
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document created
********************************************************* */
import store from '../../index';
import { foundAdvertisingDevice, metaDataReadComplete } from '../../actions/devicesActions';
import { changeScanState, enableScanMethod } from '../../actions/ScanForDevicesActions';
import { Noble } from '../nativeModules';
import { micaServiceUuid, micaCharUuids } from '../mica/micaConstants';
import { parseDataPacket, getSensorSettingsFromState } from '../mica/parseDataPacket';
import log from '../loggingUtils';
import {
  getCharacteristicFromDevice
} from './bleHelpers';
import { shallowObjToArray } from '../deviceUtils';
import type { bleApiResultType } from '../../types/bleTypes';
import type {
  idType, newDeviceObjType, noblePeripheralType
} from '../../types/paramTypes';
import parseMetaData from '../mica/metaDataParsers';
import { logDataPoint, getDataIndex } from '../dataStreams/graphBuffer';
// import { reportToGraph } from '../../components/CollectData/GraphComponent';

// log.debugLevel = 5;
log.debug('bleNoble.js logging level set to:', log.debugLevel);

/* Store the Noble objects */
const nobleObjects = {};
/* Start a Noble scan */
export function nobleStartScan(): bleApiResultType {
  Noble.startScanning([micaServiceUuid], false);
  return { success: true };
}
/* Stop a Noble scan */
export function nobleStopScan(): bleApiResultType {
  Noble.stopScanning();
  return { success: true };
}
/* Connect to a noble device */
export function nobleConnect(
  deviceId: idType,
  connectCallback: (id: idType, error?: string) => void,
  disconnectCallback: (id: idType) => void
): bleApiResultType {
  /* Get the device */
  const device = nobleObjects[deviceId];
  if (!device) {
    return { success: false, error: 'could not find the specified device' };
  }
  /* Connect to the device */
  device.connect(connectCallback);
  /* Register the disconnect callback */
  device.once('disconnect', disconnectCallback);
  /* Return success */
  return { success: true };
}

/* Disconnect from a Noble device */
export function nobleDisconnect(
  deviceId: idType,
): bleApiResultType {
  /* Get the device */
  const device = nobleObjects[deviceId];
  if (!device) { return { success: false, error: 'could not find the specified device' }; }
  /* Connect to the device */
  device.disconnect();
  /* Return success */
  return { success: true };
}

/* Read the metadata from a device */
export function nobleInitializeDevice(
  deviceId: idType,
): bleApiResultType {
  /* Get the device */
  const device = nobleObjects[deviceId];
  if (!device) { return { success: false, error: 'could not find the specified device' }; }
  /* Convert the uuids to an array */
  const micaCharArray = shallowObjToArray(micaCharUuids);
  /* Discover the MICA characteristics & Subscribe to them */
  device.discoverSomeServicesAndCharacteristics(
    [micaServiceUuid],
    micaCharArray,
    nobleDiscoverMicaCallback.bind(null, deviceId)
  );
  /* Return success */
  return { success: true };
}

/* Write a characteristic */
export function nobleWriteCharacteristic(
  deviceId: idType,
  charUuid: string,
  payload: number[],
  callback?: (deviceId: string, charUuid: string, error: string) => void,
  noResponse?: boolean
): bleApiResultType {
  /* Decide whether or not a response is requested */
  let withoutResponse = false;
  if (noResponse != null) {
    withoutResponse = noResponse;
  }
  /* Get the device */
  const device = nobleObjects[deviceId];
  if (!device) { return { success: false, error: 'could not find the specified device' }; }
  /* Get the characteristic */
  const char = getCharacteristicFromDevice(device, micaServiceUuid, charUuid);
  if (!char) { return { success: false, error: 'could not find the specified characteristic' }; }
  /* Convert the array to a buffer */
  const dataBuffer = new Buffer(payload);
  /* Write to the device */
  if (callback) {
    char.write(dataBuffer, withoutResponse, callback.bind(null, deviceId, charUuid));
  } else {
    char.write(dataBuffer, withoutResponse);
  }
  return { success: true };
}

/* Read a characteristic */
export function nobleReadCharacteristic(
  deviceId: idType,
  charUuid: string,
  callback?: (charId: string, deviceId: string, error: ?string, data: Buffer) => void
): bleApiResultType {
  /* Get the device */
  const device = nobleObjects[deviceId];
  if (!device) { return { success: false, error: 'could not find the specified device' }; }
  /* Get the characteristic */
  const char = getCharacteristicFromDevice(device, micaServiceUuid, charUuid);
  if (!char) { return { success: false, error: 'No characteristic found' }; }
  /* Read the char */
  if (callback) {
    char.read(callback.bind(null, charUuid, device.id));
  } else {
    char.read(logReadCallback.bind(null, charUuid, device.id));
  }
  return { success: true };
}

/* ======== Callbacks ======== */

function logReadCallback(
  charId: string, deviceId: string, error: ?string, data: Buffer
): void {
  if (error) {
    console.log('Read Char: Error', error, deviceId, charId);
  } else {
    console.log('Read Char success:', data, deviceId, charId);
  }
}

/* Callback once MICA discovery is done - Subscriptions are done here */
function nobleDiscoverMicaCallback(id: idType, error: ?string): void {
  /* Get the device */
  const device = nobleObjects[id];
  if (error || !device) {
    log.error('nobleDiscoverMicaCallback: Discovery failed', error, id);
    return;
  }
  const { sensorCommands, communicationCommands } = micaCharUuids;
  /* Subscribe to the sensing command */
  const sensingCommandChar = getCharacteristicFromDevice(
    device, micaServiceUuid, sensorCommands
  );
  /* Ensure the commands were found */
  if (!sensingCommandChar) {
    log.error('Failed to find sensingCommand Characteristic for', id);
  } else {
    sensingCommandChar.subscribe(nobleSubscribeCallback.bind(null, id, 'SensingCommand'));
    sensingCommandChar.on('data', nobleSensingDataCallback.bind(null, id));
  }
  /* Subscribe to the Communication command */
  const commCommandChar = getCharacteristicFromDevice(
    device, micaServiceUuid, communicationCommands
  );
  if (!commCommandChar) {
    log.error('Failed to find communicationCommand Characteristic for', id);
  } else {
    commCommandChar.subscribe(nobleSubscribeCallback.bind(null, id, 'CommunicationCommand'));
  }
  /* Read the metadata from the device */
  nobleReadMetadata(device);
}

/* Begin Reading the metadata from a device */
function nobleReadMetadata(
  device: noblePeripheralType,
): bleApiResultType {
  /* Get all of the chars */
  const {
    energyMetadata, actuationMetadata, powerMetadata,
    sensorMetadata, communicationMetadata, controlMetadata
  } = micaCharUuids;
  const metadataChars = [
    energyMetadata, actuationMetadata, powerMetadata,
    sensorMetadata, communicationMetadata, controlMetadata
  ];
  /* Read all of the metadata */
  let result = { success: true };
  for (let i = 0; i < metadataChars.length; i++) {
    const char = metadataChars[i];
    /* Read from the device */
    const { success, error } = nobleReadCharacteristic(
      device.id, char, readMetadataCallback);
    if (!success) {
      result = { success, error, payload: { charUuid: char } };
    }
  }
  return result;
}

/* Callback for when the metadata is read */
function readMetadataCallback(
  charId: string, deviceId: string, error: ?string, data: Buffer
): void {
  if (error) {
    log.error('readCharCallback', charId, 'failed on device', deviceId, 'with error', error);
    return;
  }
  /* Parse the metadata */
  const metadata = parseMetaData(charId, data);
  log.debug('readMetaCharCallback: Parsed metadata:', metadata);
  store.dispatch(metaDataReadComplete(deviceId, metadata));
}

/* ############### Sensing Data Callback ############### */
/* Receive data packets back from the sensing module. */
function nobleSensingDataCallback(id: idType, data: Buffer, isNotification: boolean): void {
  // console.log('nobleSensingDataCallback:', id, data);
  const time = new Date().getTime();
  /* Get the settings */
  const { devices } = store.getState();
  const { sensors } = devices[id].settings;
  const result = getSensorSettingsFromState(sensors);
  if (result.success) {
    const { numChannels, periodLength, scalingConstant, gain, offset } = result.payload;
    const parsed = parseDataPacket(
      data, numChannels, periodLength, scalingConstant, gain, offset, getDataIndex()
    );
    const points = parsed.map((point) => point.toPoint()[1]);
    /* Send the data to the graph */
    logDataPoint(parsed);
    // reportToGraph(parsed[0]);
  }
  /* Parse the command */
  // /* TODO: implement dynamic packets based on settings */
  // const parsed = parseDataPacket(data, 1, 0.1, 1, 1, [0], time); // hardcoded settings
  /* Log the packet for debugging */
}

/* Call back function for subscriptions */
function nobleSubscribeCallback(id: string, char: string, error: ?string): void {
  if (error) {
    log.error('Subscription to', char, 'failed on device:', id);
  } else {
    log.verbose('Subscription to', char, 'succeeded on device:', id);
  }
}

/* ======== Noble Native Callbacks ======== */

Noble.on('stateChange', (state: string) => {
  let enabled = false;
  if (state === 'poweredOn') {
    enabled = true;
  }
  log.verbose('Noble state:', state);
/* Dispatch the action */
  store.dispatch(enableScanMethod('ble', enabled));
});

Noble.on('scanStart', () => {
  /* Set a timeout */
  const timeoutId = setTimeout(() => {
    Noble.stopScanning();
  }, 15000);
  /* Dispatch the start scan action */
  store.dispatch(changeScanState('ble', true, timeoutId));
});

Noble.on('scanStop', () => {
  /* Get the timeout ID saved */
  const timeoutId = store.getState().scanForDevices.timeoutId;
  /* Clear if applicable */
  if (timeoutId) { clearTimeout(timeoutId); }
  /* Dispatch the stop scan action */
  store.dispatch(changeScanState('ble', false));
});

/* A peripheral was discovered */
Noble.on('discover', (peripheral: *) => {
  /* Get the relevant parameters */
  const { id: deviceId, rssi, address } = peripheral;
  const name = peripheral.advertisement.localName;
  /* construct the object */
  const newDeviceObj: newDeviceObjType = {
    deviceId,
    address,
    name,
    rssi
  };
  /* Keep track of the object */
  nobleObjects[deviceId] = peripheral;
  /* Dispatch the action */
  store.dispatch(foundAdvertisingDevice(newDeviceObj));
});

/* [] - END OF FILE */
