// @flow
/* **********************************************************
* File: sensorSettingsComponent.js
*
* Brief: React component for changing settings on sensors.
*   this is a poor name - consider renaming as this component
*   also includes generators.
*
* Authors: Craig Cheney
*
* 2017.09.25 CC - Changed name to SettingsPage (from
*   sensorSettingsComponent)
* 2017.08.30 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import DeviceBlock from './DeviceBlock';
import log from '../../utils/loggingUtils';
import type { thunkType } from '../../types/functionTypes';
import type { devicesStateType } from '../../types/stateTypes';
import type { idType } from '../../types/paramTypes';
import type {
  setDeviceActiveActionType,
  setSensorChannelsActionT
} from '../../types/actionTypes';

// log.debugLevel = 5;
log.debug('sensorSettingsComponent: debug level', log.debugLevel);
/* Props used in component */
type propsType = {
  devices: devicesStateType,
  /* Functions */
  setDeviceActive: (deviceId: idType, newState: boolean) => setDeviceActiveActionType,
  setSensorActive: (
    deviceId: idType,
    sensorId: idType,
    newState: boolean
  ) => thunkType,
  setGeneratorActive: (
    deviceId: idType,
    generatorId: idType,
    newState: boolean
  ) => thunkType,
  setSensorChannels: (
    deviceId: idType,
    sensorId: idType,
    newChannels: number[]
  ) => setSensorChannelsActionT,
  setSensorParams: (
    deviceId: idType,
    sensorId: idType,
    paramName: string,
    paramValue: number
  ) => thunkType,
  zeroSensor: (
    deviceId: idType,
    sensorId: idType
  ) => thunkType
};

export default class settingsPage extends Component<propsType> {
  getDeviceBlocks(): [] {
    const deviceBlockList = [];
    const deviceIdList = Object.keys(this.props.devices);
    /* Iterate through each device */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = this.props.devices[deviceId];
      /* Only display connected devices */
      if (device.state === 'connected') {
        deviceBlockList.push(
          <DeviceBlock
            key={i}
            id={deviceId}
            device={device}
            setDeviceActive={this.props.setDeviceActive}
            setSensorActive={this.props.setSensorActive}
            setSensorChannels={this.props.setSensorChannels}
            setSensorParams={this.props.setSensorParams}
            setGeneratorActive={this.props.setGeneratorActive}
            zeroSensor={this.props.zeroSensor}
          />
        );
      }
    }
    /* Display empty text */
    if (deviceBlockList.length === 0) {
      const style = {
        backgroundColor: '#D1CAC8',
        borderRadius: '5px',
        marginTop: '10px',
        minHeight: '75px',
        textAlign: 'center'
      };
      deviceBlockList.push(
        <div style={style}>
          <i >NO DEVICES CONNECTED</i>
        </div>
      );
    }
    /* Return the device List */
    return deviceBlockList;
  }
  /* Render function */
  render() {
    const deviceBackgroundStyle = {
      backgroundColor: '#c7e9b4',
      minHeight: '400px',
    };
    return (
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Col md={12} style={deviceBackgroundStyle}>
              {this.getDeviceBlocks()}
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}
/* [] - END OF FILE */
