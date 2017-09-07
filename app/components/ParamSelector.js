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
import { Col, ButtonToolbar, Row } from 'react-bootstrap';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import type { deviceParamType } from '../types/paramTypes';

export default class ParamSelector extends Component {
  /* Type Defs */
  props: deviceParamType;
  /* return the list of options */
  getOptions() {
    const buttonArray = [];
    /* Iterate over all of the options */
    for (let i = 0; i < this.props.options.length; i += 1) {
      /* Get the option */
      const option = this.props.options[i];
      /* Create the toggle button element */
      const btnElement = (
        <ToggleButton value={option.word} key={i.toString()}>
          {option.display}
        </ToggleButton>
      );
      /* Add the element to the array */
      buttonArray.push(btnElement);
    }
    /* Return the array of buttons */
    return buttonArray;
  }

  render() {
    return (
      <div>
        <ButtonToolbar>
          <Col md={12} xs={12}>
            <label htmlFor="settings">{this.props.display}:</label>
          </Col>
          <Row />
          <Col md={12} xs={12}>
            <ToggleButtonGroup bsSize="small" type="radio" name={this.props.name} defaultValue={this.props.default}>
              {this.getOptions()}
            </ToggleButtonGroup>
          </Col>
        </ButtonToolbar>
      </div>
    );
  }
}
/* [] - END OF FILE */
