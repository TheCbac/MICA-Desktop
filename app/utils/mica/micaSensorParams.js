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
/* Add the Accelerometer Value */
const accId = nameToId('Accelerometer').id;
sensorParams[accId] = [];
/* Range */
const accRange = {
  display: 'Range',
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
    display: `±${range[0]} g`,
  }))
};

sensorParams[accId].push(accRange);

export { sensorParams as default };

/* [] - END OF FILE */
