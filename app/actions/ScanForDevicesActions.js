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
import type { actionType, scanTypes } from '../types/actionTypes';

export const CHANGE_SCAN_METHOD = 'CHANGE_SCAN_METHOD';

/* Action method for changing active method */
export function changeScanMethod(newMethod: scanTypes): actionType {
  return {
    type: CHANGE_SCAN_METHOD,
    payload: newMethod
  };
}

/* [] - END OF FILE */
