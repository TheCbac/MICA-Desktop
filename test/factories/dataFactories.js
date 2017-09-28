// @flow
/* **********************************************************
* File: tests/factories/dataFactories.js
*
* Brief: Factory for creating dummy data

* Author: Craig Cheney
*
* 2017.09.28 CC - Document Created
*
********************************************************* */
import { TimeEvent } from 'pondjs';

export function accDataFactory(keys?: string[], time?: number): TimeEvent {
  /* Set defaults */
  const timestamp = time || new Date().getTime();
  const eventKeys = keys || ['x'];
  /* Data Object */
  const data = {};
  /* Iterate through each channel */
  for (let i = 0; i < eventKeys.length; i++) {
    const key = eventKeys[i];
    /* Create and store a random acceleration value */
    data[key] = randomNumber(-20, 20);
  }
  /* return the time event */
  return new TimeEvent(timestamp, data);
}

/* Return a random number on the range [min, max] */
export function randomNumber(min: number, max: number): number {
  return (Math.random() * (max - min)) + min;
}

/* [] - END OF FILE */
