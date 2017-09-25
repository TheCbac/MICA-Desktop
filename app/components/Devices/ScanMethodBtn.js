// @flow
/* **********************************************************
* File: components/Devices/ScanMethodBtn.js
*
* Brief: Select the scan method based on this button
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document Created
*
********************************************************* */
import React, { Component } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import type { scanTypes } from '../../types/paramTypes';
import type { scanMethodBtnStyleType } from '../../types/styleTypes';
import type { changeScanActionType } from '../../types/actionTypes';


type propsType = {
  method: scanTypes,
  enabled: boolean,
  changeScanMethod: (newScanType: scanTypes) => changeScanActionType
};

export default class ScanMethodBtn extends Component {
  props: propsType;
  /* Returns the color for the scan method button */
  getColor(name: scanTypes): scanMethodBtnStyleType {
    /* Act for the active method */
    if (name === this.props.method) {
      return this.props.enabled ? 'success' : 'danger';
    }
    return 'default';
  }
  /* Sets the active state */
  isActive(name: scanTypes): boolean {
    if (name === this.props.method) {
      return true;
    }
    return false;
  }
  /* Render function */
  render() {
    return (
      <ButtonGroup>
        <Button
          name={'bleMethodBtn'}
          active={this.isActive('ble')}
          bsStyle={this.getColor('ble')}
          onClick={() => this.props.changeScanMethod('ble')}
        >BLE</Button>
        <Button
          name={'usbMethodBtn'}
          active={this.isActive('usb')}
          bsStyle={this.getColor('usb')}
          onClick={() => this.props.changeScanMethod('usb')}
        >USB</Button>
      </ButtonGroup>
    );
  }
}

/* [] - END OF FILE */
