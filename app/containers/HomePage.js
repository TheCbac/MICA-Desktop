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
import ScanForDevices from '../components/ScanForDevices';
import * as ScanActions from '../actions/ScanForDevices';

function mapStateToProps(state) {
  return {
    scanningMethod: state.ScanForDevices.scanningMethod,
    methodEnabled: state.ScanForDevices.methodEnabled
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ScanActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanForDevices);
