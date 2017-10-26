/* @flow */
/* **********************************************************
* File: components/Developer/OtaUpdate.js
*
* Brief: Component for managing over the air updates for a
* a MICA Cube
*
* Authors: Craig Cheney
*
* 2017.10.22 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import {
  Col, Row, FormGroup,
  FormControl, Button, ButtonToolbar, InputGroup
} from 'react-bootstrap';
import { remote } from 'electron';
import DeviceSelector from './DeviceSelector';
import type { idType } from '../../types/paramTypes';
import type { devicesStateType } from '../../types/stateTypes';
import type { thunkType } from '../../types/functionTypes';


type propsT = {
  devices: devicesStateType,
  initiateOtaUpdate: (deviceId: idType, hexPath: string) => thunkType
};
type stateT = {
  deviceId: idType,
  fileName: string,
  fileNameFocus: boolean
};

export default class OtaUpdate extends Component {
  state: stateT;
  props: propsT;

  constructor(props: propsT) {
    super(props);
    /* Set the default state */
    this.state = {
      deviceId: '',
      fileName: '',
      fileNameFocus: false
    };
  }
  /* Callback for updating the state when a device is selected */
  deviceSelected = (deviceId: string): void => {
    this.setState({ deviceId });
  }
  /* Handle select file btn */
  showSelectFileDialog = () => {
    const options = {
      title: 'HEX FILE',
      filters: [
        { name: 'CYACD Files', extensions: ['cyacd'] }
      ],
      properties: ['openFile', 'createDirectory']
    };
    remote.dialog.showOpenDialog(options, (filePath?: string[]) => {
      if (filePath) {
        this.setState({ fileName: filePath[0] });
      }
    });
  }
  /* Manually type into the name field */
  handleNameInput = ({ target }: SyntheticInputEvent): void => {
    this.setState({ fileName: target.value });
  }
  /* Name to display in the dialog box */
  displayShortFileName(): string {
    const maxLen = 45;
    const { fileName, fileNameFocus } = this.state;
    if (fileName.length > maxLen && !fileNameFocus) {
      /* Split array by '/' and '\' */
      const fileArray = fileName.split(/[/\\]+/);
      const fileLen = fileArray.length;
      /* Use the file name */
      let shortName = '';
      /* Iterate through each token */
      for (let i = 1; i <= fileLen; i++) {
        const token = fileArray[fileLen - i];
        /* Look ahead to see if longer than max */
        if (shortName.length + token.length > maxLen) {
          return `...${shortName}`;
        }
        /* Lengthen name */
        shortName = `/${token}${shortName}`;
      }
      return shortName;
    }
    return fileName;
  }
  /* State of the Update button (true => disabled) */
  updateBtnDisableState(): boolean {
    const { deviceId, fileName } = this.state;
    /* Must be a valid device, and valid file */
    if (!deviceId || !fileName.endsWith('.cyacd')) {
      return true;
    }
    return false;
  }
  /* Initiate a firmware update */
  updateFirmware = () => {
    const { deviceId, fileName } = this.state;
    this.props.initiateOtaUpdate(deviceId, fileName);
  }
  render() {
    const nameStyle = {
      backgroundColor: '#E0E5E8',
      paddingBottom: '10px',
      border: '2px solid #6c6d6d',
      borderRadius: '10px'
    };
    const titleStyle = {
      color: '#6845a6',
      borderBottom: '1px solid black'
    };

    return (
      <Col md={6} style={nameStyle}>
        <Col md={12} mdOffset={0} style={titleStyle} className="text-center">
          <h4>UPDATE DEVICE FIRMWARE</h4>
        </Col>
        <Row />
        <DeviceSelector devices={this.props.devices} deviceSelected={this.deviceSelected} />
        <Row />
        <Col md={12} mdOffset={0}>
          <FormGroup controlId="formChangeName">
            <InputGroup>
              <FormControl
                type="text"
                style={{ fontSize: '0.9em' }}
                placeholder="HEX.CYACD"
                onChange={this.handleNameInput}
                value={this.displayShortFileName()}
                onFocus={() => this.setState({ fileNameFocus: true })}
                onBlur={() => this.setState({ fileNameFocus: false })}

              />
              <InputGroup.Button>
                <Button
                  id="updateFirmwareBtn"
                  onClick={this.showSelectFileDialog}
                >Select File</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Col>
        <Row />
        <Col md={4} mdOffset={2}>
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              onClick={this.updateFirmware}
              disabled={this.updateBtnDisableState()}
            >UPDATE FIRMWARE</Button>
          </ButtonToolbar>
        </Col>
      </Col>
    );
  }

}

/* [] - END OF FILE */
