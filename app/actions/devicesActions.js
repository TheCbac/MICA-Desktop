// @flow
/* **********************************************************
* File: actions/devicesActions.js
*
* Brief: Actions for the scanning devices
*
* Author: Craig Cheney
* Date: 2017.07.10
*
********************************************************* */
import { getSelectedDevices } from './senGenActions';
import type { noblePeripheralType, nobleIdType, deviceSettingsType } from '../types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType,
  cancelConnectToDeviceActionType,
  disconnectedFromDeviceActionType,
  disconnectingFromDeviceActionType,
  lostConnectionFromDeviceActionType,
  reportMetaDataActionType,
  updateSenGenParamActionType
} from '../types/actionTypes';
import type { stateType } from '../types/stateTypes';
import type { metaDataType, metaDataNameType } from '../types/metaDataTypes';

export const FOUND_ADVERTISING_DEVICE = 'FOUND_ADVERTISING_DEVICE';
export const CLEAR_ADVERTISING_LIST = 'CLEAR_ADVERTISING_LIST';
export const CONNECTING_TO_DEVICE = 'CONNECTING_TO_DEVICE';
export const CONNECTED_TO_DEVICE = 'CONNECTED_TO_DEVICE';
export const CANCEL_CONNECT_TO_DEVICE = 'CANCEL_CONNECT_TO_DEVICE';
export const DISCONNECTING_FROM_DEVICE = 'DISCONNECTING_FROM_DEVICE';
export const DISCONNECTED_FROM_DEVICE = 'DISCONNECTED_FROM_DEVICE';
export const LOST_CONNECTION_FROM_DEVICE = 'LOST_CONNECTION_FROM_DEVICE';
export const REPORT_META_DATA = 'REPORT_META_DATA';
export const UPDATE_SEN_GEN_PARAMS = 'UPDATE_SEN_GEN_PARAMS';

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
    type: CLEAR_ADVERTISING_LIST,
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

/* Cancel a pending connection */
export function cancelConnectToDevice(peripheralId: nobleIdType): cancelConnectToDeviceActionType {
  return {
    type: CANCEL_CONNECT_TO_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Disconnect from a connected device */
export function disconnectingFromDevice(
  peripheralId: nobleIdType
): disconnectingFromDeviceActionType {
  return {
    type: DISCONNECTING_FROM_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Disconnect from a connected device */
export function disconnectedFromDevice(
  peripheralId: nobleIdType
): disconnectedFromDeviceActionType {
  return {
    type: DISCONNECTED_FROM_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Disconnect from a connected device */
export function lostConnectionFromDevice(
  peripheralId: nobleIdType
): lostConnectionFromDeviceActionType {
  return {
    type: LOST_CONNECTION_FROM_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Report Metadata */
export function reportMetaData(
  deviceId: nobleIdType,
  metaData: ?metaDataType,
  moduleName: ?metaDataNameType
): reportMetaDataActionType {
  return {
    type: REPORT_META_DATA,
    payload: {
      peripheralId: deviceId,
      data: metaData,
      moduleName
    }
  };
}

/* Wrapper for reporting metadata - check to see if the metadata is complete */
export function metaDataReadComplete(
  deviceId: nobleIdType,
  metaData: ?metaDataType,
  moduleName: ?metaDataNameType
) {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Report the metadata */
    dispatch(reportMetaData(deviceId, metaData, moduleName));
    /* Get the state  */
    const state = getState();
    /* Get the metadata for a device */
    const deviceMetadata = state.devices.metadata[deviceId];
    /* get the number of metadata reads */
    const numMetadata = Object.keys(deviceMetadata).length;
    if (numMetadata === 6) {
      dispatch(getSelectedDevices());
    }
  };
}


/* Change the active parameters */
export function updateSenGenParams(
  deviceSettings: deviceSettingsType
): updateSenGenParamActionType {
  return {
    type: UPDATE_SEN_GEN_PARAMS,
    payload: {
      deviceSettings
    }
  };
}
/* [] - END OF FILE */
