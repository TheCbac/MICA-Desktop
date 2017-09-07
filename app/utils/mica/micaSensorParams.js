// @flow
/* **********************************************************
* File: utils/mica/micaSensorParams.js
*
* Brief: Contains the definitions for the available sensor
* params
*
* Authors: Craig Cheney
*
* 2017.09.06 CC - Document created
*
********************************************************* */
import { nameToId } from './micaConstants';

/* Object to be passed to Sensor Settings Component */
const sensorParams = {};

/* *********** Accelerometer *********** */
/* Add the Accelerometer key */
const accId = nameToId('Accelerometer').id;
sensorParams[accId] = [];
/* Range */
const accRange = {
  display: 'Range (g)',
  name: 'range',
  address: 0x0F,
  default: 3,
  gain(value) {
    return 1 / parseInt(value, 10);
  },
  options: [[2, 3], [4, 5], [8, 8], [16, 12]].map(range => ({
    name: 'range',
    value: range[0],
    word: range[1],
    display: `±${range[0]}`,
  }))
};

/* Accelerometer bandwidth */
const accBandwidth = {
  display: 'Low Pass Filter Bandwidth (Hz)',
  name: 'filterBw',
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
};
/* Push the Accelerometer settings */
sensorParams[accId].push(accRange, accBandwidth);

/* *********** Gyroscope *********** */
/* Add the Gyroscope key */
const gyrId = nameToId('Gyroscope').id;
sensorParams[gyrId] = [];

/* Gyroscope range */
const gyrRange = {
  display: 'Range (°/s)',
  name: 'range',
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
  ].map(range => ({
    name: 'range',
    value: range[0],
    word: range[1],
    display: `±${range[0]}`,
  })),
};

/* Push the Gyroscope Settings */
sensorParams[gyrId].push(gyrRange);

/* Export the sensor list */
export { sensorParams as default };

/* [] - END OF FILE */
