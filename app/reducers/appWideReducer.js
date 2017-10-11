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
import type {
  updatePendingActionType,
  showUserSettingsActionT,
  enableDeveloperActionT
} from '../types/appWideActionTypes';

export const defaultState: appWideStateType = {
  update: {
    pending: false,
    version: ''
  },
  userSettings: {
    show: false,
    developer: false
  }
};

const deviceHandlers = {
  /* An application update is pending */
  UPDATE_PENDING(
    state: appWideStateType,
    action: updatePendingActionType
  ) {
    return update(state, {
      update: {
        $set: {
          pending: true,
          version: action.payload.version
        }
      }
    });
  },
  /* Show or hide user settings */
  SHOW_USER_SETTINGS(
    state: appWideStateType,
    action: showUserSettingsActionT
  ) {
    return update(state, {
      userSettings: {
        show: {
          $set: action.payload.show
        }
      }
    });
  },
  /* Enable developer options */
  ENABLE_DEVELOPER(
    state: appWideStateType,
    action: enableDeveloperActionT
  ) {
    return update(state, {
      userSettings: {
        developer: {
          $set: action.payload.developer
        }
      }
    });
  }
};
export default createReducer(defaultState, deviceHandlers);


/* [] - END OF FILE */
