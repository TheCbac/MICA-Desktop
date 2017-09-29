/* @flow */
/* **********************************************************
* File: utils/dataStreams/graphBuffer.js
*
* Brief: Provides the API for storing and retrieving
*   data for graphing.
*
* Authors: Craig Cheney
*
* 2017.09.27 CC - Document created
*
********************************************************* */
import { TimeEvent } from 'pondjs';

/* Object to store point */
let startTime: number;
let lastTime: number;
let dataArray: TimeEvent[] = [];
let index = 0;

/* ******* TIMING ******* */
/* Set the start time of the data sequence */
export function resetStartTime(): number {
  /* Update the start time */
  startTime = new Date().getTime();
  /* Set the last time to the start time */
  lastTime = startTime;
  /* Return the start time */
  return startTime;
}
/* Get the last time stamp entered */
export function getLastTime(): number {
  return lastTime;
}

/* Return the start time */
export function getStartTime(): number {
  return startTime;
}

/* ******* DATA ******* */
/* Get the index of the data */
export function getDataIndex(): number {
  return index;
}
/* Return the length of the dataArray */
export function getDataLength(): number {
  return dataArray.length;
}
/* Store a data point returns the length of the data array stored */
export function logDataPoints(events: TimeEvent[]): number {
  if (events.length) {
    /* Push the data points to the data array */
    dataArray.push(...events);
    /* Set the last time to the time stamp of the last event */
    lastTime = events[events.length - 1].toPoint()[0];
  }
  return dataArray.length;
}

/* Retrieve the next data point */
export function getDataPointDecimated(decimation?: number): ?TimeEvent {
  /* Set the default decimation */
  const decimate = decimation || 1;
  /* Round the index to an integer  */
  const idx = Math.round(index);
  /* Get the data */
  const data = dataArray[idx];
  /* Increment the index by the decimation factor, if it was found */
  if (data) { index += decimate; }
  /* return the data value */
  return data;
}

/* Clear the buffer, reset the index */
export function resetBuffer(): void {
  /* Clear the Array */
  dataArray = [];
  /* Reset the index */
  index = 0;
}

/* Return the first point in the data series */
export function getFirstDataPoint(): ?TimeEvent {
  return dataArray[0];
}
/* Retrieve the last data point in the series */
export function getLastDataPointsDecimated(N?: number, decimation?: number): TimeEvent[] {
  /* Set the defaults */
  const requestedNum = N || 1;
  const decimate = decimation || 1;
  const returnArray = [];
  const length = dataArray.length;
  if (length) {
    /* Determine max number of elements able to return */
    const maxNum = (Math.ceil(length / decimate));
    /* Return the smaller of the r */
    const returnNum = requestedNum < maxNum ? requestedNum : maxNum;
    /* Iterate through the array */
    let idx = length - 1;
    for (let i = 0; i < returnNum; i++) {
      returnArray.unshift(dataArray[Math.round(idx)]);
      idx -= decimate;
    }
  }
  return returnArray;
}
/* PICKUP ON TESTS */

/* [] - END OF FILE */
