// @flow
/* eslint no-plusplus: "off" */
/* **********************************************************
* File: utils/mica/metaDataParsers.js
*
* Brief: Functions for parsing metadata in a MICA format
*
* Author: Craig Cheney
* Date: 2017.08.29
*
* @TODO: unit tests, and error checking on the data
**********************************************************/
import log from '../loggingUtils';
import { bufferToFloat } from '../deviceUtils';
import {
  moduleToName,
  micaCharUuids
} from './micaConstants';
import type {
  energyMetaObj,
  actuationMetaObj,
  powerMetaObj,
  sensingMetaObj,
  commMetaObj,
  controlMetaObj,
  metaDataType
} from '../../types/metaDataTypes';

const ID_NONE = 0;

/* Wrapper function for determining which data to parse. Hopefully this
 * this can be consolidated at some point */
export default function parseMetaData(charId: string, data: Buffer): ?metaDataType {
  /* Act according to the type */
  switch (charId) {
    case micaCharUuids.energyMetadata:
      return parseEnergyMetadata(data);
    case micaCharUuids.actuationMetadata:
      return parseActuationMetadata(data);
    case micaCharUuids.powerMetadata:
      return parsePowerMetadata(data);
    case micaCharUuids.sensorMetadata:
      return parseSensingMetadata(data);
    case micaCharUuids.communicationMetadata:
      return parseCommMetadata(data);
    case micaCharUuids.controlMetadata:
      return parseControlMetaData(data);
    /* Unknown Char ID */
    default:
      log.warn('parseMetaData: unknown metadata CharacterID', charId);
      return undefined;
  }
}

/* Parses the metadata sent by the Energy module */
function parseEnergyMetadata(data: Buffer): energyMetaObj[] {
  const batteryArray = [];
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
    if (id !== ID_NONE) {
      /* Get the length of the name */
      nameLength = data[i++];
      /* Construct the source name according to length */
      for (let k = 0; k < nameLength; k++) {
        name += String.fromCharCode(data[i++]);
      }
      /* Get the battery meta information */
      numCells = data[i++];
      /* Encoded in units of 100 mV, convert to volts */
      nomVoltage = data[i++] / 10;
      energyFeatures = data[i++];
    }
    /* Store the energy source */
    batteryArray.push({
      module: 'energy',
      id,
      type: moduleToName('energy', id),
      name,
      numCells,
      nomVoltage,
      energyFeatures
    });
  }
  return batteryArray;
}


/* Parse the data reported by the Actuation meta data */
function parseActuationMetadata(data: Buffer): actuationMetaObj[] {
  const actuationArray = [];
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
    if (id !== ID_NONE) {
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
    }
    /* Store the Actuators */
    actuationArray.push({
      module: 'actuation',
      id,
      type: moduleToName('actuation', id),
      numChannels,
      channelNames
    });
  }
  return actuationArray;
}

/* Parse the power metadata options */
function parsePowerMetadata(data: Buffer): powerMetaObj[] {
  const powerArray = [];
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
    if (id !== ID_NONE) {
      /* Get the length of the name */
      nameLength = data[i++];
      /* Construct the source name according to length */
      for (let k = 0; k < nameLength; k++) {
        name += String.fromCharCode(data[i++]);
      }
      /* Encoded in units of 100 mV, convert to volts */
      nomVoltage = data[i++] / 10;
    }
    /* Store the Actuators */
    powerArray.push({
      module: 'power',
      id,
      type: moduleToName('power', id),
      name,
      nomVoltage
    });
  }

  return powerArray;
}

/* sensing metadata  */
function parseSensingMetadata(data: Buffer): sensingMetaObj[] {
  const sensorsArray = [];
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
    if (id !== ID_NONE) {
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
    }
    /* Store the Actuators */
    sensorsArray.push({
      module: 'sensing',
      id,
      type: moduleToName('sensing', id),
      numChannels,
      channelNames,
      scalingConstant,
      gain,
      units,
      offset: 0
    });
  }
  return sensorsArray;
}

/* Parse the comm metadata options */
function parseCommMetadata(data: Buffer): commMetaObj[] {
  const commArray = [];
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
    if (id !== ID_NONE) {
      /* Get the number of peripherals attached ot the comm device */
      numDevices = data[i++];
      /* Check the number of devices */
      if (numDevices !== 0) {
        /* Reset and fill the name length array */
        nameLengthArray = [];
        for (let j = 0; j < numDevices; j++) {
          /* Get the length of the Comm device name*/
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
    }
    /* Store the Actuators */
    commArray.push({
      module: 'communication',
      id,
      type: moduleToName('communication', id),
      numDevices,
      deviceNames
    });
  }
  return commArray;
}

/* Parse the Control metadata options */
function parseControlMetaData(data: Buffer): controlMetaObj[] {
  const controlArray = [];
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
    if (id !== ID_NONE) {
      /* Get the number of peripherals attached ot the comm device */
      numDevices = data[i++];
      /* Check the number of devices */
      if (numDevices !== 0) {
        /* Reset and fill the name length array */
        nameLengthArray = [];
        for (let j = 0; j < numDevices; j++) {
          /* Get the length of the Comm device name*/
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
    }
    /* Store the Actuators */
    controlArray.push({
      module: 'control',
      id,
      type: moduleToName('control', id),
      numDevices,
      deviceNames
    });
  }
  return controlArray;
}
/* [] - END OF FILE */
