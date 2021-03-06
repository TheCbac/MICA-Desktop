// @flow
/* eslint quote-props: "off" */
/* **********************************************************
* File: utils/mica/micaConstants.js
*
* Brief: Contains the constants for MICA
*
* Author: Craig Cheney
*
* 2017.09.07 CC - Add Name to ID function
* 2017.08.29 CC - Added ID to Name functions
*               - Changed name to 'micaConstants' from 'micaUuids'
* 2017.06.26 CC - Document created
*
********************************************************* */
import type {
  serviceUuidType,
  charUuidObjType,
  bleIdObjType,
  constantType,
  moduleNameType
} from '../../types/constantTypes';

export const micaServiceUuid: serviceUuidType = 'cbac5416e0024988ab38aee966a7218f';

export const micaCharUuids: charUuidObjType = {
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

/* MICA Characteristic Handles. Defined from IMU creator project (CyBle_custom.) */
export const micaCharHandles = {
  'cbac0bf6341e3a0705183cdac0f21000': (0x1B),
  'cbac90446ee6405a90e66a12315bca84': (0x1E),
  'cbacd02a74bf45c7b1bb994527009bc0': (0x22),
  'cbac8a297be1448693ff0af3024f4cb8': (0x25),
  'cbac72b80b594e78aaff3a4c13961f5f': (0x29),
  'cbacf750391348179b2ba9034e354575': (0x2C),
  'cbac66cc91cc45f292c0a51bc9174b63': (0x30),
  'cbac45aee7854102bc22ec68961b4aad': (0x33),
  'cbac4e78c2da49008b93f4aef1ca246a': (0x37),
  'cbace2dcca234801a5513a3ce9eb7a6a': (0x3A),
  'cbac64fd37f84f788e4b86689b59dbc3': (0x3E),
  'cbac07a4b054467db95f773fa6bbb796': (0x41),
}
/* Get the Character handle from a uuid */
export function getMicaHandleFromUuid(uuid: string): number {
  if(uuid in micaCharHandles){
    return micaCharHandles[uuid];
  }
  return (0x00);
}

export const moduleNames = ['energy', 'actuation', 'power', 'sensing', 'communication', 'control'];


export const micaIDs: bleIdObjType = {
  actuation: {
    '1': 'Signal Voltage',
    '2': 'Signal Current',
    '3': 'Power Voltage',
    '4': 'Power Current',
    '5': 'Drivebot'
  },
  energy: {
    '1': 'LiPo',
    '2': 'LiFePO',
    '3': 'Alkaline'
  },
  power: {
    '1': 'Linear Regulator',
    '2': 'Buck Converter',
    '3': 'Boost Converter',
    '4': 'Buck Boost'
  },
  sensing: {
    '1': 'Accelerometer',
    '2': 'Gyroscope',
    '3': 'Magnetometer',
    '4': 'ADC',
    '5': 'Output Current',
    '6': 'Load Cell'
  },
  communication: {
    '1': 'Internal I2C',
    '2': 'Internal UART',
    '3': 'Internal SPI',
    '4': 'External I2C',
    '5': 'External UART',
    '6': 'External SPI'
  },
  control: {
    '1': 'LEDs',
    '2': 'Digital Port',
    '3': 'Analog Port',
    '4': 'Bootloader'
  }
};
/* Frequency in Hz of the data clock inside the MICA cubes */
export const DATA_CLOCK_FREQ: constantType = 100000;
export const CMD_STOP: constantType = 0x00;
export const CMD_START: constantType = 0x01;
/* Command to set the name */
export const CMD_SET_NAME: constantType = 0x05;

/* Wrapper function for mapping IDs to names  */
export function moduleToName(module: moduleNameType, id: number): string {
  /* No need to search for None */
  if (id === 0) { return 'None'; }
  /* Get the module */
  const moduleObj = micaIDs[module];
  /* Ensure it exists */
  if (!moduleObj) { return 'Unknown'; }
  /* Return the name if it exists */
  return moduleObj[id.toString()] || 'Unknown';
}

/* Get the ID number from the name of a device - not case sensitive */
export function nameToId(name: string): {id: ?number, module: ?moduleNameType} {
  /* Get the names of the modules */
  const moduleNames = Object.keys(micaIDs);
  /* Iterate over the module names */
  for (let i = 0; i < moduleNames.length; i += 1) {
    const moduleName = moduleNames[i];
    const module = micaIDs[moduleName];
    /* Get the IDs of the devices  */
    const deviceIds = Object.keys(module);
    /* Find the name in question */
    for (let j = 0; j < deviceIds.length; j += 1) {
      const deviceId = deviceIds[j];
      const deviceName = module[deviceId];
      /* Compare against desired value */
      if (deviceName.toLowerCase() === name.toLowerCase()) {
        return {
          id: parseInt(deviceId, 10),
          module: moduleName
        };
      }
    }
  }
  /* Item was not found */
  return {
    id: undefined,
    module: undefined
  };
}


/* [] - END OF FILE */
