/* @flow */
/* **********************************************************
* File: components/CollectData/CollectDataPage.js
*
* Brief: Page component for the 'Collect' tab
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import GraphSettings from './GraphSettingsComponent';
import GraphComponent from './GraphComponent';
import ControlComponent from './ControlsComponent';
import type { deviceSettingsType } from '../../types/paramTypes';


type propsType = {
  deviceSettings: deviceSettingsType
};

export default class CollectDataPage extends Component {
  props: propsType;

  render() {
    return (
      <div>
        <Col md={4} lg={4}>
          <ControlComponent deviceSettings={this.props.deviceSettings} />
          <Row />
          <GraphSettings />
        </Col>

        <Col md={8} lg={8}>
          <GraphComponent />
        </Col>
      </div>
    );
  }
}

/* [] - END OF FILE */
