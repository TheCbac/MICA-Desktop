// @flow
/* **********************************************************
* File: utils/mica/micaGeneratorParams.js
*
* Brief: Contains the definitions for the available sensor
* params
*
* Authors: Craig Cheney
*
* 2017.09.07 CC - Document created
*
********************************************************* */
import { nameToId } from './micaConstants';
import type { deviceParamType, deviceChannelType, deviceParamObj } from '../../types/paramTypes';

/* Object to containing the generator parameters */
const generatorParams: deviceParamObj = {};

/* Drivebot */
const driveBotId = nameToId('Drivebot').id;
if (driveBotId) {
  /* Channels of drive bot... not clear how to use this */
  const drivebotChannels: deviceChannelType = {
    display: 'Motors',
    default: [0, 1],
    options: ['Left Motor', 'Right Motor']
  };
  /* Construct Drivebot settings Obj */
  generatorParams[driveBotId] = {
    channels: drivebotChannels,
    dynamicParams: { }
  };
}
/* No Params object */

/* Export the parameters */
export { generatorParams as default };
/* [] - END OF FILE */
