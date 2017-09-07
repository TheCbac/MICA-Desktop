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
  connectedToDeviceActionType,
  cancelConnectToDeviceActionType,
  disconnectedFromDeviceActionType,
  disconnectingFromDeviceActionType,
  lostConnectionFromDeviceActionType,
  reportMetaDataActionType
} from '../types/actionTypes';
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
/* [] - END OF FILE */
