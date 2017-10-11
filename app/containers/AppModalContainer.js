/* @flow */
/* **********************************************************
* File: containers/AppModalContainer.js
*
* Brief: Modals that can get triggered on any page
*
* Authors: Craig Cheney
*
* 2017.09.19 CC - Document created
*
********************************************************* */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modals from '../components/modals/Modals';
import { showUserSettings, enableDeveloper } from '../actions/appWideActions';

function mapStateToProps(state) {
  return {
    update: {
      pending: state.appWide.update.pending,
      version: state.appWide.update.version
    },
    userSettings: {
      show: state.appWide.userSettings.show,
      developer: state.appWide.userSettings.developer,
    }
  };
}


/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({
  showUserSettings,
  enableDeveloper
}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(Modals);

/* [] - END OF FILE */

