// @flow
/* **********************************************************
* File: components/Settings/ZeroBtn.js
*
* Brief: React component for zeroing the sensor
* Authors: Craig Cheney
*
* 2017.10.02 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, ButtonToolbar, Row, Button, ButtonGroup } from 'react-bootstrap';
import type { idType } from '../../types/paramTypes';
import type { thunkType } from '../../types/functionTypes';

/* Type def */
type propsT = {
  deviceId: idType,
  sensorId: idType,
  zeroSensor: (
    deviceId: idType,
    sensorId: idType
  ) => thunkType
};

export default class ZeroBtn extends Component {
  props: propsT;
  /* Render function */
  render() {
    return (
      <div>
        <ButtonToolbar>
          <Col md={4} xs={4}>
            <label htmlFor="zeroBtn">Zero:</label>
          </Col>
          <Row />
          <Col md={12} xs={12}>
            <ButtonGroup
              id="zeroBtn"
              bsSize="small"
              onClick={() => this.props.zeroSensor(this.props.deviceId, this.props.sensorId)}
            >
              <Button>Zero</Button>
            </ButtonGroup>
          </Col>
        </ButtonToolbar>
      </div>
    );
  }
}

/* [] - END OF FILE */
