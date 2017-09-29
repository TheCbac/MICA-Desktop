// @flow
/* **********************************************************
* File: tests/factories/factories.js
*
* Brief: Factory definitions for tests.

* Author: Craig Cheney
*
* 2017.09.23 CC - Moved action creators to actionFactories.js
* 2017.09.22 CC - Document Created
*
********************************************************* */
import faker from 'faker';
import { moduleNames } from '../../app/utils/mica/micaConstants';
import type { idType } from '../../app/types/paramTypes';
import type {
  moduleNameType,
} from '../../app/types/metaDataTypes';
import type { devicesStateType } from '../../app/types/stateTypes';

/* Factory for creating an device id */
export function deviceIdFactory(): idType {
  /* Return a 128 bit uuid with no dashes */
  return faker.random.uuid().replace(/-/g, '');
}
/* Returns the ID of a sensor */
export function sensingIdFactory(): idType {
  return faker.random.arrayElement(['1', '2']);
}

/* Returns the name of one of the six modules */
export function moduleNameFactory(): moduleNameType {
  return faker.random.arrayElement(moduleNames);
}

// TODO: Implement
// export function deviceStateFactory(
//   devId?: idType,
//   sensId?: idType
// ): devicesStateType {
//  const deviceId = devId || deviceIdFactory();
//  const sensingId = sensId || sensingIdFactory();


// }

/* [] - END OF FILE */
