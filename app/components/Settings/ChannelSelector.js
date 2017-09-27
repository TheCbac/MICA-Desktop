// @flow
/* **********************************************************
* File: ChannelSelector.js
*
* Brief: React component for choosing which of the sensor
* channels that are active.
*
* Authors: Craig Cheney
*
* 2017.09.12 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, ButtonToolbar, Row } from 'react-bootstrap';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import micaSensorParams from '../../utils/mica/micaSensorParams';
import type { idType } from '../../types/paramTypes';
import type { thunkType } from '../../types/functionTypes';

type propsType = {
  /* parameters */
  deviceId: idType,
  sensorId: idType,
  channels: number[],
  /* Functions */
  setSensorChannels: (
    deviceId: idType,
    sensorId: idType,
    newChannels: number[]
  ) => thunkType
};

type stateType = {
  channels: number[]
};

export default class ChannelSelector extends Component {
  /* Type Defs */
  props: propsType;
  state: stateType;
  /* Constructor function */
  constructor(props: propsType) {
    super(props);
    /* Set the default state */
    this.state = {
      channels: props.channels
    };
  }
  /* Return the channels that are available */
  getChannels() {
    /* Look up the channels from the library */
    const channelsObj = micaSensorParams[this.props.sensorId].channels;
    /* Create a button for each channel */
    const buttonArray = [];
    const numChan = channelsObj.options.length;
    for (let i = 0; i < numChan; i++) {
      /* Create the button */
      buttonArray.push((
        <ToggleButton key={i.toString()} value={i}>
          {channelsObj.options[i]}
        </ToggleButton>
      ));
    }
    return buttonArray;
  }
  /* Control the state */
  onChange = (channels: number[]): void => {
    /* Update the state */
    this.setState({ channels });
    /* Update the stored channels */
    const { deviceId, sensorId } = this.props;
    this.props.setSensorChannels(deviceId, sensorId, channels);
  }
  /* At least one channel warning */
  channelWarning() {
    if (this.state.channels.length < 1) {
      const warningText = {
        color: 'red',
        fontStyle: 'italic'
      };
      return (
        <Col md={8} xs={8}>
          <span style={warningText}>At least one channel must be active</span>
        </Col>
      );
    }
  }
  /* Render function */
  render() {
    return (
      <div>
        <ButtonToolbar>
          <Col md={4} xs={4}>
            <label htmlFor="dataChannels">Data Channels:</label>
          </Col>
          {this.channelWarning()}
          <Row />
          <Col md={12} xs={12}>
            <ToggleButtonGroup
              bsSize="small"
              type="checkbox"
              value={this.state.channels}
              onChange={this.onChange}
            >
              { this.getChannels() }
            </ToggleButtonGroup>
          </Col>
        </ButtonToolbar>
      </div>
    );
  }
}


/* [] - END OF FILE */
