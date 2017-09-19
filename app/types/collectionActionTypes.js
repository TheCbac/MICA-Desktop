// @flow
/* **********************************************************
* File: types/collectionActionTypes.js
*
* Brief: Type def for Actions that have to do with graphing
*   and data collection.
*
* Authors: Craig Cheney
*
* 2017.09.19 CC - Document created
*
********************************************************* */
import type { graphSettingsType } from './stateTypes';

/* Start or stop graphing */
export type toggleCollectionStateActionType = {
  type: 'TOGGLE_COLLECTION_STATE',
  payload: {
    newState: boolean
  }
};
/* Change the graph setting */
export type updateGraphSettingsActionType = {
  type: 'UPDATE_GRAPH_SETTINGS',
  payload: graphSettingsType
};

/* [] - END OF FILE */
