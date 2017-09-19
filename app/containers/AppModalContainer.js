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
import UpdateModal from '../components/UpdateModal';


function mapStateToProps(state) {
  return {
    pending: state.appWide.update.pending,
    version: state.appWide.update.version
  };
}


/* Action creators to be used in the component */
const mapDispatchToProps = (dispatcher: *) => bindActionCreators({

}, dispatcher);

export default connect(mapStateToProps, mapDispatchToProps)(UpdateModal);

/* [] - END OF FILE */

