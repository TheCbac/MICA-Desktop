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

export const CHANGE_SCAN_METHOD = 'CHANGE_SCAN_METHOD';

export function changeScanMethod(newMethod: 'ble' | 'usb') {
  return {
    type: CHANGE_SCAN_METHOD,
    method: newMethod
  };
}
