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
import type { noblePeripheralType, nobleIdType } from '../types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType
} from '../types/actionTypes';

export const FOUND_ADVERTISING_DEVICE = 'FOUND_ADVERTISING_DEVICE';
export const CLEAR_ADVERTISING_LIST = 'CLEAR_ADVERTISING_LIST';
export const CONNECTING_TO_DEVICE = 'CONNECTING_TO_DEVICE';
export const CONNECTED_TO_DEVICE = 'CONNECTED_TO_DEVICE';

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

/* Move peripheral from advertising to connecting */
export function connectingToDevice(peripheralId: nobleIdType): connectingToDeviceActionType {
  return {
    type: CONNECTING_TO_DEVICE,
    payload: {
      peripheralId
    }
  };
}
/* Successfully connected, move from connecting to connected */
export function connectedToDevice(peripheralId: nobleIdType): connectedToDeviceActionType {
  return {
    type: CONNECTED_TO_DEVICE,
    payload: {
      peripheralId
    }
  };
}
/* [] - END OF FILE */
