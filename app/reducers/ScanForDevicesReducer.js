// @flow
/* **********************************************************
* File: reducers/ScanForDevicesReducer.js
*
* Brief: Reducer for the storing scan page
*
* Author: Craig Cheney
* Date: 2017.04.28
*
**********************************************************/
import createReducer from './createReducer';
import type { scanStateType, changeScanActionType } from '../types/actionTypes';

const defaultState = {
  method: 'ble',
  enabled: false
};

/* handler to create reducer from  */
const scanForDeviceHandlers = {
  CHANGE_SCAN_METHOD(state: scanStateType = defaultState, action: changeScanActionType) {
    /* Copy and return the new state object */
    return { ...state, method: action.payload.method };
  }
};

export default createReducer(defaultState, scanForDeviceHandlers);

/* [] - END OF FILE */
