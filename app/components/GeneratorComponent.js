// @flow
/* **********************************************************
* File: components/GeneratorComponent.js
*
* Brief: React component displaying and interacting with
*   the generators of a device.
*
* Authors: Craig Cheney
*
* 2017.09.12 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row, Collapse, Well, Label } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import ChannelSelector from './ChannelSelector';
import ParamSelector from './ParamSelector';
import type { nobleIdType, generatorParamType } from '../types/paramTypes';
import type { thunkType } from '../types/functionTypes';

type StateType = {
  open: boolean,
  active: boolean
};

type PropsType = {
  deviceId: string,
  generatorId: string,
  generatorSettings: generatorParamType,
  /* Action Functions */
  setGeneratorActive: (
    deviceId: nobleIdType,
    generatorId: number | string,
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
      open: this.props.generatorSettings.active,
      active: this.props.generatorSettings.active
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
    const channelVal = this.props.generatorSettings.channels;
    const { deviceId, generatorId, setSensorChannels } = this.props;
    return (
      <ChannelSelector
        deviceId={deviceId}
        sensorId={generatorId}
        channels={channelVal}
        setSensorChannels={setSensorChannels}
      />
    );
  }
  /* Returns the parameter selecting component */
  getParams() {
    const dynamicParamsObj = this.props.generatorSettings.dynamicParams;
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
            sensorId={this.props.generatorId}
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
  toggleGeneratorPower() {
    const newActive = !this.state.active;
    this.props.setGeneratorActive(
      this.props.deviceId,
      this.props.generatorId,
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
    const keybindingStyle = {
      fontSize: '1em'
    };
    const { name } = this.props.generatorSettings;
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
            <FontAwesome className={'pull-right hoverGlow'} onClick={() => this.toggleGeneratorPower()} style={this.powerBtnStyle()} name={'power-off'} size={'lg'} />
          </span>
        </Col>
        <Row />
        <Col md={12} xs={12}>
          <Collapse in={this.state.open}>
            <div>
              <Well style={{ overflow: 'hidden' }}>
                <div >
                  {/* this.getChannels() */}
                  {/* this.getParams() */}
                  <Col md={12} xs={12}>
                    <span style={keybindingStyle}>KEYBINDINGS</span>
                  </Col>
                  <Row />
                  <Col md={4} xs={4}>
                    <span className={'pull-right'}>
                      Forward <span style={{ fontSize: '1.5em', marginBottom: '30px' }}><Label>W</Label></span>
                    </span>
                  </Col>
                  <Col md={3} xs={3}>
                    <span className={'pull-right'}>
                        Left <span style={{ fontSize: '1.5em', marginBottom: '30px' }}><Label>A</Label></span>
                    </span>
                  </Col>
                  <Col md={5} xs={5}>
                    <span className={'pull-right'}>
                      Increase Speed <span style={{ fontSize: '1.5em', marginBottom: '30px' }}><Label>Z</Label></span>
                    </span>
                  </Col>
                  <Row />
                  <Col md={4} xs={4}>
                    <span className={'pull-right'}>
                      Backward <span style={{ fontSize: '1.5em', marginBottom: '30px' }}><Label>S</Label></span>
                    </span>
                  </Col>
                  <Col md={3} xs={3}>
                    <span className={'pull-right'}>
                      Right <span style={{ fontSize: '1.5em', marginBottom: '30px' }}><Label>D</Label></span>
                    </span>
                  </Col>
                  <Col md={5} xs={5}>
                    <span className={'pull-right'}>
                      Decrease Speed <span style={{ fontSize: '1.5em', marginBottom: '30px' }}><Label>C</Label></span>
                    </span>
                  </Col>
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
