// @flow
/* **********************************************************
* File: types/actionTypes.js
*
* Brief: Types for the various actions
* https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
* Author: Craig Cheney
* Date: 2017.04.28
*
********************************************************* */
import type {
  scanTypes,
  idType,
  deviceSettingsObjType,
  channelsT
} from './paramTypes';
import type { metaDataObjType, moduleNameType } from './metaDataTypes';
import type { selectType } from './stateTypes';

/* Type for changing the scanning type */
export type changeScanActionType = {
  type: 'CHANGE_SCAN_METHOD',
  payload: {
    method: scanTypes,
    enable: boolean
  }
};
/* Setting the scan active or not */
export type enableScanActionType = {
  type: 'ENABLE_SCAN_METHOD',
  payload: {
    method: scanTypes,
    enable: boolean
  }
};

/* Start or stop the scan */
export type scanStateActionType = {
  type: 'CHANGE_SCAN_STATE',
  payload: {
    method: scanTypes,
    state: boolean,
    timeoutId: ?number
  }
};

/* Clear the advertising device list */
export type clearAdvertisingActionType = {
  type: 'CLEAR_ADVERTISING_LIST',
  payload: {}
};

/* A new advertising device was found */
export type foundDeviceActionType = {
  type: 'FOUND_ADVERTISING_DEVICE',
  payload: {
    deviceId: idType,
    name: string,
    rssi: number,
    address: string
  }
};

/* Attempting to connect to a device - move from advertising list to connecting list */
export type connectingToDeviceActionType = {
  type: 'CONNECTING_TO_DEVICE',
  payload: {
    deviceId: idType
  }
};

/* Abort the planned connection */
export type cancelConnectToDeviceActionType = {
  type: 'CANCEL_CONNECT_TO_DEVICE',
  payload: {
    deviceId: idType
  }
};

/* Successfully connected to a device */
export type connectedToDeviceActionType = {
  type: 'CONNECTED_TO_DEVICE',
  payload: {
    deviceId: idType
  }
};

/* Disconnecting from a device */
export type disconnectingFromDeviceActionType = {
  type: 'DISCONNECTING_FROM_DEVICE',
  payload: {
    deviceId: idType
  }
};

/* Disconnect from a device */
export type disconnectedFromDeviceActionType = {
  type: 'DISCONNECTED_FROM_DEVICE',
  payload: {
    deviceId: idType
  }
};

/* Disconnect from a device */
export type lostConnectionFromDeviceActionType = {
  type: 'LOST_CONNECTION_FROM_DEVICE',
  payload: {
    deviceId: idType
  }
};

export type reportMetaDataActionType = {
  type: 'REPORT_META_DATA',
  payload: {
    deviceId: string,
    data: metaDataObjType
  }
};

/* Update the settings of a device */
export type updateSenGenParamActionType = {
  type: 'UPDATE_SEN_GEN_PARAMS',
  payload: {
    deviceId: idType,
    deviceSettings: deviceSettingsObjType
  }
};

/* Set the sensor channels active or not */
export type setSensorChannelsActionT = {
  type: 'SET_SENSOR_CHANNELS',
  payload: {
    deviceId: idType,
    sensorId: idType,
    channels: number[]
  }
};

/* Sets the range of the sensors, and the gain */
export type setSensorRangeActionT = {
  type: 'SET_SENSOR_RANGE',
  payload: {
    deviceId: idType,
    sensorId: idType,
    range: number,
    gain: number
  }
};

/* Set the device active or inactive */
export type setDeviceActiveActionType = {
  type: 'SET_DEVICE_ACTIVE',
  payload: {
    deviceId: idType,
    newState: boolean
  }
};
/* [] - END OF FILE */
