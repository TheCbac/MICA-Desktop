// @flow
/* **********************************************************
* File: DevicesPage.js
*
* Brief: Container for the Devices page
*
* Author: Craig Cheney
* 2017.08.27 CC - Changed name to DevicesPage.js (from HomePage)
* 2017.04.27 CC - Document created
*
**********************************************************/
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import scanForDevices from '../components/ScanForDevicesComponent';
import {
  changeScanMethod,
  enableScanMethod,
  startStopScan,
  connectToDevice,
  cancelPendingConnection,
  disconnectFromDevice
} from '../actions/ScanForDevicesActions';
import { foundAdvertisingDevice } from '../actions/devicesActions';
import type { stateType } from '../types/stateTypes';

/* Pass the state values into the props */
function mapStateToProps(state: stateType) {
  return {
    method: state.scanForDevices.method,
    enabled: state.scanForDevices.enabled,
    scanning: state.scanForDevices.scanning,
    advertisingDevices: state.devices.advertising,
    connectingDevices: state.devices.connecting,
    connectedDevices: state.devices.connected,
    disconnectingDevices: state.devices.disconnecting
    // devices: state.devices.advertising.concat(state.devices.connecting, state.devices.connected)
  };
}
/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  changeScanMethod,
  enableScanMethod,
  startStopScan,
  foundAdvertisingDevice,
  connectToDevice,
  disconnectFromDevice,
  cancelPendingConnection
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(scanForDevices);

/* [] - END OF FILE */
