// @flow
/* **********************************************************
* File: index.js
*
* Brief: Combines all of the reducers into one. Very
*   important that the name of the redcucer is the same
*   everywhere
*
* Author: Craig Cheney
* Date: 2017.07.10
*
********************************************************* */
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import scanForDevicesReducer from './ScanForDevicesReducer';
import devicesReducer from './devicesReducer';
import appWideReducer from './appWideReducer';

/* The reducer key names the State Object */
const reducers = {
  scanForDevices: scanForDevicesReducer,
  devices: devicesReducer,
  appWide: appWideReducer,
  router
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
/* [] - END OF FILE */
