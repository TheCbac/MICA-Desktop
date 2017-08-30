// @flow
/* **********************************************************
* File: senGenPage.js
*
* Brief: Container for the Sensor & Generators settings page
*
* Author: Craig Cheney
*
* 2017.08.30 CC - Document created
*
**********************************************************/
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sensorSettings from '../components/sensorSettingsComponent';

function mapStateToProps(state) {
  return {
    active: {
      sensor: undefined,
      generator: undefined
    }
  };
}


/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({

}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(sensorSettings);

/* [] - END OF FILE */
