// @flow
/* **********************************************************
* File: reducers/ScanForDevicesReducer.js
*
* Brief: Reducer for the storing scan page
*
* Author: Craig Cheney
* Date: 2017.07.10
*
**********************************************************/
import createReducer from './createReducer';
import type { scanStateType } from '../types/stateTypes';
import type {
  changeScanActionType,
  enableScanActionType,
  scanStateActionType
} from '../types/actionTypes';

/* Default state of the ScanForDevicesReducer */
const defaultState = {
  method: 'ble',
  enabled: false,
  scanning: false
};

/* Handlers to create reducers  */
const scanForDeviceHandlers = {
  /* Selects the scanning method */
  CHANGE_SCAN_METHOD(
    state: scanStateType = defaultState,
    action: changeScanActionType): scanStateType {
    /* Copy and return the new state object */
    return {
      ...state,
      method: action.payload.method,
      enabled: action.payload.enable,
      scanning: false
    };
  },
  /* Enables or disables the ability to scan */
  ENABLE_SCAN_METHOD(
    state: scanStateType,
    action: enableScanActionType): scanStateType {
    /* Change the state if the method matches the active method */
    if (action.payload.method === state.method) {
      return { ...state, enabled: action.payload.enable, scanning: false };
    }
    return { ...state };
  },
  /* Sets whether the app is scanning or not */
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
