// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* **********************************************************
* File: reducers/appWideReducer.js
*
* Brief: Reducer for App wide events, such as Auto-Update modals
*   and disconnect from devices
*
* Author: Craig Cheney
*
* 2017.09.18 CC - Document created
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
