// @flow
/* **********************************************************
* File: components/senGenComponent.js
*
* Brief: React component displaying and interacting with
*   the sensors and generators of a device.
*
* Authors: Craig Cheney
*
* 2017.09.05 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row, Collapse, Well } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import ParamSelector from './ParamSelector';
import type { deviceParamType } from '../types/paramTypes';


type StateType = {
  open: boolean
};

type PropsType = {
  device: string,
  name: string,
  active: boolean,
  params: deviceParamType[],
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
      open: this.props.active,
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
    if (this.props.active) {
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
    if (this.props.active) {
      style.color = 'white';
      style.textShadow = 'white 0 0 20px';
    }
    return style;
  }
  /* Returns the list of sensor params */
  getParams() {
    const paramsArray = [];
    /* iterate over the params */
    for (let i = 0; i < this.props.params.length; i += 1) {
      /* Get the parameter */
      const paramObj = this.props.params[i];
      /* Create the param selector element */
      const paramElement = (
        <ParamSelector {...paramObj} device={this.props.device} sensor={this.props.name} key={i} />
      );
      /* Add to the array */
      paramsArray.push(paramElement);
    }
    /* Return the list of elements */
    return paramsArray;
  }
  /* Toggle sensor power */
  toggleSensorPower() {
    console.log(this.props);
  }
  /* Render function */
  render() {
    const sensorStyle = {
      fontFamily: 'Franklin Gothic Book',
      fontSize: '1.5em',
    };
    return (
      <div>
        <Row />
        <Col md={5} xs={5} mdOffset={0} style={sensorStyle}>
          <FontAwesome className={'hoverGlow'} style={this.caretStyle()} name={'angle-right'} size={'lg'} onClick={() => this.toggleOpen()} />
          <span style={this.nameStyle()}> {this.props.name} </span>
          {/* <FontAwesome style={{ fontSize: '14px', verticalAlign: 'middle' }} name={'thumb-tack'} size={'lg'} /> */}
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
