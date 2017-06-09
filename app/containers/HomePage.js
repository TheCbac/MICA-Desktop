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
import { changeScanMethod, enableScanMethod } from '../actions/ScanForDevicesActions';
import store from '../index';
/* Pass the methods into the component */
function mapStateToProps(state) {
  return {
    method: state.ScanForDevices.method,
    enabled: state.ScanForDevices.enabled,
    scanning: false
  };
}

const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  changeScanMethod,
  enableScanMethod
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

/* [] - END OF FILE */
