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
import ScanForDevices from '../components/ScanForDevicesComponent';
import {
  changeScanMethod,
  enableScanMethod,
  startStopScan
} from '../actions/ScanForDevicesActions';

/* Pass the state values into the props */
function mapStateToProps(state) {
  return {
    method: state.ScanForDevices.method,
    enabled: state.ScanForDevices.enabled,
    scanning: state.ScanForDevices.scanning,
    advertisingDevices: undefined
  };
}
/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  changeScanMethod,
  enableScanMethod,
  startStopScan
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(ScanForDevices);

/* [] - END OF FILE */
