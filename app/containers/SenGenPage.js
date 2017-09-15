/* @flow */
/* **********************************************************
* File: senGenPage.js
*
* Brief: Container for the Sensor & Generators settings page
*
* Author: Craig Cheney
*
* 2017.08.30 CC - Document created
*
********************************************************* */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sensorSettings from '../components/sensorSettingsComponent';
import {
  getSelectedDevices,
  setSelectedDevices,
} from '../actions/senGenActions';
import {
  setSensorActive,
  setGeneratorActive,
  setSensorChannels,
  setSensorParams
} from '../actions/devicesActions';


function mapStateToProps(state) {
  return {
    selected: state.devices.selected,
    unselected: state.devices.unselected,
    deviceSettings: state.devices.deviceSettings
  };
}


/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  getSelectedDevices,
  setSelectedDevices,
  setSensorActive,
  setGeneratorActive,
  setSensorChannels,
  setSensorParams
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(sensorSettings);

/* [] - END OF FILE */
