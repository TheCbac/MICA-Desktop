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
  enableScanActionType,
  scanStateActionType
} from '../types/actionTypes';

const defaultState = {
  method: 'ble',
  enabled: false,
  scanning: false
};

/* Handlers to create reducers  */
const scanForDeviceHandlers = {
  CHANGE_SCAN_METHOD(
    state: scanStateType = defaultState,
    action: changeScanActionType): scanStateType {
    /* Copy and return the new state object */
    return { ...state, method: action.payload.method, enabled: action.payload.enable };
  },
  ENABLE_SCAN_METHOD(
    state: scanStateType,
    action: enableScanActionType): scanStateType {
    /* Change the state if the method matches the active method */
    if (action.payload.method === state.method) {
      return { ...state, enabled: action.payload.enable };
    }
    return { ...state };
  },
  CHANGE_SCAN_STATE(
    state: scanStateType,
    action: scanStateActionType): scanStateType {
    /* Enable scanning is */
    if (action.payload.method === state.method) {
      return { ...state, scanning: action.payload.state };
    }
    return { ...state };
  }
};

export default createReducer(defaultState, scanForDeviceHandlers);

/* [] - END OF FILE */
