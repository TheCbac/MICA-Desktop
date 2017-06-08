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
// import * as ScanActions from '../actions/ScanForDevicesActions';
import { changeScanMethod } from '../actions/ScanForDevicesActions';

/* Pass the methods into the component */
function mapStateToProps(state) {
  return {
    method: state.ScanForDevices.method,
    enabled: state.ScanForDevices.enabled
  };
}

const mapDispatchToProps = (dispatch: *) => bindActionCreators({ changeScanMethod }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ScanForDevices);

/* [] - END OF FILE */
