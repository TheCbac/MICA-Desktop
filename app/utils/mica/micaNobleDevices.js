// // @flow
// /* **********************************************************
// * File: utils/mica/micaNobleDevices.js
// *
// * ****************** DEPRECATED ******************
// *
// * Brief: Contains the MICA API for interacting with BLE
// * devices via Noble.
// *
// * Author: Craig Cheney
// *
// * 2017.08.28 CC - Document created
// ********************************************************* */
// import type { nobleIdType } from '../../types/paramTypes';
// import store from '../../index';
// import { micaServiceUuid, micaCharUuids } from './micaConstants';
// import {
//   getPeripheralFromList,
//   shallowObjToArray,
//   getCharacteristicFromPeripheralId,
//   readMetaCharacteristicFromId
// } from '../deviceUtils';
// import parseMetaData from './metaDataParsers';
// import log from '../loggingUtils';
// import { metaDataReadComplete } from '../../actions/devicesActions';
// import { parseDataPacket } from './parseDataPacket';
// import PreciseTime from '../preciseTime';

// /* Set the file debug level */
// // log.debugLevel = 5;
// log.debug('micaNobleDevices.js logging level set to:', log.debugLevel);

// /* Function to Discover and Subscribe to MICA characteristics */
// export function discoverMicaNoble(id: nobleIdType): void {
//   /* Find the Device  */
//   const state = store.getState();
//   /* Get the device */
//   const device = getPeripheralFromList(state.devices.connected, id).peripheral;
//   /* Ensure the device was found */
//   if (!device) {
//     return;
//   }
//   /* Convert the uuids to an array */
//   const micaCharArray = shallowObjToArray(micaCharUuids);
//   /* Discover the MICA characteristics & Subscribe to them */
//   device.discoverSomeServicesAndCharacteristics(
//     [micaServiceUuid],
//     micaCharArray,
//     discoverMicaNobleCallback.bind(null, id)
//   );
//   /* Use a promise to wait until the chars were found? */
// }

// /* Callback once MICA discovery is done - Subscriptions are done here */
// function discoverMicaNobleCallback(id: nobleIdType, error: ?string): void {
//   if (error) {
//     log.error('discoverMicaNobleCallback: Discovery failed %s', error);
//     return;
//   }
//   log.verbose('discoverMicaNobleCallback: Dicovered MICA profile for ', id);

//   /* Get the list of connected devices */
//   const deviceList = store.getState().devices.connected;
//   /* Find the SENSING COMMAND characteristic & subscribe */
//   const sensingCommandsChar = getCharacteristicFromPeripheralId(
//     micaCharUuids.sensorCommands, micaServiceUuid, id, deviceList
//   );
//   if (!sensingCommandsChar) {
//     log.error('Failed to find sensingCommand Characteristic for', id);
//     return;
//   }
//   /* Find the COMMUNICATION COMMAND characteristic &  subscribe */
//   const communicationCommandChar = getCharacteristicFromPeripheralId(
//     micaCharUuids.communicationCommands, micaServiceUuid, id, deviceList
//   );
//   if (!communicationCommandChar) {
//     log.error('Failed to find communicationCommand Characteristic for', id);
//     return;
//   }
//   /* Subscribe to the char */
//   sensingCommandsChar.subscribe(subscribeCallback.bind(null, id, 'SensingCommand'));
//   sensingCommandsChar.on('data', sensingDataCallback.bind(null, id));
//   /* Subscribe to the char */
//   communicationCommandChar.subscribe(subscribeCallback.bind(null, id, 'CommunicationCommand'));
//   /* Read the metadata from the device */
//   readMetaData(id);
// }

// function sensingDataCallback(id: string, data: buffer, isNotification: boolean): void {
//   // console.log('sensingDataCallback:', id, data);
//   const time = new Date().getTime();
//   /* Parse the command */
//   /* TODO: implement dynamic packets based on settings */
//   const parsed = parseDataPacket(data, 1, 0.1, 1, 1, [0], time); // hardcoded settings
//   // console.log('parsedData:', parsed);
//   console.log(parsed.map((point) => point.toPoint()[1]));
// }

// /* Call back function for subscriptions */
// function subscribeCallback(id: string, char: string, error: ?string): void {
//   if (error) {
//     log.error('Subscription to', char, 'failed on device:', id);
//   } else {
//     log.verbose('Subscription to', char, 'succeeded on device:', id);
//   }
// }

// /* Read all of the meta data from a mica device */
// function readMetaData(deviceId: nobleIdType): void {
//   const connectedDevices = store.getState().devices.connected;
//   /* Initiate a metadata read */
//   readMetaCharacteristicFromId(micaCharUuids.energyMetadata, micaServiceUuid,
//     deviceId, connectedDevices, readMetaCharCallback);
//   readMetaCharacteristicFromId(micaCharUuids.actuationMetadata, micaServiceUuid,
//     deviceId, connectedDevices, readMetaCharCallback);
//   readMetaCharacteristicFromId(micaCharUuids.powerMetadata, micaServiceUuid,
//     deviceId, connectedDevices, readMetaCharCallback);
//   readMetaCharacteristicFromId(micaCharUuids.sensorMetadata, micaServiceUuid,
//     deviceId, connectedDevices, readMetaCharCallback);
//   readMetaCharacteristicFromId(micaCharUuids.communicationMetadata, micaServiceUuid,
//     deviceId, connectedDevices, readMetaCharCallback);
//   readMetaCharacteristicFromId(micaCharUuids.controlMetadata, micaServiceUuid,
//     deviceId, connectedDevices, readMetaCharCallback);
// }

// /* callback to receive the data read in by a device */
// function readMetaCharCallback(
//   charId: string,
//   deviceId: string,
//   error: ?string,
//   data: Buffer
// ): void {
//   if (error) {
//     log.error('readCharCallback', charId, 'failed on device', deviceId, 'with error', error);
//     return;
//   }
//   /* Parse the metadata */
//   const { metadata, moduleName } = parseMetaData(charId, data);
//   log.debug('readMetaCharCallback: Parsed metadata:', moduleName, metadata);
//   store.dispatch(metaDataReadComplete(deviceId, metadata, moduleName));
// }

// /* Write to a characteristic */
// export function writeCharacteristic(
//   deviceId: string,
//   charUuid: string,
//   payload: number[],
//   callback?: (deviceId: string, charUuid: string, error: string) => void
// ): boolean {
//   /* Get the list of connected devices */
//   const deviceList = store.getState().devices.connected;
//   /* Find the characteristic */
//   const characteristic = getCharacteristicFromPeripheralId(
//     charUuid, micaServiceUuid, deviceId, deviceList
//   );
//   if (!characteristic) { return false; }
//   console.log('writeCharacteristic:', characteristic.write);
//   /* Construct the buffer */
//   const dataBuffer = new Buffer(payload);
//   /* Write the data to the device */
//   if (callback != null) {
//     characteristic.write(dataBuffer, false, callback.bind(null, deviceId, charUuid));
//   } else {
//     characteristic.write(dataBuffer, false);
//   }
//   return true;
// }
// /* [] - END OF FILE */
