// @flow
/* eslint no-plusplus: "off" */
/* **********************************************************
* File: utils/mica/metaDataParsers.js
*
* Brief: Functions for parsing metadata in a MICA format
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Refactored types
* 2017.08.29 CC - Document Created
*
* @TODO: unit tests, and error checking on the data
********************************************************* */
import log from '../loggingUtils';
import { bufferToFloat } from '../deviceUtils';
import {
  moduleToName,
  micaCharUuids
} from './micaConstants';
import type {
  energyObjs,
  actuationObjs,
  powerObjs,
  sensingObjs,
  commObjs,
  controlObjs,
  metaDataObjType,
} from '../../types/metaDataTypes';

const ID_NONE = 0;

/* Wrapper function for determining which data to parse. Hopefully this
 * this can be consolidated at some point */
export default function parseMetaData(
  charId: string, data: Buffer
): metaDataObjType {
// ): {metadata: ?metaDataObjType, moduleName: ?moduleNameType} {
  /* Act according to the type */
  switch (charId) {
    case micaCharUuids.energyMetadata:
      return { energy: parseEnergyMetadata(data) };
      // return { metadata: parseEnergyMetadata(data), moduleName: 'energy' };
    case micaCharUuids.actuationMetadata:
      return { actuation: parseActuationMetadata(data) };

      // return { metadata: parseActuationMetadata(data), moduleName: 'actuation' };
    case micaCharUuids.powerMetadata:
      return { power: parsePowerMetadata(data) };

      // return { metadata: parsePowerMetadata(data), moduleName: 'power' };
    case micaCharUuids.sensorMetadata:
      return { sensing: parseSensingMetadata(data) };

      // return { metadata: parseSensingMetadata(data), moduleName: 'sensing' };
    case micaCharUuids.communicationMetadata:
      return { communication: parseCommMetadata(data) };

      // return { metadata: parseCommMetadata(data), moduleName: 'communication' };
    case micaCharUuids.controlMetadata:
      return { control: parseControlMetaData(data) };
      // return { metadata: parseControlMetaData(data), moduleName: 'control' };
    /* Unknown Char ID */
    default:
      log.warn('parseMetaData: unknown metadata CharacterID', charId);
      return { metadata: undefined, moduleName: undefined };
  }
}

/* Parses the metadata sent by the Energy module */
function parseEnergyMetadata(data: Buffer): energyObjs {
  const energyObj = {};
  let id;
  let nameLength;
  let name = '';
  let numCells;
  let nomVoltage;
  let energyFeatures;
  let i = 0;
  /* Iterate over each energy source in packet */
  while (i < data.length) {
    /* Get the ID of the energy source */
    id = data[i++];
    /* Only collect parameters if available */
    if (id === ID_NONE) { return {}; }
    /* Get the length of the name */
    nameLength = data[i++];
    /* Construct the source name according to length */
    for (let k = 0; k < nameLength; k++) {
      name += String.fromCharCode(data[i++]);
    }
    /* Get the battery meta information */
    numCells = data[i++];
    /* Encoded in units of 100 mV, convert to volts (10 [100mv / 1v] ) */
    nomVoltage = data[i++] / 10;
    energyFeatures = data[i++];
    /* Store the energy source */
    energyObj[id] = {
      type: moduleToName('energy', id),
      name,
      numCells,
      nomVoltage,
      energyFeatures
    };
  }
  return energyObj;
}


/* Parse the data reported by the Actuation meta data */
function parseActuationMetadata(data: Buffer): actuationObjs {
  const actuationObj = {};
  const channelNameLength = [];
  const channelNames = [];
  let id;
  let numChannels = 0;
  let i = 0;
  /* Iterate over each energy source in packet */
  while (i < data.length) {
    /* Get the ID of the energy source */
    id = data[i++];
    /* Only collect parameters if available */
    if (id === ID_NONE) { return {}; }
    /* Get the number of channels */
    numChannels = data[i++];
    /* Get the length of the name of each channel */
    for (let j = 0; j < numChannels; j++) {
      channelNameLength.push(data[i++]);
    }
    /* Populate the sensor name list */
    for (let chIndex = 0; chIndex < numChannels; chIndex++) {
      let chanName = '';
      /* Construct the channel name according to length */
      for (let k = 0; k < channelNameLength[chIndex]; k++) {
        chanName += String.fromCharCode(data[i++]);
      }
      channelNames.push(chanName);
    }
    /* Store the Actuators */
    actuationObj[id] = {
      type: moduleToName('actuation', id),
      numChannels,
      channelNames
    };
  }
  return actuationObj;
}

/* Parse the power metadata options */
function parsePowerMetadata(data: Buffer): powerObjs {
  const powerObj = {};
  let id;
  let nameLength;
  let name = '';
  let nomVoltage;
  let i = 0;
  /* Iterate over each energy source in packet */
  while (i < data.length) {
    /* Get the ID of the energy source */
    id = data[i++];
    /* Only collect parameters if available */
    if (id === ID_NONE) { return {}; }
    /* Get the length of the name */
    nameLength = data[i++];
    /* Construct the source name according to length */
    for (let k = 0; k < nameLength; k++) {
      name += String.fromCharCode(data[i++]);
    }
    /* Encoded in units of 100 mV, convert to volts */
    nomVoltage = data[i++] / 10;
    /* Store the Actuators */
    powerObj[id] = {
      id,
      type: moduleToName('power', id),
      name,
      nomVoltage
    };
  }

  return powerObj;
}

