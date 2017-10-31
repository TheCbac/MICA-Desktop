// @flow
/* **********************************************************
* File: components/Devices/DevicesPage.js
*
* Brief: Page for starting scan, and choosing scan
*     method.
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Changed name to DevicesPage (from ScanForDevicesComponent)
*   Refactored out ScanMethodBtn, ScanBtn, and DevicesTable
* 2017.04.27 CC - Document Created
*
********************************************************* */
import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import ScanMethodBtn from './ScanMethodBtn';
import ScanBtn from './ScanBtn';
import DevicesTable from './DevicesTable';
import type { scanTypes, idType } from '../../types/paramTypes';
import type { changeScanActionType } from '../../types/actionTypes';
import type { devicesStateType } from '../../types/stateTypes';
import type { thunkType } from '../../types/functionTypes';

type propsType = {
    /* Variables */
    method: scanTypes,
    enabled: boolean,
    scanning: boolean,
    devices: devicesStateType,
    /* Functions */
    changeScanMethod: (method: scanTypes) => changeScanActionType,
    startStopScan: () => thunkType,
    connectToDevice: (deviceId: idType) => thunkType,
    cancelPendingConnection: (deviceId: idType) => thunkType,
    disconnectFromDevice: (deviceId: idType) => thunkType
};

export default class DevicesPage extends Component<propsType> {
  /* Render function */
  render() {
    const {
      method,
      changeScanMethod,
      scanning,
      enabled,
      startStopScan,
      devices,
      connectToDevice,
      cancelPendingConnection,
      disconnectFromDevice
    } = this.props;
    /* JSX component */
    return (
      <Grid fluid>
        <Row>
          <Col md={4} mdOffset={1}>
            <ScanMethodBtn
              method={method}
              enabled={enabled}
              changeScanMethod={changeScanMethod}
            />
            <ScanBtn
              scanning={scanning}
              enabled={enabled}
              startStopScan={startStopScan}
            />
          </Col>
          <Row />
          <Col md={10} mdOffset={1}>
            <DevicesTable
              devices={devices}
              connectToDevice={connectToDevice}
              cancelPendingConnection={cancelPendingConnection}
              disconnectFromDevice={disconnectFromDevice}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

/* [] - END OF FILE */
