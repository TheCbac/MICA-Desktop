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
const dataArray: TimeEvent[] = [];
let index = 0;


export function getDataIndex(): number {
  return index;
}
/* Store a data point */
export function logDataPoint(events: TimeEvent[]): void {
  dataArray.push(...events);
}

/* Retrieve the next data point */
export function getDataPoint(): ?TimeEvent {
  const val = dataArray.slice(index, (index + 1));
  // console.log('graphBuffer', val, index, dataArray.length);
  if (val.length) {
    index += 1;
    return val[0];
  }
  return undefined;
}

export function getLastDataPoint(): ?TimeEvent {
  return dataArray[dataArray.length - 1];
}
/* [] - END OF FILE */
