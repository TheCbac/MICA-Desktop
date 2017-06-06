// @flow
/* **********************************************************
* File: index.js
*
* Brief: Combines all of the reducers into one.
*
* Author: Craig Cheney
* Date: 2017.06.06
*
**********************************************************/
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import ScanForDevices from './ScanForDevicesReducer';

const rootReducer = combineReducers({
  ScanForDevices,
  router,
});

export default rootReducer;
/* [] - END OF FILE */
