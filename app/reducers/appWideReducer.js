// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* **********************************************************
* File: reducers/devicesReducer.js
*
* Brief: Reducer for interactive with devices
*
* Author: Craig Cheney
* Date: 2017.07.10
*
********************************************************* */
import update from 'immutability-helper';
import createReducer from './createReducer';
import type { appWideStateType } from '../types/stateTypes';
import type { updatePendingActionType } from '../types/appWideActionTypes';

export const defaultState: appWideStateType = {
  update: {
    pending: false,
    version: ''
  }
};

const deviceHandlers = {
  /* An application update is pending */
  UPDATE_PENDING(
    state: appWideStateType,
    action: updatePendingActionType
  ) {
    return update(state, {
      $set: {
        update: {
          pending: true,
          version: action.payload.version
        }
      }
    });
  }
};
export default createReducer(defaultState, deviceHandlers);


/* [] - END OF FILE */
