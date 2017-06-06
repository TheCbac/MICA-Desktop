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
import type { Action } from '../types/actionTypes';

export const CHANGE_SCAN_METHOD = 'CHANGE_SCAN_METHOD';
/* Action method for changing active method */
export function changeScanMethod(newMethod: 'ble' | 'usb'): Action {
  return {
    type: CHANGE_SCAN_METHOD,
    payload: newMethod
  };
}

/* [] - END OF FILE */
