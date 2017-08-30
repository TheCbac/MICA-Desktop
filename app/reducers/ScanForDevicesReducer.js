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
import update from 'immutability-helper';
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
  scanning: false,
  timeoutId: undefined
};

/* Handlers to create reducers  */
const scanForDeviceHandlers = {
  /* Selects the scanning method */
  CHANGE_SCAN_METHOD(
    state: scanStateType = defaultState,
    action: changeScanActionType): scanStateType {
    /* Set the scan method, enable state, and stop scanning */
    return update(state, {
      method: { $set: action.payload.method },
      enabled: { $set: action.payload.enable },
      scanning: { $set: false }
    });
  },
  /* Enables or disables the ability to scan */
  ENABLE_SCAN_METHOD(
    state: scanStateType,
    action: enableScanActionType): scanStateType {
    /* Change the state if the method matches the active method */
    if (action.payload.method === state.method) {
      /* Enable or disable, stop the scan */
      return update(state, {
        enabled: { $set: action.payload.enable },
        scanning: { $set: false }
      });
    }
    return state;
  },
  /* Sets whether the app is scanning or not */
  CHANGE_SCAN_STATE(
    state: scanStateType,
    action: scanStateActionType): scanStateType {
    /* Only change the active method */
    if (action.payload.method === state.method) {
      /* Set the scanning state, store the timeoutId */
      return update(state, {
        scanning: { $set: action.payload.state },
        timeoutId: { $set: action.payload.timeoutId }
      });
    }
    return state;
  }
};

export default createReducer(defaultState, scanForDeviceHandlers);

/* [] - END OF FILE */
