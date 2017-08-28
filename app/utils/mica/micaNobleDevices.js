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
    console.log('discoverMicaNobleCallback: failed %s', error);
    return;
  }
  /* Register subscriptions */
  const sensingCommands = getCharacteristicFromPeripheralId(
    micaServiceUuid,
    micaCharUuids.sensorCommands,
    id,
    store.getState().devices.connected
  );
  console.log('discoverMicaNobleCallback:', sensingCommands);
}
/* [] - END OF FILE */
