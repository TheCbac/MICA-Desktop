// @flow
/* **********************************************************
* File: types/constantTypes.js
*
* Brief: Types for constants
*
* Author: Craig Cheney
*
* 2017.09.22 CC - Document created
*
********************************************************* */

/* BLE Service UUID */
export type serviceUuidType = string;
/* BLE characteristic UUID */
export type characteristicUuidType = string;
/* BLE characteristic UUID object */
export type charUuidObjType = {
  [charName: string]: string
};

/* Instruments contained in one of the 6 BLE modules */
export type instrumentNameType = string;
/* Name of the 6 BLE modules */
export type moduleNameType = 'energy' | 'actuation' | 'power' |
  'sensing' | 'communication' | 'control';
/* BLE Modules */
export type moduleObjType = {
  [instrumentId: string]: instrumentNameType
};
/* Top level ID object */
export type bleIdObjType = {
  [moduleName: moduleNameType]: moduleObjType
};

/* A numeric constant */
export type constantType = number;

/* [] - END OF FILE */
