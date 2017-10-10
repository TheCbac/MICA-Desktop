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

function mapStateToProps(state) {
  return {
  };
}

/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({

}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperPage);

/* [] - END OF FILE */
