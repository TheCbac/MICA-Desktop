/* @flow */
/* **********************************************************
* File: components/Developer/ChangeDeviceName.js
*
* Brief: Component for settings a device's name
*
* Authors: Craig Cheney
*
* 2017.10.23 CC - Abstracted out DeviceSelector component
* 2017.10.10 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import {
  Col, Row, FormGroup, ControlLabel,
  FormControl, Button, ButtonToolbar
} from 'react-bootstrap';
import DeviceSelector from './DeviceSelector';
import type { devicesStateType } from '../../types/stateTypes';
import type { idType } from '../../types/paramTypes';
import type { thunkType } from '../../types/functionTypes';

type propsT = {
  devices: devicesStateType,
  setDeviceName: (deviceId: idType, name: string) => thunkType
};
type stateT = {
  name: string,
  deviceId: string
};

const nameMinLen = 4;
const nameMaxLen = 25;

export default class ChangeDeviceName extends Component<propsT, stateT> {
  /* Constructor function */
  constructor(props: propsT) {
    super(props);
    /* Set the default state */
    this.state = {
      name: '',
      deviceId: ''
    };
  }

  /* Handle name and validate state */
  handleName = ({ target }: SyntheticInputEvent<>): void => {
    this.setState({ name: target.value });
  }
  nameValidation(): ?'error' {
    const length = this.state.name.length;
    if ((length && length < nameMinLen) || length > nameMaxLen) {
      return 'error';
    }
  }
  /* Is the button disabled or not (true => disabled) */
  submitDisabled(): boolean {
    const length = this.state.name.length;
    const idExists = !!this.state.deviceId;
    /* Ensure a valid device is selected */
    if (!idExists) { return true; }
    /* Ensure name length req's are met */
    if (length >= nameMinLen && length <= nameMaxLen) {
      return false;
    }
    return true;
  }
  /* Execute the change name request */
  changeName = () => {
    const { deviceId, name } = this.state;
    console.log('change name');
    this.props.setDeviceName(deviceId, name);
  }
  /* Callback for updating the state when a device is selected */
  deviceSelected = (deviceId: string): void => {
    this.setState({ deviceId });
  }
  /* ** RENDER ** */
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
        <Col md={10} mdOffset={1} style={titleStyle} className="text-center">
          <h4>CHANGE DEVICE NAME</h4>
        </Col>
        <Row />
        <DeviceSelector devices={this.props.devices} deviceSelected={this.deviceSelected} />
        <Row />
        <Col md={8} mdOffset={2}>
          <FormGroup controlId="formChangeName" validationState={this.nameValidation()}>
            <ControlLabel>NEW NAME</ControlLabel>
            <FormControl onChange={this.handleName} componentClass="textarea" placeholder="NAME" />
          </FormGroup>
        </Col>
        <Row />
        <Col md={4} mdOffset={2}>
          <ButtonToolbar>
            <Button
              disabled={this.submitDisabled()}
              bsStyle="primary"
              onClick={this.changeName}
            >SET NAME</Button>
          </ButtonToolbar>
        </Col>
      </Col>
    );
  }
}

/* [] - END OF FILE */
