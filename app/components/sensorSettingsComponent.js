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
* 2017.08.30 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Grid, Col, Row, Dropdown, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import CustomToggle from './customToggle';
import CustomMenu from './customMenu';
import SensorComponent from './SensorComponent';
import GeneratorComponent from './GeneratorComponent';
import log from '../utils/loggingUtils';
import type { thunkType } from '../types/functionTypes';
import type { selectType } from '../types/stateTypes';
import type { deviceSettingsType, nobleIdType } from '../types/paramTypes';

// log.debugLevel = 5;
log.debug('sensorSettingsComponent: debug level', log.debugLevel);
/* Props used in component */
type propsType = {
  selected: {
    generator: selectType,
    sensor: selectType
  },
  unselected: {
    generators: selectType[],
    sensors: selectType[]
  },
  deviceSettings: deviceSettingsType,
  /* Action Functions */
  getSelectedDevices: () => thunkType,
  setSelectedDevices: (
    type: 'sensors' | 'generators',
    newDevice: selectType
  ) => thunkType,
  setSensorActive: (
    deviceId: nobleIdType,
    sensorId: number | string,
    newState: boolean
  ) => thunkType,
  setGeneratorActive: (
    deviceId: nobleIdType,
    generatorId: number | string,
    newState: boolean
  ) => thunkType,
  setSensorChannels: (
    deviceId: nobleIdType,
    sensorId: number | string,
    newChannels: number[]
  ) => thunkType,
  setSensorParams: (
    deviceId: nobleIdType,
    sensorId: number | string,
    paramName: string,
    paramValue: number
  ) => thunkType
};

export default class sensorSettings extends Component {
  /* Component properties */
  props: propsType;
  state: {
    open: boolean
  };
  constructor(props: propsType) {
    super(props);
    /* Trigger the selected devices to occur */
    props.getSelectedDevices();
    this.state = {
      open: false
    };
  }
  /* Get the selected device */
  selectedDevice(type: 'sensor' | 'generator'): {text: string, style: {fontStyle: string}} {
    const device = this.props.selected[type];
    let text = 'NO DEVICES';
    let style = 'italic';
    /* If the device is present */
    if (device.name) {
      text = device.name;
      style = 'normal';
    }
    return {
      text: text.toUpperCase(),
      style: { fontStyle: style }
    };
  }
  /* Unselected devices */
  unselectedDevices(type: 'sensors' | 'generators'): *[] {
    const deviceStyle = {
      fontFamily: 'Franklin Gothic Book',
      color: '#7C7C7C',
      textDecoration: 'none',
      fontStyle: 'normal'
    };
    const array = [];
    /* iterate over devices */
    const len = this.props.unselected[type].length;
    if (len) {
      for (let i = 0; i < len; i += 1) {
        const selectObj = this.props.unselected[type][i];
        /* Create the element - should this be a new component? */
        const element = (<MenuItem
          style={deviceStyle}
          onClick={(e) => {
            e.preventDefault();
            this.props.setSelectedDevices(type, selectObj);
          }}
          key={i}
        >{selectObj.name}</MenuItem>);
        /* Populate the array */
        array.push(element);
      }
    } else {
      deviceStyle.fontStyle = 'italic';
      array.push(<MenuItem style={deviceStyle} key="none">NO OTHER DEVICES</MenuItem>);
    }

    return array;
  }
  /* Refactoring of the senor/generator */
  getSensors(selectDevice: selectType): [] | string {
    /* Ensure that there is a name */
    if (!selectDevice.name) { return ''; }
    /* No sensors or generators found text */
    const noSensorText = `${selectDevice.name} CONTAINS NO SENSORS`;
    /* The device does not contain any sensors/generators */
    if (!selectDevice.id) { return noSensorText; }
    /* Get the device settings */
    const deviceSettings = this.props.deviceSettings[selectDevice.id];
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
  getGenerators(selectDevice: selectType): [] | string {
    /* Ensure that there is a name */
    if (!selectDevice.name) { return ''; }
    /* No sensors or generators found text */
    const noGeneratorText = `${selectDevice.name} CONTAINS NO GENERATORS`;
    /* The device does not contain any sensors/generators */
    if (!selectDevice.id) { return noGeneratorText; }
    /* Get the device settings */
    const deviceSettings = this.props.deviceSettings[selectDevice.id];
    if (!deviceSettings) { return noGeneratorText; }
    /* find the sensors in the settings */
    const generatorKeys = Object.keys(deviceSettings.generators);
    if (generatorKeys.length === 0) { return noGeneratorText; }
    const componentList = [];
    /* Create a component for all of the device */
    for (let i = 0; i < generatorKeys.length; i++) {
      const generatorId = generatorKeys[i];
      const generator = deviceSettings.generators[generatorId];
      componentList.push(
        <GeneratorComponent
          key={i}
          deviceId={selectDevice.id}
          generatorId={generatorId}
          generatorSettings={generator}
          setGeneratorActive={this.props.setGeneratorActive}
          setSensorChannels={this.props.setSensorChannels}
          setSensorParams={this.props.setSensorParams}
        />
    );
    }
    return componentList;
  }
  /* Render function */
  render() {
    const sensorBoxStyle = {
      backgroundColor: '#D0E1D0',
      minHeight: '400px',
    };
    const headerTextStyle = {
      fontSize: '1.5em',
      fontFamily: 'Franklin Gothic Book',
      marginTop: '15px',
      color: '#7C7C7C',
    };
    const upStyle = {
      fontSize: '12px',
      marginTop: '-8px',
      marginLeft: '-8px'
    };
    const downStyle = {
      fontSize: '12px',
      marginTop: '2px',
      marginLeft: '-8px'
    };
    const dropdownStyle = {
      marginTop: '-4px',
      marginRight: '-30px'
    };
    return (
      <Grid fluid>
        <Row>

          <Col md={6}>
            <Col md={12} mdOffset={0} style={sensorBoxStyle}>
              <Col md={6} style={headerTextStyle}>
                <span className="pull-left" >SENSORS</span>
              </Col>
              <Col md={6} style={headerTextStyle}>
                <div className="pull-right">
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
                </div>
              </Col>
              { this.getSensors(this.props.selected.sensor) }
            </Col>
          </Col>
          <Col md={6}>
            <Col md={12} mdOffset={0} style={sensorBoxStyle}>
              <Col md={6} style={headerTextStyle}>
                <span className="pull-left" >GENERATORS</span>
              </Col>
              <Col md={6} style={headerTextStyle}>
                <div className="pull-right">
                  <Dropdown id="dropdown-custom-menu" style={dropdownStyle}>
                    <CustomToggle bsRole="toggle" >
                      <span style={this.selectedDevice('generator').style}>{this.selectedDevice('generator').text}</span>
                      <span className="fa-stack">
                        <FontAwesome style={upStyle} stack={'1x'} name={'chevron-up'} size={'lg'} />
                        <FontAwesome style={downStyle} stack={'1x'} name={'chevron-down'} size={'lg'} />
                      </span>
                    </CustomToggle>

                    <CustomMenu bsRole="menu">
                      {this.unselectedDevices('generators')}
                    </CustomMenu>
                  </Dropdown>
                </div>
              </Col>
              { this.getGenerators(this.props.selected.generator)}
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}
/* [] - END OF FILE */
