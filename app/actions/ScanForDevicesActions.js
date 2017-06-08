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
import type { enableScanActionType, changeScanActionType, scanTypes } from '../types/actionTypes';


let Noble;
try {
  Noble = require('noble');
} catch (e) {
  Noble = { state: false };
}

export const CHANGE_SCAN_METHOD = 'CHANGE_SCAN_METHOD';
export const ENABLE_SCAN_METHOD = 'ENABLE_SCAN_METHOD';

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

/* Enable the method */
export function enableScanMethod(method: scanTypes, enable: boolean): enableScanActionType {
  return {
    type: ENABLE_SCAN_METHOD,
    payload: {
      method,
      enable
    }
  };
}

/* [] - END OF FILE */

