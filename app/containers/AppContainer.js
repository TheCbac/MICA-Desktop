/* @flow */
/* **********************************************************
* File: containers/AppContainer.js
*
* Brief: Top level container for the application
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - Document created
*
********************************************************* */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import { showUserSettings } from '../actions/appWideActions';

function mapStateToProps(state) {
  return {
    developer: state.appWide.userSettings.developer
  };
}

/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  showUserSettings
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(App);

/* [] - END OF FILE */
