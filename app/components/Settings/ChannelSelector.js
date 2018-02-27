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
import type { setSensorChannelsActionT } from '../../types/actionTypes';

type propsType = {
  /* parameters */
  deviceId: idType,
  sensorId: idType,
  channels: channelsT,
  /* Functions */
  setSensorChannels: (
    deviceId: idType,
    sensorId: idType,
    newChannels: number[]
  ) => setSensorChannelsActionT
};

type stateType = {
  channels: number[]
};

/* Get the channels */
function channelIdsFromObj(Obj: channelsT): number[] {
  const channelIds = Object.keys(Obj);
  const valueArray = [];
  for (let i = 0; i < channelIds.length; i++) {
    const { active } = Obj[channelIds[i]];
    if (active) {
      valueArray.push(parseInt(channelIds[i], 10));
    }
  }
  return valueArray;
}

export default class ChannelSelector extends Component<propsType, stateType> {
  /* Constructor function */
  constructor(props: propsType) {
    super(props);
    /* Set the default state */

    this.state = {
      channels: channelIdsFromObj(props.channels)
    };
  }
  /* Return the channels that are available */
  getChannels() {
    const { channels } = this.props;
    const channelIds = Object.keys(channels);
    /* Create a button for each channel */
    const buttonArray = [];
    const numChan = channelIds.length;
    for (let i = 0; i < numChan; i++) {
      const id = channelIds[i];
      /* Create the button */
      buttonArray.push((
        <ToggleButton key={i.toString()} value={parseInt(id, 10)}>
          {channels[id].name}
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
    /* Get the channels from the props */

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
            <label htmlFor='dataChannels'>Data Channels:</label>
          </Col>
          {this.channelWarning()}
          <Row />
          <Col md={12} xs={12}>
            <ToggleButtonGroup
              bsSize='small'
              type='checkbox'
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
