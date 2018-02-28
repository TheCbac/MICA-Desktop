/* @flow */
/* **********************************************************
* File: components/CollectData/GraphSettingsComponent.js
*
* Brief: Settings and controls for the graph on the Collect
*   tab
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
import update from 'immutability-helper';
import React, { Component } from 'react';
import { Col, Row, ButtonToolbar, Button } from 'react-bootstrap';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import { remote } from 'electron';
import { getFullDataObj } from '../../utils/dataStreams/graphBuffer';
import { saveCsv } from '../../utils/dataStreams/data2csv';
import type { thunkType } from '../../types/functionTypes';
import type {
  collectionStateType,
  graphSettingsType,
  horizontalScaleType,
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

type stateType = {
  value: number
};

export default class GraphSettings extends Component<propsType, stateType> {
  constructor(props: propsType) {
    super(props);
    /* Set the default */
    this.state = {
      value: props.collectionSettings.graphSettings.horizontalScale
    };
  }
  /* Save the latest run */
  saveDialog(): void {
    const options = {
      defaultPath: 'data.csv'
    };
    remote.dialog.showSaveDialog(options, (filePath?: string) => {
      if (filePath) {
        saveCsv(filePath, this.props.devices, getFullDataObj());
      }
    });
  }
  /* Button for the next state */
  startStopGraphButton() {
    const { collecting } = this.props.collectionSettings;
    /* Default to running  */
    let nextState = 'STOP';
    let btnStyle = 'danger';
    let clickHandler = this.props.stopCollecting;
    /* If not running */
    if (!collecting) {
      nextState = 'START';
      btnStyle = 'success';
      clickHandler = this.props.startCollecting;
    }
    /* Return the button */
    return (
      <Col xs={12} className='text-center' style={{ marginTop: '10px' }}>
        <Button
          block
          bsStyle={btnStyle}
          onClick={() => clickHandler()}
        >
          {nextState} COLLECTING
        </Button>
      </Col>
    );
  }
  /* Change the scale */
  onScaleChange = (value: horizontalScaleType): void => {
    /* Get the new settings - do not mutate the props */
    const newSettings = update(this.props.collectionSettings.graphSettings, {
      horizontalScale: { $set: value }
    });
    /* Update the store */
    console.log(newSettings);
    this.props.updateGraphSettings(newSettings);
    /* Change the state */
    this.setState({ value });
  }
  render() {
    const boxStyle = {
      marginBottom: '20px',
      backgroundColor: '#E0E5E8',
      minHeight: '240px',
      fontFamily: 'Abel'
    };

    return (
      <div style={boxStyle}>
        <div className='text-center' style={{ fontSize: '1.5em' }}>Graphs</div>
        <Row style={{ marginTop: '10px' }} />
        <Col md={6}>
          <span style={{ fontSize: '1.25em' }}>Horizontal Scale</span>
        </Col>
        <Col md={6} style={{ paddingLeft: '0px' }}>
          <ButtonToolbar>
            <ToggleButtonGroup
              bsSize='xsmall'
              type='radio'
              name='graphScale'
              value={this.state.value}
              onChange={this.onScaleChange}
            >
              <ToggleButton value={0.5}>½</ToggleButton>
              <ToggleButton value={1}>1</ToggleButton>
              <ToggleButton value={2}>2</ToggleButton>
              <ToggleButton value={5}>5</ToggleButton>
              <ToggleButton value={10}>10</ToggleButton>
            </ToggleButtonGroup>
            <span style={{ marginLeft: '5px' }}> s/div</span>
          </ButtonToolbar>
        </Col>
        <Row />
        {this.startStopGraphButton()}
        <Row />
        <Col xs={6} className='text-center' style={{ marginTop: '10px' }}>
          <Button block bsStyle='warning'>PAUSE DISPLAY</Button>
        </Col>
        <Col xs={6} className='text-center' style={{ marginTop: '10px' }}>
          <Button block bsStyle='primary' onClick={() => this.saveDialog()}>SAVE RUN</Button>
        </Col>
        <Row />
        <Col xs={12} style={{ position: 'absolute', bottom: '25px' }}>
          Last run saved: /tmp/mica/2017.8.24-1359.csv
        </Col>
      </div>
    );
  }
}

/* [] - END OF FILE */
