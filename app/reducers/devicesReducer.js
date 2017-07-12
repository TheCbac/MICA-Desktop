// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }]*/
/* **********************************************************
* File: reducers/devicesReducer.js
*
* Brief: Reducer for interactive with devices
*
* Author: Craig Cheney
* Date: 2017.07.10
*
**********************************************************/
import update from 'immutability-helper';
import createReducer from './createReducer';
import type {
  devicesStateType
} from '../types/stateTypes';
import type {
  clearAdvertisingActionType,
  foundDeviceActionType
} from '../types/actionTypes';

/* Default state of the devicesReducer */
const defaultState = {
  advertising: [],
  connected: []
};

/* Handlers to create reducers  */
const deviceHandlers = {
  /* Clear the advertising list */
  CLEAR_ADVERTISING_LIST(
    state: devicesStateType,
    action: clearAdvertisingActionType
  ): devicesStateType {
    /* Return copy of new data  */
    return update(state, { advertising: { $set: [] } });
  },
  /* An advertising device was found */
  FOUND_ADVERTISING_DEVICE(
    state: devicesStateType,
    action: foundDeviceActionType,
  ): devicesStateType {
    /* Must deep copy, not just shallow copy */
    return update(state, { advertising: { $push: [action.payload.peripheral] } });
  }
};

export default createReducer(defaultState, deviceHandlers);

/* [] - END OF FILE */
