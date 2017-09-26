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
import log from '../loggingUtils';
import {
  getCharacteristicFromDevice, readBleCharacteristic
} from './bleHelpers';
import { shallowObjToArray } from '../deviceUtils';
import type { bleApiResultType } from '../../types/bleTypes';
import type {
  idType, newDeviceObjType, noblePeripheralType
} from '../../types/paramTypes';
import parseMetaData from '../mica/metaDataParsers';

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

/* ======== Callbacks ======== */

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
  /* TODO: PICK UP HERE */
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
    const { success, error } = readBleCharacteristic(
      device, micaServiceUuid, char, readMetadataCallback);
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

/* TODO: Notifications for data  */
function nobleSensingDataCallback(id: idType, data: Buffer, isNotification: boolean): void {
  // console.log('nobleSensingDataCallback:', id, data);
  const time = new Date().getTime();
  /* Parse the command */
  /* TODO: implement dynamic packets based on settings */
  const parsed = parseDataPacket(data, 1, 0.1, 1, 1, [0], time); // hardcoded settings
  // console.log('parsedData:', parsed);
  console.log(parsed.map((point) => point.toPoint()[1]));
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
