// @flow
/* **********************************************************
* File: reducers/devicesReducer.js
*
* Brief: Reducer for interactive with devices
*
* Author: Craig Cheney
* Date: 2017.07.10
*
**********************************************************/
import createReducer from './createReducer';
import type {
  devicesStateType
} from '../types/stateTypes';
import type {
  foundDeviceActionType
} from '../types/actionTypes';

/* Default state of the devicesReducer */
const defaultState = {
  devices: {
    advertising: [],
    connected: []
  }
};

/* Handlers to create reducers  */
const deviceHandlers = {
  /* An advertising device was found */
  FOUND_ADVERTISING_DEVICE(
    state: devicesStateType,
    action: foundDeviceActionType,
  ): devicesStateType {
    /* copy state */
    const stateCopy = { ...state };
    /* Add devices to advertising list */
    stateCopy.advertising.push(action.payload.peripheral);
    return stateCopy;
  }
};

export default createReducer(defaultState, deviceHandlers);

/* [] - END OF FILE */
