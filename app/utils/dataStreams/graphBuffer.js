/* @flow */
/* **********************************************************
* File: utils/dataStreams/graphBuffer.js
*
* Brief: Provides the API for storing and retrieving
*   data for graphing.
*
* Authors: Craig Cheney
*
* 2017.10.01 CC - Updated for multi-device
* 2017.09.27 CC - Document created
*
********************************************************* */
import { TimeEvent, TimeSeries } from 'pondjs';
import jetpack from 'fs-jetpack';
import { createCsv, dataObjToCsv } from './data2csv';
import type { idType } from '../../types/paramTypes';
import type {
  multiDeviceDataObjT,
  deviceObjT,
  startTimeT,
  lastTimeT,
  dataIndexT
} from '../../types/graphBufferTypes';

/* Data Object for multi devices */
const dataObj: multiDeviceDataObjT = {};


/* Check the data obj for a key, creates an empty device if it doesn't exist */
export function getDeviceObj(deviceId: idType): deviceObjT {
 /* Make sure the dataArray exists */
  if (Object.keys(dataObj).indexOf(deviceId) < 0) {
    const time = new Date().getTime();
    /* Create the object */
    dataObj[deviceId] = {
      data: [],
      dataIndex: 0,
      startTime: time,
      lastTime: time
    };
  }
  return dataObj[deviceId];
}
/* ******************* TIMING ******************* */
/* Set the start time of the data sequence */
export function resetStartTime(id: idType): startTimeT {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Update the start time */
  const startTime = new Date().getTime();
  deviceObj.startTime = startTime;
  /* Set the last time to the start time */
  deviceObj.lastTime = startTime;
  /* Return the start time */
  return startTime;
}

/* Get the last time stamp entered */
export function getLastTime(id: idType): lastTimeT {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Get the object */
  return deviceObj.lastTime;
}

/* Return the start time */
export function getStartTime(id: idType): startTimeT {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Return start time */
  return deviceObj.startTime;
}

/* ******************* DATA ******************* */
/* Get the index of the data */
export function getDataIndex(id: idType): dataIndexT {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Return data index */
  return deviceObj.dataIndex;
}
/* Return the length of the dataArray */
export function getDataLength(id: idType): number {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Return the data length */
  return deviceObj.data.length;
}

/* Store a data point returns the length of the data array stored */
export function logDataPoints(id: idType, events: TimeEvent[]): number {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  if (events.length) {
    /* Push the data points to the data array */
    deviceObj.data.push(...events);
    /* Set the last time to the time stamp of the last event */
    deviceObj.lastTime = events[events.length - 1].timestamp().getTime();
  }
  return deviceObj.data.length;
}

/* Clear the buffer, reset the index */
export function resetDataBuffer(id: idType): void {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Clear the Array */
  deviceObj.data = [];
  /* Reset the index */
  deviceObj.dataIndex = 0;
}

/* Retrieve the next data point */
export function getDataPointDecimated(id: idType, decimation?: number): ?TimeEvent {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Set the default decimation */
  const decimate = decimation || 1;
  /* Round the index to an integer  */
  const idx = Math.round(deviceObj.dataIndex);
  /* Get the data */
  const data = deviceObj.data[idx];
  /* Increment the index by the decimation factor, if it was found */
  if (data) { deviceObj.dataIndex += decimate; }
  /* return the data value */
  return data;
}


/* Return the first point in the data series */
export function getFirstDataPoint(id: idType): ?TimeEvent {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  return deviceObj.data[0];
}
/* Retrieve the last data point in the series */
export function getLastDataPointsDecimated(
  id: idType,
  N?: number,
  decimation?: number
): TimeEvent[] {
  /* Get the device Obj */
  const deviceObj = getDeviceObj(id);
  /* Set the defaults */
  const requestedNum = N || 1;
  const decimate = decimation || 1;
  const returnArray = [];
  const dataArray = deviceObj.data;
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

/* Saves the current list of events in the buffer to the specified location */
export function saveLastRun(path: string): void {
  /* Create a time series from the dataArray */
  const csvData = dataObjToCsv(dataObj);
  console.log('saveLast run');
  /* Write the data */
  jetpack.write(path, csvData);

  // const timeSeries = new TimeSeries({
  //   name: 'testData',
  //   events: eventList
  // });

  /* convert to a csv */
  // const csvData = createCsv(timeSeries);
  // /* Write the data */
  // jetpack.write(path, csvData);
}

/* [] - END OF FILE */
