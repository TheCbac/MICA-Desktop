// @flow
/* **********************************************************
* File: index.js
*
* Brief: Combines all of the reducers into one. Very
*   important that the name of the reducer is the same
*   everywhere
*
* Author: Craig Cheney
*
* 2017.07.10 CC - Document created
*
********************************************************* */
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import scanForDevicesReducer from './ScanForDevicesReducer';
import devicesReducer from './devicesReducer';
import appWideReducer from './appWideReducer';
import collectionReducer from './collectionReducer';


/* The reducer key names the State Object */
const reducers = {
  scanForDevices: scanForDevicesReducer,
  devices: devicesReducer,
  appWide: appWideReducer,
  collection: collectionReducer,
  router
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
/* [] - END OF FILE */
