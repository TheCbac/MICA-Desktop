// @flow
/* **********************************************************
* File: homePage.js
*
* Brief: Container for the Devices page
*
* Author: Craig Cheney
* Date: 2017.04.27
*
**********************************************************/
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Noble from 'noble';
import ScanForDevices from '../components/ScanForDevicesComponent';
import {
  changeScanMethod,
  changeScanState,
  enableScanMethod,
  startStopScan
} from '../actions/ScanForDevicesActions';
import store from '../index';
/* Pass the state values into the props */
function mapStateToProps(state) {
  return {
    method: state.ScanForDevices.method,
    enabled: state.ScanForDevices.enabled,
    scanning: state.ScanForDevices.scanning
  };
}
/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  changeScanMethod,
  enableScanMethod,
  startStopScan
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(ScanForDevices);

/* Noble callback */
Noble.on('stateChange', (state: string) => {
  let enabled = false;
  if (state === 'poweredOn') {
    enabled = true;
  }
  /* Dispatch the action */
  store.dispatch(enableScanMethod('ble', enabled));
});

/* The Noble BLE scan has started, dispatch an event */
Noble.on('scanStart', () => {
  store.dispatch(changeScanState('ble', true));
});
/* The Noble BLE Scan has stopped, update the state */
Noble.on('scanStop', () => {
  store.dispatch(changeScanState('ble', false));
});

/* [] - END OF FILE */
