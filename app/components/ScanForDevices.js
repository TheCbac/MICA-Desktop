// @flow
/* **********************************************************
* File: ScanForDevices.js
*
* Brief: Component for starting scan, and choosing scan
*     method.
*
* Author: Craig Cheney
* Date: 2017.04.27
*
**********************************************************/
import React, { Component } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';


export default class ScanForDevices extends Component {
  render() {
    return (
      <ButtonGroup>
        <Button>BLE</Button>
        <Button>USB</Button>
      </ButtonGroup>
    );
  }
}
