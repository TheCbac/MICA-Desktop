/* @flow */
/* **********************************************************
* File: containers/DeveloperContainer.js
*
* Brief: Container for holding the DeveloperPage
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - Document created
*
********************************************************* */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeveloperPage from '../components/Developer/DeveloperPage';
import { setDeviceName, initiateOtaUpdate } from '../actions/developerActions';

function mapStateToProps(state) {
  return {
    devices: state.devices
  };
}

/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  setDeviceName,
  initiateOtaUpdate
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperPage);

/* [] - END OF FILE */
