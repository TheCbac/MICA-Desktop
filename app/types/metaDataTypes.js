// @flow
/* **********************************************************
* File: types/metaDataTypes.js
*
* Brief: Contains the type definitions for objects returned
*   by the metadata fields
*
* Author: Craig Cheney
*
* 2017.09.22 CC - Refactored for state v2
* 2017.09.07 CC - Refactored to move 'module' out of types
* 2017.08.29 CC - Document created
*
********************************************************* */
// /* Energy Meta data type */
// export type energyMetaObj = {
//   id: number,
//   type: string,
//   name: ?string,
//   numCells: ?number,
//   nomVoltage: ?number,
//   energyFeatures: ?number
// };
// /* Actuation metadata type */
// export type actuationMetaObj = {
//   id: number,
//   type: string,
//   numChannels: number,
//   channelNames: ?string[]
// };
// /* Power metadata type */
// export type powerMetaObj = {
//   id: number,
//   type: string,
//   name: string,
//   nomVoltage: ?number
// };
// /* Sensing metadata type */
// export type sensingMetaObj = {
//   id: number,
//   type: string,
//   numChannels: number,
//   channelNames: ?string[],
//   scalingConstant: number,
//   gain: number,
//   units: string,
//   offset: number
// };
// /* Communication Metadata type */
// export type commMetaObj = {
//   id: number,
//   type: string,
//   numDevices: number,
//   deviceNames: ?string[]
// };
// /* Control Metadata type */
// export type controlMetaObj = {
//   id: number,
//   type: string,
//   channelNames: ?string[]
// };
// /* All of the metadata types for wrapper functions. Hopefully this can
//  * can be consolidated at some point */
// export type metaDataObjType =
//   energyMetaObj[] |
//   actuationMetaObj[] |
//   powerMetaObj[] |
//   sensingMetaObj[] |
//   commMetaObj[] |
//   controlMetaObj[];
// /* Overarching metadata type */
// export type metaDataType = {
//   energy?: energyMetaObj[],
//   actuation?: actuationMetaObj[],
//   power?: powerMetaObj[],
//   sensing?: sensingMetaObj[],
//   communication?: commMetaObj[],
//   control?: controlMetaObj[]
// };

export type moduleNameType =
'energy' |
'actuation' |
'power' |
'sensing' |
'communication' |
'control';

/* Refactoring of the metadata types */
export type metaDataObjType = {
  energy?: energyObjs,
  actuation?: actuationObjs,
  power?: powerObjs,
  sensing?: sensingObjs,
  communication?: commObjs,
  control?: controlObjs
};

/* An object of metadata energy type */
export type energyObjs = {
  [energyId: number]: energyMetaObj
};
/* An object of metadata actuation type */
export type actuationObjs = {
  [actuationId: number]: actuationMetaObj
};
/* An object of metadata power type */
export type powerObjs = {
  [powerId: number]: powerMetaObj
};
/* An object of metadata sensing type */
export type sensingObjs = {
  [sensingId: number]: sensingMetaObj
};
/* An object of metadata comm type */
export type commObjs = {
  [commId: number]: commMetaObj
};
/* An object of metadata control type */
export type controlObjs = {
  [controlId: number]: controlMetaObj
};

export type energyMetaObj = {
  type: ?string | number,
  name: ?string,
  numCells: ?number | string,
  nomVoltage: ?string | number,
  energyFeatures: ?number | string
};
/* Actuation metadata type */
export type actuationMetaObj = {
  type: string,
  numChannels: number,
  channelNames: ?string[]
};
/* Power metadata type */
export type powerMetaObj = {
  type: string,
  name: string,
  nomVoltage: ?number
};
/* Sensing metadata type */
export type sensingMetaObj = {
  type: string,
  numChannels: number,
  channelNames: ?string[],
  scalingConstant: number,
  gain: number,
  units: string,
  offset: number[]
};
/* Communication Metadata type */
export type commMetaObj = {
  type: string,
  numDevices: number,
  deviceNames: ?string[]
};
/* Control Metadata type */
export type controlMetaObj = {
  type: string,
  channelNames: ?string[]
};
/* [] - END OF FILE */
