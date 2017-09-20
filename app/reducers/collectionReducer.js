// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* **********************************************************
* File: reducers/collectionReducer.js
*
* Brief: Reducer for collecting data and graph events
*
* Author: Craig Cheney
*
*
********************************************************* */
import update from 'immutability-helper';
import createReducer from './createReducer';
import type { collectionStateType } from '../types/stateTypes';
import type {
  toggleCollectionStateActionType,
  updateGraphSettingsActionType
} from '../types/collectionActionTypes';

export const defaultState: collectionStateType = {
  collecting: false,
  graphSettings: {
    horizontalScale: 5,
    pausedDisplay: false
  }
};

const deviceHandlers = {
  /* Change whether or not the state is collecting data */
  TOGGLE_COLLECTION_STATE(
    state: collectionStateType,
    action: toggleCollectionStateActionType
  ) {
    return update(state, {
      collecting: {
        $set: action.payload.newState
      }
    });
  },
  /* Update the graph settings */
  UPDATE_GRAPH_SETTINGS(
    state: collectionStateType,
    action: updateGraphSettingsActionType
  ) {
    return update(state, {
      graphSettings: {
        $set: action.payload
      }
    });
  },
};
export default createReducer(defaultState, deviceHandlers);


/* [] - END OF FILE */
