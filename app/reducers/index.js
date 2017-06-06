// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import ScanForDevices from './ScanForDevicesReducer';

const rootReducer = combineReducers({
  ScanForDevices,
  router,
});

export default rootReducer;
