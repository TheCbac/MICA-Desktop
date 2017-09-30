// @flow
/* **********************************************************
* File: tests/factories/metadataFactories.js
*
* Brief: Factory definitions for metadata object.

* Author: Craig Cheney
*
* 2017.09.23 CC - Document Created
*
********************************************************* */
import faker from 'faker';
import { micaIDs } from '../../app/utils/mica/micaConstants';
import { moduleNameFactory } from './factories';
import type {
  moduleNameType,
  metaDataObjType,
  energyMetaObj,
  actuationMetaObj,
  powerMetaObj,
  sensingMetaObj,
  commMetaObj,
  controlMetaObj
} from '../../app/types/metaDataTypes';

/* Return an energy metadata object */
export function energyMetaObjFactory(): {id: number, metaObj:energyMetaObj} {
  /* could just use the length, this seems more dynamic */
  const energyModule = micaIDs.energy;
  const id = parseInt(faker.random.arrayElement(Object.keys(energyModule)), 10);
  /* Return object */
  const metaObj = {
    type: energyModule.id,
    name: faker.hacker.adjective(),
    numCells: faker.random.number(),
    nomVoltage: faker.random.number(),
    energyFeatures: undefined
  };
  return { id, metaObj };
}

/* Return an actuation metadata object */
export function actuationMetaObjFactory(): {id: number, metaObj:actuationMetaObj} {
  /* Select one of the elements */
  const actuationModule = micaIDs.actuation;
  const id = parseInt(faker.random.arrayElement(Object.keys(actuationModule)), 10);
  /* Return object */
  const metaObj = {
    type: actuationModule.id,
    numChannels: faker.random.number(),
    channelNames: [faker.random.arrayElement(['X', 'Y', 'Z'])]
  };
  return { id, metaObj };
}

/* Return an actuation metadata object */
export function powerMetaObjFactory(): {id: number, metaObj:powerMetaObj} {
  /* could just use the length, this seems more dynamic */
  const powerModule = micaIDs.power;
  const id = parseInt(faker.random.arrayElement(Object.keys(powerModule)), 10);
  /* Return object */
  const metaObj = {
    type: powerModule.id,
    name: faker.hacker.adjective(),
    nomVoltage: faker.random.number(),
  };
  return { id, metaObj };
}

/* Return an actuation metadata object */
export function sensingMetaObjFactory(): {id: number, metaObj:sensingMetaObj} {
  /* could just use the length, this seems more dynamic */
  const sensingModule = micaIDs.sensing;
  const id = parseInt(faker.random.arrayElement(Object.keys(sensingModule)), 10);
  /* Return object */
  const metaObj = {
    type: sensingModule.id,
    numChannels: 3,
    channelNames: ['X', 'Y', 'Z'],
    scalingConstant: Math.random(),
    gain: faker.random.number(),
    units: faker.hacker.noun(),
    offset: faker.random.number()
  };
  return { id, metaObj };
}

/* Return an actuation metadata object */
export function communicationMetaObjFactory(): {id: number, metaObj:commMetaObj} {
  /* could just use the length, this seems more dynamic */
  const communicationModule = micaIDs.communication;
  const id = parseInt(faker.random.arrayElement(Object.keys(communicationModule)), 10);
  /* Return object */
  const metaObj = {
    type: communicationModule.id,
    numDevices: faker.random.number(),
    deviceNames: [faker.hacker.noun()]
  };
  return { id, metaObj };
}

/* Return an actuation metadata object */
export function controlMetaObjFactory(): {id: number, metaObj:controlMetaObj} {
  /* could just use the length, this seems more dynamic */
  const controlModule = micaIDs.control;
  const id = parseInt(faker.random.arrayElement(Object.keys(controlModule)), 10);
  /* Return object */
  const metaObj = {
    type: controlModule.id,
    channelNames: [faker.random.arrayElement(['X', 'Y', 'Z'])]
  };
  return { id, metaObj };
}

/* Create a dummy metadata object */
export function metadataObjFactory(name?: moduleNameType): metaDataObjType {
  const module = name || moduleNameFactory();
  let factory;
  /* Chose a factory */
  switch (module) {
    case 'energy':
      factory = energyMetaObjFactory;
      break;
    case 'actuation':
      factory = actuationMetaObjFactory;
      break;
    case 'power':
      factory = powerMetaObjFactory;
      break;
    case 'sensing':
      factory = sensingMetaObjFactory;
      break;
    case 'communication':
      factory = communicationMetaObjFactory;
      break;
    case 'control':
      factory = controlMetaObjFactory;
      break;
    default:
      factory = sensingMetaObjFactory;
      break;
  }
  const { id, metaObj } = factory();
  return {
    [module]: {
      [id]: metaObj
    }
  };
}

/* [] - END OF FILE */
