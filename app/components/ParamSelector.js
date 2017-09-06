// @flow
/* **********************************************************
* File: ParamSelector.js
*
* Brief: React component for choosing which of the sensor
* params that should be used
*
* Authors: Craig Cheney
*
* 2017.09.06 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, ButtonToolbar } from 'react-bootstrap';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';

type PropsType = {
  name: string,
  default: number
  // options: {
  //   /* @TODO fill this in */
  // }
};

export default class ParamSelector extends Component {
  /* Type Defs */
  props: PropsType;

  render() {
    return (
      <div>
        <ButtonToolbar>
          <Col md={2} xs={2}>
            <label htmlFor="settings">{this.props.name}:</label>
          </Col>
          <Col md={10} xs={10}>
            <ToggleButtonGroup bsSize="small" type="radio" name={this.props.name} defaultValue={this.props.default}>
              <ToggleButton value={1}>1x</ToggleButton>
              <ToggleButton value={2}>10x</ToggleButton>
              <ToggleButton value={3}>100x</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </ButtonToolbar>
      </div>
    );
  }
}
/* [] - END OF FILE */
