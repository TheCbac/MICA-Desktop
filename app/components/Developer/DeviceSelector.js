/* @flow */
/* **********************************************************
* File: components/Developer/DeviceSelector.js
*
* Brief: Component for selecting the device in focus
*
* Authors: Craig Cheney
*
* 2017.10.23 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import {
  Col, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
import type { devicesStateType } from '../../types/stateTypes';

type propsT = {
  devices: devicesStateType,
  deviceSelected: (deviceId: string) => void
};

export default class DeviceSelector extends Component<propsT> {
  componentWillMount() {
    /* Set the default device */
    const deviceIdList = Object.keys(this.props.devices);
    /* Iterate through all the devices */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const { active } = this.props.devices[deviceId];
      /* Find the first active device */
      if (active) {
        // this.setState({ deviceId });
        this.props.deviceSelected(deviceId);
        break;
      }
    }
  }
  /* Get all of the device names and IDs */
  getDeviceSelection() {
    const selectionArray = [];
    const deviceIdList = Object.keys(this.props.devices);
    /* Iterate through all the devices */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const { name, active } = this.props.devices[deviceId];
      /* Add an option for the device if it is active */
      if (active) {
        /* Push the object */
        selectionArray.push(
          <option key={selectionArray.length} value={deviceId}>{name}</option>
        );
      }
    }
    /* provide a default */
    if (!selectionArray.length) {
      return (<option value='noDevices'>NO DEVICES</option>);
    }
    return selectionArray;
  }
  /* Handle the device selection */
  handleSelection = ({ target }: SyntheticInputEvent<>): void => {
    this.props.deviceSelected(target.value);
    // this.setState({ deviceId: target.value });
  }
  render() {
    return (
      <Col md={8} mdOffset={2} style={{ marginTop: '5px' }}>
        <FormGroup controlId='formDeviceName'>
          <ControlLabel>DEVICE</ControlLabel>
          <FormControl componentClass='select' onChange={this.handleSelection}>
            {this.getDeviceSelection()}
          </FormControl>
        </FormGroup>
      </Col>
    );
  }
}

/* [] - END OF FILE */
