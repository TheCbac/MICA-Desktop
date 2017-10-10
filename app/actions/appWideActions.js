// @flow
/* **********************************************************
* File: actions/appWideActions.js
*
* Brief: Actions that span the entire app
*
* Authors: Craig Cheney
*
* 2017.09.18 CC - Document created
*
********************************************************* */
import type {
  updatePendingActionType,
  showUserSettingsActionT,
  enableDeveloperActionT
} from '../types/appWideActionTypes';

export const UPDATE_PENDING = 'UPDATE_PENDING';
export const SHOW_USER_SETTINGS = 'SHOW_USER_SETTINGS';
export const ENABLE_DEVELOPER = 'ENABLE_DEVELOPER';

/* Display updates pending modal */
export function updatePending(version: string): updatePendingActionType {
  return {
    type: UPDATE_PENDING,
    payload: {
      version
    }
  };
}

/* Show the users settings */
export function showUserSettings(show: boolean): showUserSettingsActionT {
  return {
    type: SHOW_USER_SETTINGS,
    payload: {
      show
    }
  };
}

/* Show/hide developer tab */
export function enableDeveloper(developer: boolean): enableDeveloperActionT {
  return {
    type: ENABLE_DEVELOPER,
    payload: {
      developer
    }
  };
}

/* [] - END OF FILE */
