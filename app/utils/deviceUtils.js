// @flow
/* **********************************************************
* File: utils/deviceUtils.js
*
* Brief: Utility functions for interacting with BLE devices
*
* Author: Craig Cheney
* Date: 2017.08.27
*
**********************************************************/
import type { noblePeripheralType, nobleIdType } from '../types/paramTypes';

/* Find a peripheral from a list of peripherals */
export function getPeripheralFromList(
  deviceList: noblePeripheralType[],
  id: nobleIdType
): {peripheral: ?noblePeripheralType, index: ?number} {
  /* Iterate over the list */
  for (let i = 0; i < deviceList.length; i += 1) {
    /* Check the ID */
    if (deviceList[i].id === id) {
      /* Return the matching device */
      return { peripheral: deviceList[i], index: i };
    }
  }
  /* No device found */
  return { peripheral: undefined, index: undefined };
}

/* [] - END OF FILE */
