/* @flow */
/* **********************************************************
* File: types/graphBufferTypes.js
*
* Brief: Typedef for the stored graph data
*
* Authors: Craig Cheney
*
* 2017.10.01 CC - Document created
*
********************************************************* */
import { TimeEvent } from 'pondjs';
import type { idType } from './paramTypes';

/* Multi device Objects */
export type dataArrayT = TimeEvent[];
export type startTimeT = number;
export type lastTimeT = number;
export type dataIndexT = number;
/* Data type for a single device */
export type deviceObjT = {
  data: dataArrayT,
  dataIndex: dataIndexT,
  startTime: startTimeT,
  lastTime: lastTimeT
};
export type multiDeviceDataObjT = {
  [deviceId: idType]: deviceObjT
};
/* [] - END OF FILE */
