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
  const devices = {};
  if (state.devices) {
    const deviceIds = Object.keys(state.devices);
    /* Only use active and connected devices */
    for (let i = 0; i < deviceIds.length; i++) {
      const id = deviceIds[i];
      if (state.devices[id].state === 'connected' && state.devices[id].active) {
        devices[id] = state.devices[id];
      }
    }
  }
  return {
    // devices: state.devices,
    devices,
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

