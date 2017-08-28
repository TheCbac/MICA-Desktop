// @flow
/* **********************************************************
* File: types/stateTypes.js
*
* Brief: The types for different application states

* Author: Craig Cheney
* Date: 2017.07.10
*
**********************************************************/
import type {
  scanTypes,
  noblePeripheralType
} from './paramTypes';

/* State Type for the ScanForDevicesComponent */
export type scanStateType = {
  method: scanTypes,
  enabled: boolean,
  scanning: boolean
};

export type devicesStateType = {
  advertising: noblePeripheralType[],
  connecting: noblePeripheralType[],
  connected: noblePeripheralType[],
  disconnecting: noblePeripheralType[]
};

/* State of the app  */
export type stateType = {
 scanForDevices: scanStateType,
 devices: devicesStateType,
 router: {}
};

/* [] - END OF FILE */
