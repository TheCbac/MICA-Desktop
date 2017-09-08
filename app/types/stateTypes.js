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
  noblePeripheralType,
  deviceSettingsType
} from './paramTypes';

/* State Type for the ScanForDevicesComponent */
export type scanStateType = {
  method: scanTypes,
  enabled: boolean,
  scanning: boolean
};

export type metadataType = {};
/* The type for determining which sensors are selected */
export type selectType = {
  name: ?string,
  id: ?string
};

export type devicesStateType = {
  advertising: noblePeripheralType[],
  connecting: noblePeripheralType[],
  connected: noblePeripheralType[],
  disconnecting: noblePeripheralType[],
  metadata: metadataType,
  selected: { sensor: selectType, generator: selectType},
  unselected: { sensors: selectType[], generators: selectType[]},
  deviceSettings: deviceSettingsType[]
};

/* State of the app  */
export type stateType = {
 scanForDevices: scanStateType,
 devices: devicesStateType,
 router: {}
};

/* [] - END OF FILE */
