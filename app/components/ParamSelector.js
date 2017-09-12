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
import micaSensorParams from '../utils/mica/micaSensorParams';
import type { nobleIdType } from '../types/paramTypes';
import type { thunkType } from '../types/functionTypes';

type propsType = {
  deviceId: nobleIdType,
  sensorId: string,
  paramName: string,
  paramValue: number | number[],
  setSensorChannels: (
    deviceId: nobleIdType,
    sensorId: number | string,
    newChannels: number[]
  ) => thunkType
};

// type stateType = {
//   value: number[]
// };

export default class ParamSelector extends Component {
  /* Type Defs */
  props: propsType;
  // state: stateType;
  // /* constructor function */
  // constructor(props: propsType) {
  //   super(props);
  //   this.state = {
  //     value: props.paramValue
  //   };
  // }
  /* return the list of options */
  getOptions() {
    const buttonArray = [];
    const paramOptions = this.getParam('options');
    /* Iterate over all of the options */

    for (let i = 0; i < paramOptions.length; i += 1) {
      /* Get the option */
      const option = paramOptions[i];
      /* Create the toggle button element */
      const btnElement = (
        <ToggleButton
          value={option.word}
          key={i.toString()}
          onClick={() =>
            console.log(this.props.deviceId, this.props.sensorId, this.props.paramName)
          }
        >
          {option.display}
        </ToggleButton>
      );
      /* Add the element to the array */
      buttonArray.push(btnElement);
    }
    /* Return the array of buttons */
    return buttonArray;
  }
  getParam(item: string): * {
    if (this.props.paramName === 'channels') {
      return micaSensorParams[this.props.sensorId].channels[item];
    }
    return micaSensorParams[this.props.sensorId].dynamicParams[this.props.paramName][item];
  }

  render() {
    return (
      <div>
        <ButtonToolbar>
          <Col md={12} xs={12}>
            <label htmlFor="settings">{this.getParam('display')}:</label>
          </Col>
          <Row />
          <Col md={12} xs={12}>
            <ToggleButtonGroup
              bsSize="small"
              type={this.getParam('btnType')}
              name={this.props.paramName}
              defaultValue={this.props.paramValue}
            >
              { this.getOptions() }
            </ToggleButtonGroup>
          </Col>
        </ButtonToolbar>
      </div>
    );
  }
}
/* [] - END OF FILE */
