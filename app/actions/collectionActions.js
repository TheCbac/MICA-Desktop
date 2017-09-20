// @flow
/* **********************************************************
* File: actions/collectionActions.js
*
* Brief: Actions that span the entire app
*
* Authors: Craig Cheney
*
* 2017.09.19 CC - Document created
*
********************************************************* */
import type {
  toggleCollectionStateActionType,
  updateGraphSettingsActionType
} from '../types/collectionActionTypes';
import type { stateType, graphSettingsType } from '../types/stateTypes';
import type { thunkType } from '../types/functionTypes';


export const TOGGLE_COLLECTION_STATE = 'TOGGLE_COLLECTION_STATE';
export const UPDATE_GRAPH_SETTINGS = 'UPDATE_GRAPH_SETTINGS';

/* Set the state whether or not the app is collecting data */
export function toggleCollectionState(newState: boolean): toggleCollectionStateActionType {
  return {
    type: TOGGLE_COLLECTION_STATE,
    payload: {
      newState
    }
  };
}

/* Start collecting data */
export function startCollecting(): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the new state */
    const collectionSettings = getState().collection;
    /* Update the object */
    dispatch(toggleCollectionState(true));
  };
}

/* Stop collecting data */
export function stopCollecting(): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the new state */
    const collectionSettings = getState().collection;
    /* Update the object */
    dispatch(toggleCollectionState(false));
  };
}

/* Update the graph settings */
export function updateGraphSettings(
  graphSettings: graphSettingsType
): updateGraphSettingsActionType {
  return {
    type: UPDATE_GRAPH_SETTINGS,
    payload: { ...graphSettings }
  };
}

/* [] - END OF FILE */
