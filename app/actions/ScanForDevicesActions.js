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
import { micaServiceUuid } from '../utils/mica/micaConstants';
import { getPeripheralFromList } from '../utils/deviceUtils';
import { discoverMicaNoble } from '../utils/mica/micaNobleDevices';
import log from '../utils/loggingUtils';
import store from '../index';
import {
  clearAdvertisingList,
  connectingToDevice,
  connectedToDevice,
  cancelConnectToDevice,
  disconnectingFromDevice,
  disconnectedFromDevice,
  lostConnectionFromDevice
} from './devicesActions';

/* Set the file debug level */
// log.debugLevel = 5;
log.debug('ScanForDevicesActions.js logging level set to:', log.debugLevel);

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
      enable,
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
export function changeScanState(method: scanTypes,
  state: boolean, tOutId?: number): scanStateActionType {
  return {
    type: CHANGE_SCAN_STATE,
    payload: {
      method,
      state,
      timeoutId: tOutId
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
            /* Start scanning - triggers a callback that updates the state */
            Noble.startScanning([micaServiceUuid], false);
            /* Dispatch the event */
            store.dispatch(clearAdvertisingList());
          } else {
            /* Stop scanning - triggers callback that updates the state*/
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
      // $FlowFixMe
      peripheral.connect(connectCallBack.bind(null, peripheral.id));
      /* Register a callback function for a disconnect event */
      // $FlowFixMe
      peripheral.once('disconnect', disconnectCallback.bind(null, peripheral.id));
    }
  };
}

/* Callback when a device has been connected (or timeout) */
function connectCallBack(id: nobleIdType, error: ?string): void {
  if (error) {
    log.error('Failed to connect to device:', id);
    return;
  }
  log.debug('ConnectCallBack Called');
  /* Dispatch an action to indicate connected device */
  store.dispatch(connectedToDevice(id));
  /* Discover parameters about the device */
  discoverMicaNoble(id);
}

export function cancelPendingConnection(deviceId: nobleIdType) {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Find the device in the connecting list */
    const connectingList = getState().devices.connecting;
    /* Get the peripheral and cancel the pending connection */
    const { peripheral } = getPeripheralFromList(connectingList, deviceId);
    /* Ensure the device was found */
    if (!peripheral) { return; }
    /* Disconnect from the device */
    peripheral.disconnect();
    /* Issue the action  */
    store.dispatch(cancelConnectToDevice(deviceId));
  };
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
  /* Get the state*/
  const deviceList = store.getState().devices;
  /* Disconnection was planned*/
  const disconnectingDevice = getPeripheralFromList(deviceList.disconnecting, id).peripheral;
  if (disconnectingDevice) {
    /* Dispatch a disconnect event */
    store.dispatch(disconnectedFromDevice(id));
    return;
  }
  /* Disconnection was not planned*/
  const lostDevice = getPeripheralFromList(deviceList.connected, id).peripheral;
  if (lostDevice) {
    /* Dispatch a disconnect event */
    store.dispatch(lostConnectionFromDevice(id));
    return;
  }
  /* Cancel con */
  log.info('disconnectCallback: Device in unknown state:', id);
}

/* [] - END OF FILE */
