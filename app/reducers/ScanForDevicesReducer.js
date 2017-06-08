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
import type {
  scanStateType,
  changeScanActionType,
  enableScanActionType
} from '../types/actionTypes';

const defaultState = {
  method: 'ble',
  enabled: false
};

/* Handlers to create reducers  */
const scanForDeviceHandlers = {
  CHANGE_SCAN_METHOD(
    state: scanStateType = defaultState,
    action: changeScanActionType): scanStateType {
    /* Copy and return the new state object */
    return { ...state, method: action.payload.method };
  },
  ENABLE_SCAN_METHOD(
    state: scanStateType,
    action: enableScanActionType): scanStateType {
    /* Change the state if the method matches the active method */
    if (action.payload.method === state.method) {
      return { ...state, enabled: action.payload.enable };
    }
    return { ...state };
  }
};

export default createReducer(defaultState, scanForDeviceHandlers);

/* [] - END OF FILE */
