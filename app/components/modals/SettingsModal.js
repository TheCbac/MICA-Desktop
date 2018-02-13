// @flow
/* **********************************************************
* File: SettingsModal.js
*
* Brief: Modal for changing user settings
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Modal, Button, Col, Row, FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import type {
  showUserSettingsActionT,
  enableDeveloperActionT
} from '../../types/appWideActionTypes';

type PropsType = {
  show: boolean,
  developer: boolean,
  showUserSettings: (boolean) => showUserSettingsActionT,
  enableDeveloper: (boolean) => enableDeveloperActionT
};
export default class SettingsModal extends Component<PropsType> {
  render() {
    const { show, developer } = this.props;
    return (
      <div>
        <Modal show={show} bsSize="large">
          <Modal.Header>
            <Modal.Title className={'text-center'}>USER SETTINGS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>OPTIONS</h3>
            <form>
              <FormGroup>
                <Checkbox
                  checked={developer}
                  onChange={() => this.props.enableDeveloper(!developer)}
                >
                Enable Developer Tools
              </Checkbox>
              </FormGroup>
              <h3>ACCOUNTS</h3>
              {'MICA Accounts are not supported at this time'}
              <h3>ABOUT</h3>
              {'The MICA group is part of the BioInstrumentation Laboratory at MIT'}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="default" onClick={() => this.props.showUserSettings(false)}>CLOSE</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

/* [] - END OF FILE */
