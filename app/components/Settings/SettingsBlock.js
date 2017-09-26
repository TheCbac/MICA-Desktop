/* @flow */
/* **********************************************************
* File: SettingsContainer.js
*
* Brief: Block for settings for both the sensors and generators
*
* Author: Craig Cheney
*
* 2017.09.26 CC - Document created, refactored from SettingsPage
*
********************************************************* */
import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import type { idType } from '../../types/paramTypes';
import type { thunkType } from '../../types/functionTypes';
import type { devicesStateType } from '../../types/stateTypes';

type propsType = {
  type: 'sensors' | 'generators',
  devices: devicesStateType,
  setSensorActive: (
    deviceId: idType,
    sensorId: idType,
    newState: boolean
  ) => thunkType,
  setSensorChannels: (
    deviceId: idType,
    sensorId: idType,
    newChannels: number[]
  ) => thunkType,
  setSensorParams: (
    deviceId: idType,
    sensorId: idType,
    paramName: string,
    paramValue: number
  ) => thunkType,
  setGeneratorActive: (
    deviceId: idType,
    generatorId: idType,
    newState: boolean
  ) => thunkType
};

export default class SettingsBlock extends Component {
  /* Type Def */
  props: propsType;

  /* Get instruments */
  getInstrument(): [] | string {

  }
  /* Get the Settings for the devices */
  getSensors(selectDevice: selectType): [] | string {
    /* Ensure that there is a name */
    if (!selectDevice.name) { return ''; }
    /* No sensors or generators found text */
    const noSensorText = `${selectDevice.name} CONTAINS NO SENSORS`;
    /* The device does not contain any sensors/generators */
    if (!selectDevice.id) { return noSensorText; }
    /* Get the device settings */
    // const deviceSettings = this.props.deviceSettings[selectDevice.id];
    if (!deviceSettings) { return noSensorText; }
    /* find the sensors in the settings */
    const sensorKeys = Object.keys(deviceSettings.sensors);
    const componentList = [];
    /* Create a component for all of the device */
    for (let i = 0; i < sensorKeys.length; i++) {
      const sensorId = sensorKeys[i];
      const sensor = deviceSettings.sensors[sensorId];
      componentList.push(
        <SensorComponent
          key={i}
          deviceId={selectDevice.id}
          sensorId={sensorId}
          sensorSettings={sensor}
          setSensorActive={this.props.setSensorActive}
          setSensorChannels={this.props.setSensorChannels}
          setSensorParams={this.props.setSensorParams}
        />
    );
    }
    return componentList;
  }

  render() {
    const settingsBoxStyle = {
      backgroundColor: '#D0E1D0',
      minHeight: '400px',
    };
    const headerTextStyle = {
      fontSize: '1.5em',
      fontFamily: 'Franklin Gothic Book',
      marginTop: '15px',
      color: '#7C7C7C',
    };
    return (
      <Col md={6}>
        <Col md={12} style={settingsBoxStyle}>
          <Col md={6} style={headerTextStyle}>
            <span className="pull-left" >{this.props.type.toUpperCase()}</span>
          </Col>
          <Col md={6} style={headerTextStyle}>
            <div className="pull-right">
              {/*
              <Dropdown id="dropdown-custom-menu" style={dropdownStyle}>
                <CustomToggle bsRole="toggle" >
                  <span style={this.selectedDevice('sensor').style}>{this.selectedDevice('sensor').text}</span>
                  <span className="fa-stack">
                    <FontAwesome style={upStyle} stack={'1x'} name={'chevron-up'} size={'lg'} />
                    <FontAwesome style={downStyle} stack={'1x'} name={'chevron-down'} size={'lg'} />
                  </span>
                </CustomToggle>

                <CustomMenu bsRole="menu">
                  { this.unselectedDevices('sensors') }
                </CustomMenu>
              </Dropdown>
              */}
            </div>
          </Col>
          {/* this.getSensors(this.props.selected.sensor) */}
        </Col>
      </Col>
    );
  }
}


/* [] - END OF FILE */
