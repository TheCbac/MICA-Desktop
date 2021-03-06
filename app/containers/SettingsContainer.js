/* @flow */
/* **********************************************************
* File: SettingsContainer.js
*
* Brief: Container for the Sensor & Generators settings page
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Changed name to SettingsContainer.js (from SenGenPage)
* 2017.08.30 CC - Document created
*
********************************************************* */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SettingsPage from '../components/Settings/SettingsPage';
import {
  setSensorActive,
  setGeneratorActive,
  setSensorChannels,
  setSensorParams,
  setDeviceActive
} from '../actions/devicesActions';
import { zeroSensor } from '../actions/collectionActions';


function mapStateToProps(state) {
  return {
    devices: state.devices
  };
}


/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  setDeviceActive,
  setSensorActive,
  setGeneratorActive,
  setSensorChannels,
  setSensorParams,
  zeroSensor
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

/* [] - END OF FILE */
