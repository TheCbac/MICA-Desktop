/* @flow */
/* **********************************************************
* File: components/Developer/DeveloperPage.js
*
* Brief: Page component for the 'Developer' tab
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import {
  Col
} from 'react-bootstrap';
import ChangeDeviceName from './ChangeDeviceName';
import OtaUpdate from './OtaUpdate';
import type { devicesStateType } from '../../types/stateTypes';
import type { idType } from '../../types/paramTypes';
import type { thunkType } from '../../types/functionTypes';

type propsT = {
  devices: devicesStateType,
  setDeviceName: (deviceId: idType, name: string) => thunkType,
  initiateOtaUpdate: (deviceId: idType, hexPath: string) => thunkType
};
type stateT = {
  name: string,
  deviceId: string
};

export default class DeveloperPage extends Component {
  props: propsT;
  state: stateT;
  /* Render the Developer Page */
  render() {
    const { devices, setDeviceName, initiateOtaUpdate } = this.props;
    return (
      <div>
        <Col md={12}>
          <ChangeDeviceName devices={devices} setDeviceName={setDeviceName} />
          <OtaUpdate devices={devices} initiateOtaUpdate={initiateOtaUpdate} />
        </Col>
      </div>
    );
  }
}

/* [] - END OF FILE */
