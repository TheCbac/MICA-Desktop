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
import scanForDevices from '../components/ScanForDevicesComponent';
import {
  changeScanMethod,
  enableScanMethod,
  startStopScan,
  connectToDevice
} from '../actions/ScanForDevicesActions';
import { foundAdvertisingDevice } from '../actions/devicesActions';
import type { stateType } from '../types/stateTypes';

/* Pass the state values into the props */
function mapStateToProps(state: stateType) {
  return {
    method: state.scanForDevices.method,
    enabled: state.scanForDevices.enabled,
    scanning: state.scanForDevices.scanning,
    advertisingDevices: state.devices.advertising
  };
}
/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  changeScanMethod,
  enableScanMethod,
  startStopScan,
  foundAdvertisingDevice,
  connectToDevice
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(scanForDevices);

/* [] - END OF FILE */
