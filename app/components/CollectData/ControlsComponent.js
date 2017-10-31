/* @flow */
/* **********************************************************
* File: components/CollectData/ControlsComponent.js
*
* Brief: Control interface for initiating generator actions
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import DriveBot from './DriveBotComponent';
import CoilControl from './CoilControl';
import type { devicesStateType } from '../../types/stateTypes';

/* Get the generator component based on ID - should be refactored and moved */
function mapGeneratorIdToComponent(
  deviceId: string,
  generatorId: number | string,
  key: number): * {
  /* */
  const id = parseInt(generatorId, 10);
  switch (id) {
    case 3:
      return (<CoilControl key={key} deviceId={deviceId} />);
    case 5:
      return (<DriveBot key={key} deviceId={deviceId} />);
    default:
      console.log('mapGeneratorIdToComponent', generatorId);
      return '';

  }
}
type propsType = {
  devices: devicesStateType
};

export default class ControlsComponent extends Component<propsType> {
  /* Return all of the components for controlling the
   * active generators */
  getGeneratorControls(): * {
    /* Find the ID of all active devices */
    const { devices } = this.props;
    const deviceKeys = Object.keys(devices);
    /* Return array */
    const componentArray = [];
    let key = 0;
    /* Iterate through the devices */
    for (let i = 0; i < deviceKeys.length; i++) {
      const deviceId = deviceKeys[i];
      const device = devices[deviceId];
      /* Make sure the device is active */
      if (device.active) {
        /* Iterate through all of the generators */
        const { generators } = device.settings;
        const generatorKeys = Object.keys(generators);
        for (let j = 0; j < generatorKeys.length; j++) {
          const generatorId = generatorKeys[j];
          /* Check to see if it is active */
          if (generators[parseInt(generatorId, 10)].active) {
            componentArray.push(mapGeneratorIdToComponent(deviceId, generatorId, key));
            /* Increment the key */
            key += 1;
          }
        }
      }
    }
    /* Return the components */
    return componentArray;
  }

  render() {
    /* Styles */
    const boxStyle = {
      marginBottom: '20px',
      backgroundColor: '#E0E5E8',
      minHeight: '240px',
      fontFamily: 'Abel'
    };
    return (
      <div style={boxStyle}>
        <div className={'text-center'} style={{ fontSize: '1.5em' }}>Controls</div>
        <Row />
        <div>
          {this.getGeneratorControls()}
        </div>
      </div>
    );
  }
}
/* [] - END OF FILE */
