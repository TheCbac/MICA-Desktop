// @flow
/* **********************************************************
* File: components/ScanForDevicesComponent.js
*
* Brief: Component for starting scan, and choosing scan
*     method.
*
* Author: Craig Cheney
* Date: 2017.04.27
*
**********************************************************/
import React, { Component } from 'react';
import { ButtonGroup, Button, Grid, Col, Row } from 'react-bootstrap';
import type { changeScanActionType, scanTypes } from '../types/actionTypes';

export default class ScanForDevices extends Component {
  /* Properties, checked with flow */
  props: {
    method: scanTypes,
    enabled: boolean,
    changeScanMethod: (scanTypes) => changeScanActionType
  };
  /* Returns the color for the button */
  getColor(name: scanTypes) {
    /* Act for the active method */
    if (name === this.props.method) {
      return this.props.enabled ? 'success' : 'danger';
    }
    return 'default';
  }
  /* Sets the active state */
  isActive(name: scanTypes) {
    if (name === this.props.method) {
      return true;
    }
    return false;
  }
  /* Render function */
  render() {
    const { changeScanMethod } = this.props;
    return (
      <Grid>
        <Row>
          <Col md={4} mdOffset={1}>
            <ButtonGroup>
              <Button active={this.isActive('ble')} bsStyle={this.getColor('ble')} onClick={() => changeScanMethod('ble')}>BLE</Button>
              <Button active={this.isActive('usb')} bsStyle={this.getColor('usb')} onClick={() => changeScanMethod('usb')}>USB</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

/* [] - END OF FILE */
