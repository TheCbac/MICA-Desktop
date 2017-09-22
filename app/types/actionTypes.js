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
  deviceSettingsObjType
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
    deviceId: idType
  }
};

/* Attempting to connect to a device - move from advertising list to connecting list */
export type connectingToDeviceActionType = {
  type: 'CONNECTING_TO_DEVICE',
  payload: {
    peripheralId: nobleIdType
  }
};

/* Abort the planned connection */
export type cancelConnectToDeviceActionType = {
  type: 'CANCEL_CONNECT_TO_DEVICE',
  payload: {
    peripheralId: nobleIdType
  }
};

/* Successfully connected to a device */
export type connectedToDeviceActionType = {
  type: 'CONNECTED_TO_DEVICE',
  payload: {
    peripheralId: nobleIdType
  }
};

/* Disconnecting from a device */
export type disconnectingFromDeviceActionType = {
  type: 'DISCONNECTING_FROM_DEVICE',
  payload: {
    peripheralId: nobleIdType
  }
};

/* Disconnect from a device */
export type disconnectedFromDeviceActionType = {
  type: 'DISCONNECTED_FROM_DEVICE',
  payload: {
    peripheralId: nobleIdType
  }
};

/* Disconnect from a device */
export type lostConnectionFromDeviceActionType = {
  type: 'LOST_CONNECTION_FROM_DEVICE',
  payload: {
    peripheralId: nobleIdType
  }
};

export type reportMetaDataActionType = {
  type: 'REPORT_META_DATA',
  payload: {
    peripheralId: string,
    data: ?metaDataObjType,
    moduleName: ?moduleNameType
  }
};

/* Set the selected devices */
export type updateSelectedDeviceAction = {
  type: 'UPDATE_SELECTED_DEVICES',
  payload: {
    sensor: selectType,
    generator: selectType,
    unselected: {
      sensors: selectType[],
      generators: selectType[]
    }
  }
};

/* Update the settings of a device */
export type updateSenGenParamActionType = {
  type: 'UPDATE_SEN_GEN_PARAMS',
  payload: {
    deviceId: nobleIdType,
    deviceSettings: deviceSettingsObjType
  }
};
/* [] - END OF FILE */
