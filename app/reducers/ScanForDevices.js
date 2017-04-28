// @flow
/* **********************************************************
* File: reducers/ScanForDevices.js
*
* Brief: Reducer for the storing scan page
*
* Author: Craig Cheney
* Date: 2017.04.28
*
**********************************************************/
import { CHANGE_SCAN_METHOD } from '../actions/ScanForDevices.js';

export type scanStateType = {
  scanningMethod: 'usb' | 'ble',
  methodEnabled: boolean
};

type actionType = {
  type: string
};

const defaultState = {
  scanningMethod: 'ble',
  methodEnabled: false
};

export default function ScanForDevices(state: scanStateType = defaultState, action: actionType) {
  switch (action.type) {
    case CHANGE_SCAN_METHOD:
      return Object.assign({}, state, {
        scanningMethod: action.method
      });
    default:
      return state;
  }
}
