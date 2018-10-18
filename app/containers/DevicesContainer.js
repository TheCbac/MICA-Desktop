// @flow
/* **********************************************************
* File: DevicesContainer.js
*
* Brief: Container for the Devices page
*
* Author: Craig Cheney

* 2017.09.25 CC - Changed name to DevicesContainer.js (from DevicesPage)
* 2017.08.27 CC - Changed name to DevicesPage.js (from HomePage)
* 2017.04.27 CC - Document created
*
********************************************************* */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DevicesPage from '../components/Devices/DevicesPage';
import {
  changeScanMethodAsync,
  startStopScan,
  connectToDevice,
  cancelPendingConnection,
  disconnectFromDevice
} from '../actions/ScanForDevicesActions';
import type { stateType } from '../types/stateTypes';

/* Pass the state values into the props */
function mapStateToProps(state: stateType) {
  return {
    method: state.scanForDevices.method,
    enabled: state.scanForDevices.enabled,
    scanning: state.scanForDevices.scanning,
    devices: state.devices
  };
}
/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  changeScanMethod: changeScanMethodAsync,
  startStopScan,
  connectToDevice,
  cancelPendingConnection,
  disconnectFromDevice,
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(DevicesPage);

/* [] - END OF FILE */
