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

/* [] - 'END' OF FILE */
