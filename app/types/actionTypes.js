// @flow
/* **********************************************************
* File: types/actionTypes.js
*
* Brief: Types for the various actions
* https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
* Author: Craig Cheney
* Date: 2017.04.28
*
**********************************************************/
/* Different scan types available */
export type scanTypes = 'usb' | 'ble';

/* Type for changing the scanning type */
export type changeScanActionType = {
  type: 'CHANGE_SCAN_METHOD',
  scanningMethod: scanTypes
};

/* State Type */
export type scanStateType = {
  scanningMethod: scanTypes,
  methodEnabled: boolean
};

/* [] - END OF FILE */
