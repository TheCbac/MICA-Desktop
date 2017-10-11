// @flow
/* **********************************************************
* File: types/appWideActionTypes.js
*
* Brief: Type def for Actions that span the entire app
*
* Authors: Craig Cheney
*
* 2017.09.18 CC - Document created
*
********************************************************* */

export type updatePendingActionType = {
  type: 'UPDATE_PENDING',
  payload: {
    version: string
  }
};

export type showUserSettingsActionT = {
  type: 'SHOW_USER_SETTINGS',
  payload: {
    show: boolean
  }
};

export type enableDeveloperActionT = {
  type: 'ENABLE_DEVELOPER',
  payload: {
    developer: boolean
  }
};
/* [] - END OF FILE */
