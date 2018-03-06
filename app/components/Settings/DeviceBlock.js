/* @flow */
/* **********************************************************
* File: app/components/Settings/DeviceBlock.js
*
* Brief: Block that corresponds to one Device
*
* Author: Craig Cheney
*
* 2017.09.26 CC - Document created, refactored from SettingsPage
*
********************************************************* */
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Col, Collapse, Well, Row } from 'react-bootstrap';
import SensorBlock from './SensorBlock';
import GeneratorBlock from './GeneratorBlock';
import type { idType } from '../../types/paramTypes';
import type { thunkType } from '../../types/functionTypes';
import type { devicesStateObjType } from '../../types/stateTypes';
import type {
  setDeviceActiveActionType,
  setSensorChannelsActionT
} from '../../types/actionTypes';


type propsType = {
  id: string,
  device: devicesStateObjType,
  setDeviceActive: (deviceId: idType, newState: boolean) => setDeviceActiveActionType,
  setSensorActive: (
    deviceId: idType,
    sensorId: idType,
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
  setGeneratorActive: (
    deviceId: idType,
    generatorId: idType,
    newState: boolean
  ) => thunkType,
  zeroSensor: (
    deviceId: idType,
    sensorId: idType
  ) => thunkType
};

type stateType = {
  open: boolean
};

export default class Device extends Component<propsType, stateType> {
  /* Constructor */
  constructor(props: propsType) {
    super(props);
    /* Set the default state */
    this.state = {
      open: props.device.active,
    };
  }
  /* Get the Settings for the devices */
  getSensors(): [] | string {
    const sensorsList = [];
    const { sensors } = this.props.device.settings;
    /* IDs of the sensors */
    const sensorIdList = Object.keys(sensors);
    for (let i = 0; i < sensorIdList.length; i++) {
      const sensorId = sensorIdList[i];
      const sensorSettings = sensors[parseInt(sensorId, 10)];
      /* Push the new sensor */
      sensorsList.push(
        <SensorBlock
          key={i}
          deviceId={this.props.id}
          sensorId={sensorId}
          sensorSettings={sensorSettings}
          setSensorActive={this.props.setSensorActive}
          setSensorChannels={this.props.setSensorChannels}
          setSensorParams={this.props.setSensorParams}
          zeroSensor={this.props.zeroSensor}
        />
      );
    }
    return sensorsList;
  }
  /* Get the Settings for the devices */
  getGenerators(): [] | string {
    const generatorsList = [];
    const { generators } = this.props.device.settings;
    /* IDs of the generators */
    const generatorIdList = Object.keys(generators);
    for (let i = 0; i < generatorIdList.length; i++) {
      const generatorId = generatorIdList[i];
      const generatorSettings = generators[parseInt(generatorId, 10)];
      /* Push the new generator */
      generatorsList.push(
        <GeneratorBlock
          key={i}
          deviceId={this.props.id}
          generatorId={generatorId}
          generatorSettings={generatorSettings}
          setGeneratorActive={this.props.setGeneratorActive}
        />
      );
    }
    return generatorsList;
  }
  /* Style of the caret that opens the device settings */
  caretStyle() {
    const style = {
      transition: '',
      textShadow: '',
      color: '',
      transform: '',
      marginRight: '7px'
    };
    if (this.state.open) {
      // style.textShadow = 'white 0 0 20px';
      // style.color = 'white';
      style.transition = 'all 2 linear';
      style.transform = 'rotate(90deg)';
    }
    return style;
  }
  /* Opens and closes the device settings */
  toggleOpen(): void {
    this.setState({ open: !this.state.open });
  }
  /* Power button style */
  powerBtnStyle() {
    const style = {
      transform: 'rotate(-90deg)',
      fontSize: '1.25em',
      color: 'black',
      textShadow: ''
    };
    if (this.props.device.active) {
      style.transform = '';
      style.textShadow = 'white 0 0 20px';
      style.color = 'white';
    }
    return style;
  }
  /* Style of the name */
  nameStyle() {
    const style = {
      fontSize: '1.5em',
      fontFamily: 'Franklin Gothic Book',
      color: 'Black',
      textShadow: ''
    };
    if (this.props.device.active) {
      style.color = 'white';
      style.textShadow = 'white 0 0 20px';
    }
    return style;
  }
  /* Toggle sensor power */
  toggleSensorPower() {
    const newActive = !this.props.device.active;
    this.props.setDeviceActive(
      this.props.id,
      newActive
    );
    /* Toggle the state of the component and open/close the settings list */
    this.setState({ open: newActive });
  }
  /* Style of the background box */
  deviceBoxStyle() {
    const style = {
      backgroundColor: '#D1CAC8',
      borderRadius: '5px 5px 0 0',
      marginTop: '10px'
    };
    if (!this.state.open) {
      style.borderRadius = '5px';
    }
    return style;
  }
  /* Style of the well background */
  wellBoxStyle() {
    const style = { backgroundColor: '#D1CAC8', borderRadius: '0 0 5px 5px' };
    if (!this.state.open) {
      style.backgroundColor = '';
    }
    return style;
  }
  render() {
    const powerToggleStyle = {
      marginLeft: '10px',
      color: '#003300',
      fontSize: '1.1em',
    };
    return (
      <div style={this.deviceBoxStyle()}>
        <Row />
        <Col md={12} style={{ marginTop: '15px' }}>
          <div style={{ lineHeight: '30px' }}>
            <span className='pull-left' style={this.nameStyle()}>
              <FontAwesome
                className='hoverGlow'
                name='angle-right'
                size='lg'
                style={this.caretStyle()}
                onClick={() => this.toggleOpen()}
              />
              {this.props.device.name.toUpperCase()}
            </span>
            <span style={powerToggleStyle} className='pull-right'>
              <FontAwesome
                className='hoverGlow'
                name='power-off'
                size='lg'
                onClick={() => this.toggleSensorPower()}
                style={this.powerBtnStyle()}
              />
            </span>
          </div>
        </Col>
        <Row />
        <Col md={12} style={this.wellBoxStyle()}>
          <Collapse in={this.state.open} >
            <div>
              <Well style={{ minHeight: '200px', backgroundColor: '#CCD4E9', borderColor: '#CCD4E9', overflow: 'hidden' }}>
                <Col md={6} style={{ minHeight: '165px' }}>
                  <Col md={12} className='text-center'>
                    <span style={{ fontSize: '1.5em' }}>SENSORS</span>
                  </Col>
                  {this.getSensors()}
                </Col>

                <Col md={6} style={{ borderLeft: '2px solid black', minHeight: '165px' }}>
                  <Col md={12} className='text-center' >
                    <span style={{ fontSize: '1.5em' }}>GENERATORS</span>
                  </Col>
                  {this.getGenerators()}
                </Col>
              </Well>
            </div>
          </Collapse>
        </Col>
      </div>
    );
  }
}


/* [] - END OF FILE */
