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
import type {
  enableScanActionType,
  changeScanActionType,
  scanStateActionType,
  stateType,
  scanTypes
} from '../types/actionTypes';
import { Noble } from '../utils/nativeModules';

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
    const scanState = getState().ScanForDevices;
    console.log('startStopScan - state: ', scanState);
    /* Only scan if the current method is enabled */
    if (scanState.enabled) {
      switch (scanState.method) {
        case 'ble':
        /* If not scanning start a scan */
          if (!scanState.scanning) {
            Noble.startScanning();
          } else {
            Noble.stopScanning();
          }
          break;
        case 'usb':
          break;
        default:
          return;
      }
      /* Dispatch the event */
      // dispatch(changeScanState(scanState.method, startScan));
    }
  };
}

/* [] - END OF FILE */

