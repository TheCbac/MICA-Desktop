// @flow
/* **********************************************************
* File: components/SensorComponent.js
*
* Brief: React component displaying and interacting with
*   the sensors of a device.
*
* Authors: Craig Cheney
*
* 2017.09.12 CC - Rename component from 'senGenComponent'
*   to 'SensorComponent'
* 2017.09.05 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row, Collapse, Well } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import ChannelSelector from './ChannelSelector';
import ParamSelector from './ParamSelector';
import type { nobleIdType, sensorParamType } from '../types/paramTypes';
import type { thunkType } from '../types/functionTypes';

type StateType = {
  open: boolean,
  active: boolean
};

type PropsType = {
  deviceId: string,
  sensorId: string,
  sensorSettings: sensorParamType,
  /* Action Functions */
  setSensorActive: (
    deviceId: nobleIdType,
    sensorId: number | string,
    newState: boolean
  ) => thunkType,
  setSensorChannels: (
    deviceId: nobleIdType,
    sensorId: number | string,
    newChannels: number[]
  ) => thunkType,
  setSensorParams: (
    deviceId: nobleIdType,
    sensorId: number | string,
    paramName: string,
    paramValue: number
  ) => thunkType
};

export default class SenGenComponent extends Component {
  /* type defs */
  state: StateType;
  props: PropsType;
  /* Constructor function  */
  constructor(props: PropsType) {
    super(props);
    /* set the default state */
    this.state = {
      open: this.props.sensorSettings.active,
      active: this.props.sensorSettings.active
    };
  }
  /*  */
  toggleOpen(): void {
    this.setState({ open: !this.state.open });
  }
  /* Style for the caret */
  caretStyle() {
    const style = {
      transition: '',
      textShadow: '',
      color: '',
      transform: ''
    };
    if (this.state.open) {
      style.textShadow = 'white 0 0 20px';
      style.color = 'white';
      style.transition = 'all 2 linear';
      style.transform = 'rotate(90deg)';
    }
    return style;
  }
  /* Power button style */
  powerBtnStyle() {
    const style = {
      transform: 'rotate(-90deg)',
      fontSize: '1em',
      color: 'black',
      textShadow: ''
    };
    if (this.state.active) {
      style.transform = '';
      style.textShadow = 'white 0 0 20px';
      style.color = 'white';
    }
    return style;
  }
  /* Style of the name */
  nameStyle() {
    const style = {
      color: '',
      textShadow: ''
    };
    if (this.state.active) {
      style.color = 'white';
      style.textShadow = 'white 0 0 20px';
    }
    return style;
  }
  /* Return a component for selecting the channels */
  getChannels() {
    const channelVal = this.props.sensorSettings.channels;
    const { deviceId, sensorId, setSensorChannels } = this.props;
    return (
      <ChannelSelector
        deviceId={deviceId}
        sensorId={sensorId}
        channels={channelVal}
        setSensorChannels={setSensorChannels}
      />
    );
  }
  /* Returns the parameter selecting component */
  getParams() {
    const dynamicParamsObj = this.props.sensorSettings.dynamicParams;
    const dynamicParamsKeys = Object.keys(dynamicParamsObj);
    /* return a list of components */
    const componentArray = [];
    /* Push all of the dynamic parameters */
    for (let i = 0; i < dynamicParamsKeys.length; i++) {
      /* Get the name (key) and value of each parameter */
      const key = dynamicParamsKeys[i];
      const { value } = dynamicParamsObj[key];
      if (key && value != null) {
        componentArray.push(
          <ParamSelector
            key={i}
            deviceId={this.props.deviceId}
            sensorId={this.props.sensorId}
            paramName={key}
            paramValue={value}
            setSensorParams={this.props.setSensorParams}
          />
        );
      }
    }
    return componentArray;
  }
  /* Toggle sensor power */
  toggleSensorPower() {
    const newActive = !this.state.active;
    this.props.setSensorActive(
      this.props.deviceId,
      this.props.sensorId,
      newActive
    );
    /* Toggle the state of the component and open/close the settings list */
    this.setState({ active: newActive, open: newActive });
  }
  /* Render function */
  render() {
    const sensorStyle = {
      fontFamily: 'Franklin Gothic Book',
      fontSize: '1.5em',
    };
    const { name } = this.props.sensorSettings;
    return (
      <div>
        <Row />
        <Col md={5} xs={5} mdOffset={0} style={sensorStyle}>
          <FontAwesome className={'hoverGlow'} style={this.caretStyle()} name={'angle-right'} size={'lg'} onClick={() => this.toggleOpen()} />
          <span style={this.nameStyle()}> {name}</span>
          {/* <FontAwesome
          style={{ fontSize: '14px', verticalAlign: 'middle' }}
          name={'thumb-tack'} size={'lg'}
          /> */}
        </Col>
        <Col md={6} xs={6} mdOffset={0} style={sensorStyle}>
          <hr style={{ borderColor: 'black', marginTop: '15px' }} />
        </Col>
        <Col md={1} xs={1} mdOffset={0} style={sensorStyle}>
          <span className={'pull-right'} style={{ verticalAlign: 'middle', marginTop: '.375em' }}>
            <FontAwesome className={'pull-right hoverGlow'} onClick={() => this.toggleSensorPower()} style={this.powerBtnStyle()} name={'power-off'} size={'lg'} />
          </span>
        </Col>
        <Row />
        <Col md={12} xs={12}>
          <Collapse in={this.state.open}>
            <div>
              <Well>
                <div>
                  { this.getChannels() }
                  { this.getParams() }
                </div>
              </Well>
            </div>
          </Collapse>
        </Col>
      </div>
    );
  }
}
/* [] - END OF FILE */
