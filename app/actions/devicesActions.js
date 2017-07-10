// @flow
/* **********************************************************
* File: actions/devicesActions.js
*
* Brief: Actions for the scanning devices
*
* Author: Craig Cheney
* Date: 2017.07.10
*
**********************************************************/
import type { noblePeripheralType } from '../types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType
} from '../types/actionTypes';

export const FOUND_ADVERTISING_DEVICE = 'FOUND_ADVERTISING_DEVICE';
export const CLEAR_ADVERTISING_LIST = 'CLEAR_ADVERTISING_LIST';

/* Action creator for when an advertising MICA device is discovered */
export function foundAdvertisingDevice(peripheral: noblePeripheralType): foundDeviceActionType {
  return {
    type: FOUND_ADVERTISING_DEVICE,
    payload: {
      peripheral
    }
  };
}

/* Clear the advertisement list */
export function clearAdvertisingList(): clearAdvertisingActionType {
  return {
    type: CLEAR_ADVERTISING_LIST
  };
}

/* [] - END OF FILE */
