// @flow
/* **********************************************************
* File: types/bleTypes.js
*
* Brief: Contains the typedefs for BLE functions
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document created
********************************************************* */
import type { scanTypes } from './paramTypes';

/* Wrapper object - Really these return bleApiResultType seems like a flow bug */
export type bleWrapperObjType = {
  method: scanTypes,
  bleMethod: () => *,
  usbMethod: () => *
};

/* Result from a ble call */
export type bleApiResultType = {
  success: boolean,
  error?: string,
  payload?: {}
};

/* [] - END OF FILE */
