// @flow
/* **********************************************************
* File: utils/deviceUtils.js
*
* Brief: Utility functions for interacting with BLE devices
*
* Author: Craig Cheney
*
* 2017.08.27 CC - Document created
*
********************************************************* */
import log from './loggingUtils';
import type {
  noblePeripheralType,
  nobleIdType,
  nobleCharacteristicType,
  nobleServiceType
} from '../types/paramTypes';

/* Return an array from an array like object */
export function shallowObjToArray(obj: {}): ?mixed[] {
  const objArray = [];
  const keys = Object.keys(obj);
  /* Iterate over the keys */
  for (let i = 0; i < keys.length; i += 1) {
    objArray.push(obj[keys[i]]);
  }
  return objArray;
}

/* Return a float from a buffer */
export function bufferToFloat(buffer: Buffer): ?number {
  /* Must be four bytes */
  if (buffer.length !== 4) { return undefined; }
  /* Array to place bytes in */
  const floatBytes = [];
  /* Reverse order */
  floatBytes[3] = buffer[0];
  floatBytes[2] = buffer[1];
  floatBytes[1] = buffer[2];
  floatBytes[0] = buffer[3];
  /* Convert to float */
  return new Buffer(floatBytes).readFloatBE(0);
}

/* Return a random integer between two numbers */
export function randomInt(min: number = 0, max: number = 255): number {
  const minF = Math.ceil(min);
  const maxF = Math.floor(max);
  return Math.floor(Math.random() * (maxF - minF)) + minF;
}

/* [] - END OF FILE */
