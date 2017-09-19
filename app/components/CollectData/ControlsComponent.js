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
import type { deviceSettingsType } from '../../types/paramTypes';

/* Get the generator component based on ID - should be refactored and moved */
function mapGeneratorIdToComponent(
  deviceId: string,
  generatorId: number | string,
  key: number): * {
  /* */
  const id = parseInt(generatorId, 10);
  switch (id) {
    case 5:
      return (<DriveBot key={key} deviceId={deviceId} />);
    default:
      console.log('mapGeneratorIdToComponent', generatorId);
      return '';

  }
}
type propsType = {
  deviceSettings: deviceSettingsType
};

export default class ControlsComponent extends Component {
  props: propsType
  /* Return all of the components for controlling the
   * active generators */
  getGeneratorControls(): * {
    /* Find the ID of all active devices */
    const { deviceSettings } = this.props;
    const deviceKeys = Object.keys(deviceSettings);
    /* Return array */
    const componentArray = [];
    /* Iterate through the devices */
    for (let i = 0; i < deviceKeys.length; i++) {
      const deviceId = deviceKeys[i];
      const device = deviceSettings[deviceId];
      /* Make sure the device is active */
      if (device.active) {
        /* Iterate through all of the generators */
        const generators = device.generators;
        const generatorKeys = Object.keys(generators);
        for (let j = 0; j < generatorKeys.length; j++) {
          const generatorId = generatorKeys[j];
          /* Check to see if it is active */
          if (generators[generatorId].active) {
            componentArray.push(mapGeneratorIdToComponent(deviceId, generatorId, j));
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
