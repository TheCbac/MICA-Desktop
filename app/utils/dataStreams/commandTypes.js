/* @flow */
/* **********************************************************
* File: utils/dataStreams/commandType.js
*
* Brief: Types for serial commands
*
* Authors: Craig Cheney
*
* 2017.11.14 CC - Document created
*
********************************************************* */
import type { micaPacketT, packetDataT, responsePacketT } from './packets';
import type { terminalParsedObjT, } from '../../types/developerTypes';

export type subCommandFuncT = {
  binary: number[],
  packetObj: micaPacketT,
  output: string
};

export type subCommandT = {
  generatePacketObj: (terminalParsedObjT) => subCommandFuncT,
  callback: (responsePacketT, terminalParsedObjT, micaPacketT, packetDataT) => void
};

export type subCommandObjT = {
  [commandName: string]: subCommandT
};


/* [] - END OF FILE */
