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
import type { thunkType } from '../../types/functionTypes';
import type {
  collectionStateType,
  graphSettingsType,
  devicesStateType
} from '../../types/stateTypes';
import type { updateGraphSettingsActionType } from '../../types/collectionActionTypes';


type propsType = {
  devices: devicesStateType,
  collectionSettings: collectionStateType,
  startCollecting: () => thunkType,
  stopCollecting: () => thunkType,
  updateGraphSettings: (graphSettings: graphSettingsType) => updateGraphSettingsActionType
};

export default class CollectDataPage extends Component {
  props: propsType;

  render() {
    return (
      <div>
        <Col md={4} lg={4}>
          <ControlComponent devices={this.props.devices} />
          <Row />
          <GraphSettings
            devices={this.props.devices}
            collectionSettings={this.props.collectionSettings}
            startCollecting={this.props.startCollecting}
            stopCollecting={this.props.stopCollecting}
            updateGraphSettings={this.props.updateGraphSettings}
          />
        </Col>

        <Col md={8} lg={8}>
          <GraphComponent
            collectionSettings={this.props.collectionSettings}
            devices={this.props.devices}
          />
        </Col>
      </div>
    );
  }
}

/* [] - END OF FILE */
