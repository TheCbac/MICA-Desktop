// @flow
/* **********************************************************
* File: appWideActionTypes.js
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
/* [] - END OF FILE */