/* sensing metadata  */
function parseSensingMetadata(data: Buffer): sensingObjs {
  const sensorsObj = {};
  let channelNames = [];
  let channelNameLength = [];
  let id;
  let numChannels = 0;
  let chanName = '';
  let scalingConstant;
  let gain;
  let units = '';
  let i = 0;
  /* Iterate over each energy source in packet */
  while (i < data.length) {
    /* Get the ID of the energy source */
    id = data[i++];
    /* Only collect parameters if available */
    if (id === ID_NONE) { return {}; }
    /* Get the number of channels */
    numChannels = data[i++];
    /* Reset the name length */
    channelNames = [];
    channelNameLength = [];
    /* Get the length of the name of each channel */
    for (let j = 0; j < numChannels; j++) {
      channelNameLength.push(data[i++]);
    }
    /* Populate the sensor name list */
    for (let chIndex = 0; chIndex < numChannels; chIndex++) {
      chanName = '';
      /* Construct the channel name according to length */
      for (let k = 0; k < channelNameLength[chIndex]; k++) {
        chanName += String.fromCharCode(data[i++]);
      }
      channelNames.push(chanName);
    }
    /* Get the scaling constant (float, 4 bytes) */
    scalingConstant = bufferToFloat(data.slice(i, i + 4));
    i += 4;
    /* Get the gain (float, 4 bytes) */
    gain = bufferToFloat(data.slice(i, i + 4));
    i += 4;
    /* Length of the units */
    const unitNameLen = data[i++];
    /* Reset the Units name */
    units = '';
    /* Populate the units name */
    for (let l = 0; l < unitNameLen; l++) {
      units += String.fromCharCode(data[i++]);
    }
    /* Store the Actuators */
    sensorsObj[id] = {
      type: moduleToName('sensing', id),
      numChannels,
      channelNames,
      scalingConstant,
      gain,
      units,
      offset: 0
    };
  }
  return sensorsObj;
}

/* Parse the comm metadata options */
function parseCommMetadata(data: Buffer): commObjs {
  const commObj = {};
  let id;
  let numDevices = 0;
  let nameLengthArray = [];
  let deviceNames = [];
  let name = '';
  let i = 0;
  /* Iterate over each energy source in packet */
  while (i < data.length) {
    /* Get the ID of the energy source */
    id = data[i++];
    /* Only collect parameters if available */
    if (id === ID_NONE) { return {}; }
    /* Get the number of peripherals attached ot the comm device */
    numDevices = data[i++];
    /* Check the number of devices */
    if (numDevices !== 0) {
      /* Reset and fill the name length array */
      nameLengthArray = [];
      for (let j = 0; j < numDevices; j++) {
        /* Get the length of the Comm device name */
        nameLengthArray.push(data[i++]);
      }
      /* Get the names */
      deviceNames = [];
      for (let nameIdx = 0; nameIdx < numDevices; nameIdx++) {
        name = '';
        /* Construct the source name according to length */
        for (let k = 0; k < nameLengthArray[nameIdx]; k++) {
          name += String.fromCharCode(data[i++]);
        }
        deviceNames.push(name);
      }
    }
    /* Store the Actuators */
    commObj[id] = {
      type: moduleToName('communication', id),
      numDevices,
      deviceNames
    };
  }
  return commObj;
}

/* Parse the Control metadata options */
function parseControlMetaData(data: Buffer): controlObjs {
  const controlObj = {};
  let id;
  let numDevices = 0;
  let nameLengthArray = [];
  let deviceNames = [];
  let name = '';
  let i = 0;
  /* Iterate over each energy source in packet */
  while (i < data.length) {
    /* Get the ID of the energy source */
    id = data[i++];
    /* Only collect parameters if available */
    if (id === ID_NONE) { return {}; }
    /* Get the number of peripherals attached ot the comm device */
    numDevices = data[i++];
    /* Check the number of devices */
    if (numDevices !== 0) {
      /* Reset and fill the name length array */
      nameLengthArray = [];
      for (let j = 0; j < numDevices; j++) {
        /* Get the length of the Comm device name */
        nameLengthArray.push(data[i++]);
      }
      /* Get the names */
      deviceNames = [];
      for (let nameIdx = 0; nameIdx < numDevices; nameIdx++) {
        name = '';
        /* Construct the source name according to length */
        for (let k = 0; k < nameLengthArray[nameIdx]; k++) {
          name += String.fromCharCode(data[i++]);
        }
        deviceNames.push(name);
      }
    }
    /* Store the Actuators */
    controlObj[id] = {
      type: moduleToName('control', id),
      numDevices,
      deviceNames
    };
  }
  return controlObj;
}
/* [] - END OF FILE */
