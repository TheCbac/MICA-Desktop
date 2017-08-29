// @flow
/* **********************************************************
* File: utils/mica/micaConstants.js
*
* Brief: Contains the constants for MICA
*
* Author: Craig Cheney
* 2017.08.29 CC - Added ID to Name functions
*               - Changed name to 'micaConstants' from 'micaUuids'
* 2017.06.26 CC - Document created
*
**********************************************************/
import log from '../loggingUtils';

export const micaServiceUuid = 'cbac5416e0024988ab38aee966a7218f';

export const micaCharUuids = {
  energyMetadata: 'cbac0bf6341e3a0705183cdac0f21000',
  energyCommands: 'cbac90446ee6405a90e66a12315bca84',
  actuationMetadata: 'cbacd02a74bf45c7b1bb994527009bc0',
  actuationCommands: 'cbac8a297be1448693ff0af3024f4cb8',
  powerMetadata: 'cbac72b80b594e78aaff3a4c13961f5f',
  powerCommands: 'cbacf750391348179b2ba9034e354575',
  sensorMetadata: 'cbac66cc91cc45f292c0a51bc9174b63',
  sensorCommands: 'cbac45aee7854102bc22ec68961b4aad',
  communicationMetadata: 'cbac4e78c2da49008b93f4aef1ca246a',
  communicationCommands: 'cbace2dcca234801a5513a3ce9eb7a6a',
  controlMetadata: 'cbac64fd37f84f788e4b86689b59dbc3',
  controlCommands: 'cbac07a4b054467db95f773fa6bbb796'
};

type moduleName = 'energy' | 'actuation' | 'power' | 'sensing' | 'communication' | 'control';
/* Wrapper function for mapping IDs to names  */
export function moduleToName(module: moduleName, id: number): ?string {
  switch (module) {
    case 'energy':
      return batteryIdToName(id);
    case 'actuation':
      return actuatorIdToName(id);
    case 'power':
      return powerIdToName(id);
    default:
      log.warn('moduleToName: Unknown module name', module);
      return undefined;
  }
}

function powerIdToName(id: number): string {
  switch (id) {
    case 0x00:
      return 'None';
    case 0x01:
      return 'Linear Regulator';
    case 0x02:
      return 'Buck Converter';
    case 0x03:
      return 'Boost Converter';
    case 0x04:
      return 'Buck/Boost Converter';
    default:
      return 'Unknown';
  }
}
/* Return the battery name from the ID number */
function batteryIdToName(id: number): string {
  switch (id) {
    case 0x00:
      return 'None';
    case 0x01:
      return 'LiPo';
    case 0x02:
      return 'LiFePO';
    case 0x03:
      return 'Alkaline';
    default:
      return 'Unknown';
  }
}

/* Return the battery name from the ID number */
function actuatorIdToName(id: number): string {
  switch (id) {
    case 0x00:
      return 'None';
    case 0x01:
      return 'Signal Voltage';
    case 0x02:
      return 'Signal Current';
    case 0x03:
      return 'Power Voltage';
    case 0x04:
      return 'Power Current';
    default:
      return 'Unknown';
  }
}

/* [] - END OF FILE */
