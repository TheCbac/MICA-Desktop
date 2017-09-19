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
import type { updatePendingActionType } from '../types/appWideActionTypes';

export const UPDATE_PENDING = 'UPDATE_PENDING';

export function updatePending(version: string): updatePendingActionType {
  return {
    type: UPDATE_PENDING,
    payload: {
      version
    }
  };
}

/* [] - END OF FILE */
