// @flow
/* eslint no-bitwise: "off" */ /* CC: Channels use bitwise masks */
/* **********************************************************
* File: utils/mica/micaSensorParams.js
*
* Brief: Contains the definitions for the available sensor
* params.
*
* Authors: Craig Cheney
*
* 2017.09.06 CC - Document created
*
********************************************************* */
import { nameToId } from './micaConstants';
import type { deviceParamType, deviceChannelType, deviceParamObj } from '../../types/paramTypes';

/* Object to be passed to Sensor Settings Component */
const sensorParams: deviceParamObj = {};

/* *********** Accelerometer *********** */
/* Add the Accelerometer key */
const accId = nameToId('Accelerometer').id;
if (accId) {
  /* Range */
  const range: deviceParamType = {
    display: 'Range (g)',
    address: 0x0F,
    default: 3,
    gain(value) {
      return 1 / parseInt(value, 10);
    },
    options: [[2, 3], [4, 5], [8, 8], [16, 12]].map(option => ({
      name: 'range',
      value: option[0],
      word: option[1],
      display: `±${option[0]}`,
    })),
    btnType: 'radio'
  };

  /* Accelerometer bandwidth */
  const bandwidth: deviceParamType = {
    display: 'Low Pass Filter Bandwidth (Hz)',
    default: 11,
    address: 0x10,
    options: [
      [8, 8],
      [16, 9],
      [31, 10],
      [62, 11],
      [125, 12],
      [250, 13],
      [500, 14],
      [1000, 15]
    ].map(cutoff => ({
      name: 'filterBw',
      value: cutoff[0],
      word: cutoff[1],
      display: `${cutoff[0]}`,
    })),
    btnType: 'radio'
  };
  /* Channels available on the accelerometer - needs to be
  * reconciled with metadata */
  const accChannels: deviceChannelType = {
    display: 'Data Channels',
    default: [0],
    options: ['X', 'Y', 'Z']
  };
  /* Construct the Accelerometer settings obj */
  sensorParams[accId] = {
    channels: accChannels,
    dynamicParams: {
      range,
      bandwidth
    }
  };
}

/* *********** Gyroscope *********** */
/* Add the Gyroscope key */
const gyrId = nameToId('Gyroscope').id;
if (gyrId) {
  /* Gyroscope range */
  const range: deviceParamType = {
    display: 'Range (°/s)',
    address: 0x0F,
    default: 0,
    gain(value) {
      return 1 / parseInt(value, 10);
    },
    options: [
      [125, 4],
      [250, 3],
      [500, 2],
      [1000, 1],
      [2000, 0]
    ].map(option => ({
      name: 'range',
      value: option[0],
      word: option[1],
      display: `±${option[0]}`,
    })),
    btnType: 'radio'
  };
  /* Channels available on the gyroscope */
  const gyrChannels: deviceChannelType = {
    display: 'Data Channels',
    default: [0],
    options: ['X', 'Y', 'Z']
  };
  /* Push the Gyroscope Settings */
  sensorParams[gyrId] = {
    channels: gyrChannels,
    dynamicParams: {
      range
    }
  };
}
/* Export the sensor list */
export { sensorParams as default };

/* [] - END OF FILE */
