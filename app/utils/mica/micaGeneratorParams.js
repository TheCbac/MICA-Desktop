// @flow
/* eslint quote-props: ["error", "as-needed", { "numbers": true }] */
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
import type { deviceChannelType, deviceParamObj } from '../../types/paramTypes';

/* Object to containing the generator parameters */
const generatorParams: deviceParamObj = {};

/* Drivebot */
const driveBotId = nameToId('Drivebot').id;
if (driveBotId) {
  /* Channels of drive bot... not clear how to use this */
  const drivebotChannels: deviceChannelType = {
    display: 'Motors',
    default: {
      '0': { active: true, name: 'Left Motor', offset: 0 },
      '1': { active: true, name: 'Right Motor', offset: 0 }
    },
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
