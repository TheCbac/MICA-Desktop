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
  foundDeviceActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType
} from '../types/actionTypes';
import { getPeripheralFromList } from '../utils/deviceUtils';


/* Default state of the devicesReducer */
export const defaultState = {
  advertising: [],
  connecting: [],
  connected: []
};

/* Handlers to create reducers  */
export const deviceHandlers = {
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
  },
  /* Attempting to connect to a device: move from advertising to connecting */
  CONNECTING_TO_DEVICE(
    state: devicesStateType,
    action: connectingToDeviceActionType
  ): devicesStateType {
    /* Get the peripheral and index from the advertising list */
    const { peripheral, index } = getPeripheralFromList(
      state.advertising, action.payload.peripheralId
    );
    /* Add the peripheral to the connecting list */
    /* Remove the peripheral from the advertising list */
    return update(state, {
      connecting: { $push: [peripheral] },
      advertising: { $splice: [[index, 1]] }
    });
  },
  /* Connection successful, move from connecting list to connected */
  CONNECTED_TO_DEVICE(
    state: devicesStateType,
    action: connectedToDeviceActionType
  ): devicesStateType {
    /* Get the peripheral and index from the connecting list */
    const { peripheral, index } = getPeripheralFromList(
      state.connecting, action.payload.peripheralId
    );
    /* Add the peripheral to the connecting list */
    /* Remove the peripheral from the advertising list */
    return update(state, {
      connected: { $push: [peripheral] },
      connecting: { $splice: [[index, 1]] }
    });
  }
};

export default createReducer(defaultState, deviceHandlers);

/* [] - END OF FILE */
