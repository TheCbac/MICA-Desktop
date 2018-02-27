// @flow
/* **********************************************************
* File: UpdateModal.js
*
* Brief: Modal that indicates to a user that an new version
*   of the app is available and will be installed shortly
*
* Authors: Craig Cheney
*
* 2017.09.18 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';


type PropsType = {
  pending: boolean,
  version: string
};
export default class UpdateModal extends Component<PropsType> {
  render() {
    return (
      <div>
        <Modal show={this.props.pending}>
          <Modal.Header>
            <Modal.Title className='text-center'>Version {this.props.version} Available</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className='text-center'>
              A newer version of MICA Desktop is available. It will be
              automatically downloaded and installed.
            </h4>
            <p />
            <h4 className='text-center'>The Application will restart shortly</h4>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

/* [] - END OF FILE */
