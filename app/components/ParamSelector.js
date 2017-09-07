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

type optionsType = {
  name: string,
  value: number,
  word: number,
  display: string
};

type PropsType = {
  name: string,
  display: string,
  default: number,
  options: optionsType[],
  address: number
};

export default class ParamSelector extends Component {
  /* Type Defs */
  props: PropsType;
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
          <Col md={2} xs={2}>
            <label htmlFor="settings">{this.props.display}:</label>
          </Col>
          <Col md={10} xs={10}>
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
