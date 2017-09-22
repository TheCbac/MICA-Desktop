// @flow
/* **********************************************************
* File: tests/factories/factories.js
*
* Brief: Factory definitions for tests.

* Author: Craig Cheney
*
* 2017.09.22 CC - Document Created
*
********************************************************* */
import faker from 'faker';
import type { idType } from '../../app/types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType
} from '../../app/types/actionTypes';

/* Factory for creating an device id */
export function deviceIdFactory(): idType {
  /* Return a 128 bit uuid with no dashes */
  return faker.random.uuid().replace(/-/g, '');
}

/* Return an action creator for finding an advertising device */
export function foundDeviceActionFactory(deviceId?: idType): foundDeviceActionType {
  const id = deviceId || deviceIdFactory();
  return {
    type: 'FOUND_ADVERTISING_DEVICE',
    payload: {
      deviceId: id
    }
  };
}

/* Clear the advertising list action creator */
export function clearAdvertisingListFactory(): clearAdvertisingActionType {
  return {
    type: 'CLEAR_ADVERTISING_LIST',
    payload: {}
  };
}
/* [] - END OF FILE */


// /* Create a noblePeripheralType from the specified action and payload  */
// function nobleDeviceFactory(userSpecifiedParams: ?{}): noblePeripheralType {
//   /* Create a default */
//   const uuidVal = faker.random.uuid();
//   let peripheral = {
//     address: faker.internet.ipv6(),
//     addressType: 'public',
//     advertisement: {
//       localName: faker.internet.userName(),
//       serviceData: [],
//       serviceUuids: [micaServiceUuid],
//     },
//     connectable: true,
//     id: uuidVal,
//     uuid: uuidVal,
//     rssi: -1 * faker.random.number(),
//     services: []
//   };
//   /* apply any user params */
//   if (userSpecifiedParams != null) {
//     peripheral = { ...peripheral, ...userSpecifiedParams };
//   }
//   return peripheral;
// }
