/* @flow */
/* **********************************************************
* File: containers/CollectDataContainer.js
*
* Brief: Actions for the scanning devices
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CollectDataPage from '../components/CollectData/CollectDataPage';
import {
  startCollecting,
  stopCollecting,
  updateGraphSettings
} from '../actions/collectionActions';

function mapStateToProps(state) {
  return {
    connectedDevices: state.devices.connectedDevices,
    deviceSettings: state.devices.deviceSettings,
    collectionSettings: state.collection
  };
}


/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  startCollecting,
  stopCollecting,
  updateGraphSettings

}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(CollectDataPage);

/* [] - END OF FILE */

