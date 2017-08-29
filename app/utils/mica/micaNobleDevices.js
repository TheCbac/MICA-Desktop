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
import { micaServiceUuid, micaCharUuids } from './micaUuids';
import {
  getPeripheralFromList,
  shallowObjToArray,
  getCharacteristicFromPeripheralId
} from '../deviceUtils';
import log from '../loggingUtils';
/* Set the file debug level */
// log.debugLevel = 5;

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
  /* Discover the MICA characteristics */
  // $FlowFixMe
  device.discoverSomeServicesAndCharacteristics(
    [micaServiceUuid],
    micaCharArray,
    discoverMicaNobleCallback.bind(null, id)
  );
}

/* Callback once MICA discovery is done */
function discoverMicaNobleCallback(id: nobleIdType, error: ?string): void {
  if (error) {
    log.error('discoverMicaNobleCallback: Discovery failed %s', error);
    return;
  }
  log.verbose('discoverMicaNobleCallback: Dicovered MICA profile for ', id);
  /* Find the sensing command characteristic subscriptions */
  const sensingCommandsChar = getCharacteristicFromPeripheralId(
    micaServiceUuid,
    micaCharUuids.sensorCommands,
    id,
    store.getState().devices.connected
  );
  if (sensingCommandsChar) {
    /* Subscribe to the char */
    sensingCommandsChar.subscribe(subscribeCallback.bind(null, id, 'SensingCommand'));
  }
}

/* Call back function for subscriptions */
function subscribeCallback(id: string, char: string, error: ?string): void {
  if (error) {
    log.error('Subscription to', char, 'failed on device:', id);
  } else {
    log.verbose('Subscription to', char, 'succeeded on device:', id);
  }
}

/* [] - END OF FILE */
