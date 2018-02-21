/* @flow */
/* **********************************************************
* File: components/CollectData/GraphStyle.js
*
* Brief: Styles for graphing
*
* Authors: Craig Cheney
*
* 2018.02.20 CC - Document created
*
********************************************************* */
export type styleT = {
  key: string,
  color: string,
  width: number
};
export type categoryT = {
  key: string,
  label: string
};

/* Mappings */
export const channelColors = {
  accelerometer: {
    x: '#e41a1c',
    y: '#377eb8',
    z: '#4daf4a'
  },
  gyroscope: {
    x: '#984ea3',
    y: '#ff7f00',
    z: '#ffff33'
  },
  other: {
    '0': '#a65628',
    '1': '#f781bf',
    '2': '#999999'
  }
};

/* Colors stay constant based on the axis */
export function getChannelColor(
  sensorName: string,
  channelName: string,
  channelIndex: number
): string {
  /* See if the sensor exists */
  const sensor = channelColors[sensorName.toLowerCase()];
  if (sensor) {
    const color = sensor[channelName.toLowerCase()];
    if (color) {
      return color;
    }
  }
  /* Color not found, return random color */
  const { other } = channelColors;
  return other[channelIndex % Object.keys(other).length];
}

/* Construct the styler */
export function constructStyles(
  sensorName: string,
  channelName: string,
  channelCount: number
): { style: styleT, category: categoryT } {
  return {
    style: {
      key: channelName,
      color: getChannelColor(sensorName, channelName, channelCount),
      width: 2
    },
    category: { key: channelName, label: channelName }
  };
}

/* [] - END OF FILE */
