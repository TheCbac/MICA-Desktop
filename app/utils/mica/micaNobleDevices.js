// @flow
/* **********************************************************
* File: utils/mica/micaNobleDevices.js
*
* Brief: Contains the MICA API for interacting with BLE
* devices via Noble.
*
* Author: Craig Cheney
*
* 2017.08.28 CC - Document created
**********************************************************/
import type { nobleIdType } from '../../types/paramTypes';
import store from '../../index';
import { micaServiceUuid, micaCharUuids } from './micaConstants';
import {
  getPeripheralFromList,
  shallowObjToArray,
  getCharacteristicFromPeripheralId,
  readMetaCharacteristicFromId
} from '../deviceUtils';
import parseMetaData from './metaDataParsers';
import log from '../loggingUtils';
import { reportMetaData } from '../../actions/devicesActions';

/* Set the file debug level */
// log.debugLevel = 5;
log.debug('micaNobleDevices.js logging level set to:', log.debugLevel);

/* Function to Discover and Subscribe to MICA characteristics */
export function discoverMicaNoble(id: nobleIdType): void {
  /* Find the Device  */
  const state = store.getState();
  /* Get the device */
  const device = getPeripheralFromList(state.devices.connected, id).peripheral;
  /* Ensure the device was found */
  if (!device) {
    return;
  }
  /* Convert the uuids to an array */
  const micaCharArray = shallowObjToArray(micaCharUuids);
  /* Discover the MICA characteristics & Subscribe to them */
  // $FlowFixMe
  device.discoverSomeServicesAndCharacteristics(
    [micaServiceUuid],
    micaCharArray,
    discoverMicaNobleCallback.bind(null, id)
  );
  /* Use a promise to wait until the chars were found? */
}

/* Callback once MICA discovery is done - Subscriptions are done here */
function discoverMicaNobleCallback(id: nobleIdType, error: ?string): void {
  if (error) {
    log.error('discoverMicaNobleCallback: Discovery failed %s', error);
    return;
  }
  log.verbose('discoverMicaNobleCallback: Dicovered MICA profile for ', id);

  /* Get the list of connected devices */
  const deviceList = store.getState().devices.connected;
  /* Find the SENSING COMMAND characteristic & subscribe */
  const sensingCommandsChar = getCharacteristicFromPeripheralId(
    micaCharUuids.sensorCommands, micaServiceUuid, id, deviceList
  );
  if (!sensingCommandsChar) {
    log.error('Failed to find sensingCommand Characteristic for', id);
    return;
  }
  /* Find the COMMUNICATION COMMAND characteristic &  subscribe */
  const communicationCommandChar = getCharacteristicFromPeripheralId(
    micaCharUuids.communicationCommands, micaServiceUuid, id, deviceList
  );
  if (!communicationCommandChar) {
    log.error('Failed to find communicationCommand Characteristic for', id);
    return;
  }
  /* Subscribe to the char */
  sensingCommandsChar.subscribe(subscribeCallback.bind(null, id, 'SensingCommand'));
  /* Subscribe to the char */
  communicationCommandChar.subscribe(subscribeCallback.bind(null, id, 'CommunicationCommand'));
  /* Read the metadata from the device */
  readMetaData(id);
}

/* Call back function for subscriptions */
function subscribeCallback(id: string, char: string, error: ?string): void {
  if (error) {
    log.error('Subscription to', char, 'failed on device:', id);
  } else {
    log.verbose('Subscription to', char, 'succeeded on device:', id);
  }
}

/* Read all of the meta data from a mica device */
function readMetaData(deviceId: nobleIdType): void {
  const connectedDevices = store.getState().devices.connected;
  /* Initiate a metadata read */
  readMetaCharacteristicFromId(micaCharUuids.energyMetadata, micaServiceUuid,
    deviceId, connectedDevices, readMetaCharCallback);
  readMetaCharacteristicFromId(micaCharUuids.actuationMetadata, micaServiceUuid,
    deviceId, connectedDevices, readMetaCharCallback);
  readMetaCharacteristicFromId(micaCharUuids.powerMetadata, micaServiceUuid,
    deviceId, connectedDevices, readMetaCharCallback);
  readMetaCharacteristicFromId(micaCharUuids.sensorMetadata, micaServiceUuid,
    deviceId, connectedDevices, readMetaCharCallback);
  readMetaCharacteristicFromId(micaCharUuids.communicationMetadata, micaServiceUuid,
    deviceId, connectedDevices, readMetaCharCallback);
  readMetaCharacteristicFromId(micaCharUuids.controlMetadata, micaServiceUuid,
    deviceId, connectedDevices, readMetaCharCallback);
}

/* callback to receive the data read in by a device */
function readMetaCharCallback(
  charId: string,
  deviceId: string,
  error: ?string,
  data: Buffer
): void {
  if (error) {
    log.error('readMetaCharCallback', charId, 'failed on device', deviceId, 'with error', error);
    return;
  }
  /* Parse the metadata */
  const metaData = parseMetaData(charId, data);
  if (metaData) {
    log.debug('readMetaCharCallback: Parsed metadata:', metaData);
    store.dispatch(reportMetaData(deviceId, metaData));
  }
}

/* [] - END OF FILE */
