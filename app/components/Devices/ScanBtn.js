// @flow
/* **********************************************************
* File: components/Devices/ScanBtn.js
*
* Brief: Starts and stops a BLE scan
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document Created (refactored from DevicesPage.js)
*
********************************************************* */
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { ButtonGroup, Button } from 'react-bootstrap';
import type { scanBtnStyleType } from '../../types/styleTypes';
import type { thunkType } from '../../types/functionTypes';

/* Properties of the component */
type propsType = {
  /* Variables */
  scanning: boolean,
  enabled: boolean,
  /* Functions */
  startStopScan: () => thunkType
};

export default class ScanBtn extends Component<propsType> {
  /* Determines whether or not a scan is enabled */
  getScanState(): scanBtnStyleType {
    if (this.props.scanning) {
      return { color: 'danger', text: 'Stop' };
    }
    return { color: 'primary', text: 'Start' };
  }
  /* Render function */
  render() {
    const scanBtnStyle = { marginLeft: '20px' };
    const spinner = this.props.scanning ? <FontAwesome name='spinner' pulse /> : null;
    return (
      <ButtonGroup >
        <Button
          name='scanBtn'
          style={scanBtnStyle}
          bsStyle={this.getScanState().color}
          disabled={!this.props.enabled}
          onClick={() => this.props.startStopScan()}
        >{this.getScanState().text} Scan {spinner}
        </Button>
      </ButtonGroup>
    );
  }
}

/* [] - END OF FILE */
