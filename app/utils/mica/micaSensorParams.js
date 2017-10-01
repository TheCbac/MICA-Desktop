// @flow
/* eslint quote-props: ["error", "as-needed", { "numbers": true }] */
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
import type {
  deviceParamType,
  deviceChannelType,
  deviceParamObj,
  deviceRangeParamT
} from '../../types/paramTypes';

/* Object to be passed to Sensor Settings Component */
const sensorParams: deviceParamObj = {};

/* *********** Accelerometer *********** */
/* Add the Accelerometer key */
const accId = nameToId('Accelerometer').id;
if (accId) {
  /* Range */
  const range: deviceRangeParamT = {
    display: 'Range (g)',
    address: 0x0F,
    default: 3,
    gain(value) {
      const gainParams = {
        '3': 2,
        '5': 4,
        '8': 8,
        '12': 16
      };
      return 1 / gainParams[value];
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
    default: {
      '0': { active: true, name: 'X', offset: 0 },
      '1': { active: false, name: 'Y', offset: 0 },
      '2': { active: false, name: 'Z', offset: 0 },
    }
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
  const range: deviceRangeParamT = {
    display: 'Range (°/s)',
    address: 0x0F,
    default: 0,
    gain(value) {
      const gainParams = {
        '4': 125,
        '3': 250,
        '2': 500,
        '1': 1000,
        '0': 2000
      };
      return 1 / gainParams[value];
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
    default: {
      '0': { active: true, name: 'X', offset: 0 },
      '1': { active: false, name: 'Y', offset: 0 },
      '2': { active: false, name: 'Z', offset: 0 },
    }
  };
  /* Push the Gyroscope Settings */
  sensorParams[gyrId] = {
    channels: gyrChannels,
    dynamicParams: {
      range
    }
  };
}

/* *********** Load Cell  *********** */

/* Add the Gyroscope key */
const lcellId = nameToId('Load Cell').id;
if (lcellId) {
  /* Gyroscope range */
  const range: deviceRangeParamT = {
    display: 'Gain',
    address: 0,
    default: 1024,
    gain(value) {
      return 2 ** (value - 1);
    },
    options: [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096].map(option => ({
      name: 'gain',
      value: option,
      word: option ? Math.log2(option) + 1 : 0,
      display: option.toString(),
    })),
    btnType: 'radio'
  };
  /* Channels available on the gyroscope */
  const lcellChannels: deviceChannelType = {
    display: 'Data Channels',
    default: {
      '0': { active: true, name: 'Channel 1', offset: 0 },
    }
  };
  /* Push the Gyroscope Settings */
  sensorParams[lcellId] = {
    channels: lcellChannels,
    dynamicParams: {
      range
    }
  };
}

/* *********** Current Sensor  *********** */

/* Add the Gyroscope key */
const { id: iOutId } = nameToId('Output Current');
if (iOutId) {
  /* Channels available on the gyroscope */
  const iOutChannels: deviceChannelType = {
    display: 'Data Channels',
    default: {
      '0': { active: true, name: 'Coil Current', offset: 0 },
    }
  };
  /* Push the Gyroscope Settings */
  sensorParams[iOutId] = {
    channels: iOutChannels,
    dynamicParams: {}
  };
}

/* Export the sensor list */
export { sensorParams as default };

/* [] - END OF FILE */
