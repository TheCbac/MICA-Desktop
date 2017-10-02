/* @flow */
/* **********************************************************
* File: utils/dataStreams/data2csv.js
*
* Brief: Provides the API for converting a Timeseries JSON
*   to a csv
*
* Authors: Craig Cheney
*
* 2017.09.28 CC - Document created
*
********************************************************* */
import { TimeSeries } from 'pondjs';
import store from '../../index';
import { getActiveSensorList, channelsToActiveNameList } from '../mica/parseDataPacket';
import type { multiDeviceDataObjT } from '../../types/graphBufferTypes';
import type { idType } from '../../types/paramTypes';

export function createCsv(series: TimeSeries): string {
  let csvString = '';
  const colDelimiter = ',';
  const rowDelimiter = '\n';
  /* Get the start time of the series */
  const startTime = series.begin().getTime();
  /* Convert the timeseries to a json */
  const dataJson = series.toJSON();
  const { points, columns } = dataJson;
  const numRows = points.length;
  const numChannels = columns.length;
  /* Iterate through each row of data */
  for (let row = 0; row < numRows; row++) {
    /* iterate through each channel */
    for (let chan = 0; chan < numChannels; chan++) {
      const entry = points[row][chan];
      /* Time stamp channel */
      if (chan === 0) {
        /* Convert time relative to start and into seconds */
        const deltaTime = (entry - startTime) / 1000;
        csvString += deltaTime.toFixed(3);
      } else {
        /* Data row */
        /* append to the string */
        csvString += entry.toFixed(5);
      }

      /* append the col delimiter */
      csvString += colDelimiter;
    }
    /* Start a new row */
    csvString += rowDelimiter;
  }
  return csvString;
}
/* Convert a multi device dataObj to a csv string */
export function dataObjToCsv(dataObj: multiDeviceDataObjT): string {
  let csvString = '';
  const colDelimiter = ',';
  const rowDelimiter = '\n';
  /* Find all of the active devices */
  const deviceIdList = Object.keys(dataObj);
  const dataList = [];
  const startTimes = [];
  let maxRows = 0;
  /* Iterate through each device */
  for (let i = 0; i < deviceIdList.length; i++) {
    const deviceId = deviceIdList[i];
    const { data, startTime } = dataObj[deviceId];
    /* push the data to the list */
    dataList.push(data);
    /* Cache the start times */
    startTimes.push(startTime);
    /* Store the longest of all the data sets */
    maxRows = Math.max(maxRows, data.length);
  }
  /* Get names and such */
  const csvHeader = getCsvHeader(deviceIdList);
  /* Iterate over each row  */
  for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
    for (let deviceIdx = 0; deviceIdx < dataList.length; deviceIdx++) {
      /* Number of cols in the event, even if index is out of range */
      const numEventCols = dataList[deviceIdx][0].toPoint().length;
      /* Convert the time event to a point */
      const event = dataList[deviceIdx][rowIdx];
      /* Append each value to the string */
      for (let i = 0; i < numEventCols; i++) {
        /* Ensure the event exists */
        if (event) {
          const point = event.toPoint()[i];
          /* If the time col, create relative time stamp */
          if (i === 0) {
            /* Time since start in seconds */
            const deltaTime = (point - startTimes[deviceIdx]) / 1000;
            csvString += deltaTime.toFixed(3);
          } else {
            /* Add the data point */
            csvString += point.toFixed(5);
          }
        }
        /* Delimit Col even if empty */
        csvString += colDelimiter;
      }
    }
    /* Replace trailing column delimiter with row delimiter */
    csvString = csvString.slice(0, -1);
    csvString += rowDelimiter;
  }
  /* Return the full string */
  return csvHeader + csvString;
}
/* Returns the CSV header for a device */
function getCsvHeader(deviceIdList: idType[]): string {
  let csvHeader = '';
  const colDelimiter = ',';
  const rowDelimiter = '\n';
  const { devices } = store.getState();
  /* Iterate over each device */
  for (let i = 0; i < deviceIdList.length; i++) {
    const deviceId = deviceIdList[i];
    const { name: deviceName, settings } = devices[deviceId];
    const { sensors } = settings;
    const activeSensorIds = getActiveSensorList(sensors);
    /* Zeroth channel of each device is always time */
    csvHeader += `${deviceName} Time (s)${colDelimiter}`;
    /* Iterate over the active sensors */
    for (let j = 0; j < activeSensorIds.length; j++) {
      const sensorId = activeSensorIds[j];
      const sensor = sensors[sensorId];
      console.log('getCsvHeader', sensor);
      const { name: sensorName, channels, units } = sensor;
      const activeChannelNames = channelsToActiveNameList(channels);
      /* Iterate over the active channels */
      for (let k = 0; k < activeChannelNames.length; k++) {
        const channelName = activeChannelNames[k];
        csvHeader += `${deviceName} ${sensorName} ${channelName} (${units})${colDelimiter}`;
      }
    }
  }
  /* Replace trailing column delimiter with row delimiter */
  csvHeader = csvHeader.slice(0, -1);
  csvHeader += rowDelimiter;
  return csvHeader;
}

/* [] - END OF FILE */
