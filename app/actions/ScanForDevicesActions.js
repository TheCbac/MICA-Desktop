// @flow
/* **********************************************************
* File: actions/ScanForDevicesActions.js
*
* Brief: Actions for the scanning devices
*
* Author: Craig Cheney
* Date: 2017.04.28
*
**********************************************************/
import type { stateType } from '../types/stateTypes';
import type { scanTypes, nobleIdType } from '../types/paramTypes';
import type {
  enableScanActionType,
  changeScanActionType,
  scanStateActionType,
} from '../types/actionTypes';
import { Noble } from '../utils/nativeModules';
import { micaServiceUuid } from '../utils/mica/micaUuids';
import { getPeripheralFromList } from '../utils/deviceUtils';
import store from '../index';
import {
  clearAdvertisingList,
  connectingToDevice,
  connectedToDevice,
  disconnectingFromDevice,
  disconnectedFromDevice
} from './devicesActions';

/* Action names */
export const CHANGE_SCAN_METHOD = 'CHANGE_SCAN_METHOD';
export const ENABLE_SCAN_METHOD = 'ENABLE_SCAN_METHOD';
export const CHANGE_SCAN_STATE = 'CHANGE_SCAN_STATE';

/* Action method for changing active method */
export function changeScanMethod(method: scanTypes): changeScanActionType {
  /* Check the state on switch */
  let enable = false;
  if (method === 'ble') {
    enable = Noble.state === 'poweredOn';
  }
  return {
    type: CHANGE_SCAN_METHOD,
    payload: {
      method,
      enable
    }
  };
}
/* Enable the currently selected scanning method */
export function enableScanMethod(method: scanTypes, enable: boolean): enableScanActionType {
  return {
    type: ENABLE_SCAN_METHOD,
    payload: {
      method,
      enable
    }
  };
}

/* Indicate that the scanState should change */
export function changeScanState(method: scanTypes, state: boolean): scanStateActionType {
  return {
    type: CHANGE_SCAN_STATE,
    payload: {
      method,
      state
    }
  };
}
/* Starts and stops the scanning events - dispatches events based on results */
export function startStopScan() {
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the current state */
    const scanState = getState().scanForDevices;
    /* Only scan if the current method is enabled */
    if (scanState.enabled) {
      switch (scanState.method) {
        case 'ble':
        /* If not scanning start a scan */
          if (!scanState.scanning) {
            Noble.startScanning([micaServiceUuid], false);
            store.dispatch(clearAdvertisingList());
          } else {
            Noble.stopScanning();
          }
          break;
        case 'usb':
          break;
        default:
          break;
      }
    }
  };
}

/* Connecting to the a MICA Device - Redux Thunk */
export function connectToDevice(advertisingDeviceId: nobleIdType) {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the current devices */
    const advertisingList = getState().devices.advertising;
    /* Get the device from the advertising list */
    const { peripheral } = getPeripheralFromList(advertisingList, advertisingDeviceId);
    if (peripheral) {
      /* Move to advertising list */
      store.dispatch(connectingToDevice(peripheral.id));
      /* Connect to the peripheral - pass the ID to the callback */
      peripheral.connect(connectCallBack.bind(null, peripheral.id));
      /* Register a callback function for a disconnect event */
      peripheral.once('disconnect', disconnectCallback.bind(null, peripheral.id));
    }
  };
}

/* Callback when a device has been connected (or timeout) */
function connectCallBack(id: nobleIdType, error: ?string): void {
  if (error) {
    console.log('connectCallback:', id, error);
    return;
  }
  /* Dispatch an action to indicate connected device */
  store.dispatch(connectedToDevice(id));
}

/* Disconnect from a device */
export function disconnectFromDevice(connectedDeviceId: nobleIdType) {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the currently connected devices */
    const connectedList = getState().devices.connected;
    /* Get the device from the advertising list */
    const { peripheral } = getPeripheralFromList(connectedList, connectedDeviceId);
    if (peripheral) {
      /* Move to disconnecting list */
      store.dispatch(disconnectingFromDevice(peripheral.id));
      /* Connect to the peripheral
      Disconnect call back was registered when the device connected */
      peripheral.disconnect();
    }
  };
}

/* Callback for when a device becomes disconnected */
function disconnectCallback(id: nobleIdType): void {
  /* Dispatch a disconnect event */
  store.dispatch(disconnectedFromDevice(id));
}

/* [] - END OF FILE */

