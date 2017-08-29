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
import {
  moduleToName,
  micaCharUuids
} from './micaConstants';
import type {
  energyMetaObj,
  actuationMetaObj,
  powerMetaObj,
  sensingMetaObj,
  commMetaType,
  controlMetaType,
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

/* [] - END OF FILE */
