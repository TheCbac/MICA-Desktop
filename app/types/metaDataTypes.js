// @flow
/* **********************************************************
* File: types/metaDataTypes.js
*
* Brief: Contains the type definitions for objects returned
*   by the metadata fields
*
* Author: Craig Cheney
* 2017.08.29 CC - Document created
*
**********************************************************/
/* Energy Meta data type */
export type energyMetaObj = {
  module: 'energy',
  id: number,
  type: string,
  name: ?string,
  numCells: ?number,
  nomVoltage: ?number,
  energyFeatures: ?number
};
/* Actuation metadata type */
export type actuationMetaObj = {
  module: 'actuation',
  id: number,
  type: string,
  numChannels: number,
  channelNames: ?string[]
};
/* Power metadata type */
export type powerMetaObj = {
  module: 'power',
  id: number,
  type: string,
  name: string,
  nomVoltage: ?number
};
/* Sensing metadata type */
export type sensingMetaObj = {
  module: 'sensing',
  id: number,
  type: string,
  numChannels: number,
  channelNames: ?string[],
  scalingConstant: ?number,
  gain: ?number,
  units: ?string,
  offset: ?number
};
/* Communication Metadata type */
export type commMetaType = {
  module: 'communications',
  id: number,
  type: string,
  numDevices: number,
  deviceNames: ?string[]
};
/* Control Metadata type */
export type controlMetaType = {
  module: 'control',
  id: number,
  type: string,
  channelNames: ?string[]
};
/* All of the metadata types for wrapper functions. Hopefully this can
 * can be consolidated at some point */
export type metaDataType =
  energyMetaObj[] |
  actuationMetaObj[] |
  powerMetaObj[] |
  sensingMetaObj[] |
  commMetaType[] |
  controlMetaType[];

/* [] - END OF FILE */
