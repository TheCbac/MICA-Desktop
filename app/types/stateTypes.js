// @flow
/* **********************************************************
* File: types/stateTypes.js
*
* Brief: The types for different application states

* Author: Craig Cheney
* Date: 2017.07.10
*
********************************************************* */
import type {
  scanTypes,
  noblePeripheralType,
  deviceSettingsType
} from './paramTypes';

import type { metaDataType } from './metaDataTypes';

/* State Type for the ScanForDevicesComponent */
export type scanStateType = {
  method: scanTypes,
  enabled: boolean,
  scanning: boolean
};

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
  metadata: metaDataType,
  selected: { sensor: selectType, generator: selectType},
  unselected: { sensors: selectType[], generators: selectType[]},
  deviceSettings: deviceSettingsType
};

/* For app wide actions */
export type appWideStateType = {
  update: {
    pending: boolean,
    version: string
  }
};

/* Graph settings */
export type horizontalScaleType = 0.5 | 1 | 2 | 5 | 10;
export type graphSettingsType = {
  horizontalScale: horizontalScaleType,
  pausedDisplay: boolean
};

/* For graphing of the devices */
export type collectionStateType = {
  collecting: boolean,
  graphSettings: graphSettingsType
};

/* State of the app  */
export type stateType = {
 scanForDevices: scanStateType,
 devices: devicesStateType,
 router: {},
 appWide: appWideStateType,
 collection: collectionStateType
};

/* [] - END OF FILE */
