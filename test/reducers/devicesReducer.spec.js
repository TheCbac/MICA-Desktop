// @flow
/* **********************************************************
* File: test/reducers/devicesReducer.spec.js
*
* Brief: testing deviceReducer.js
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.09.03 CC - Updated for correct flow usage
* 2017.07.25 GW - Document created
*
**********************************************************/
import faker from 'faker';
import reducer from '../../app/reducers/devicesReducer';
import {
  FOUND_ADVERTISING_DEVICE,
  CLEAR_ADVERTISING_LIST
} from '../../app/actions/devicesActions';
import { micaServiceUuid } from '../../app/utils/mica/micaConstants';
import type { devicesStateType } from '../../app/types/stateTypes';
import type { noblePeripheralType } from '../../app/types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
} from '../../app/types/actionTypes';

/* Default state for the reducer */
const defaultState: devicesStateType = {
  advertising: [],
  connecting: [],
  connected: [],
  disconnecting: [],
  metadata: {},
  selected: {
    sensor: undefined,
    generator: undefined
  }
};

/* Create a noblePeripheralType from the specified action and payload  */
function nobleDeviceFactory(userSpecifiedParams: ?{}): noblePeripheralType {
  /* Create a default */
  const uuidVal = faker.random.uuid();
  let peripheral = {
    address: faker.internet.ipv6(),
    addressType: 'public',
    advertisement: {
      localName: faker.internet.userName(),
      serviceData: [],
      serviceUuids: [micaServiceUuid],
    },
    connectable: true,
    id: uuidVal,
    uuid: uuidVal,
    rssi: -1 * faker.random.number(),
    services: []
  };
  /* apply any user params */
  if (userSpecifiedParams != null) {
    peripheral = { ...peripheral, ...userSpecifiedParams };
  }
  return peripheral;
}

/* Test Suite */
describe('devicesReducer.spec.js', () => {
  describe('FOUND_ADVERTISING_DEVICE', () => {
    it('Should add in a new device to an empty list', () => {
      /* Create the action */
      const action: foundDeviceActionType = {
        type: FOUND_ADVERTISING_DEVICE,
        payload: {
          peripheral: nobleDeviceFactory()
        }
      };
      const action1: foundDeviceActionType = {
        type: FOUND_ADVERTISING_DEVICE,
        payload: {
          peripheral: nobleDeviceFactory()
        }
      };
      /* Call the reducer */
      const newState = reducer(defaultState, action);
      expect(defaultState.advertising.length).toEqual(0);
      // $FlowFixMe /* .advertising is not specified statically */
      expect(newState.advertising.length).toEqual(1);
      /* Add second device */
      const newState1 = reducer(newState, action1);
      // $FlowFixMe /* .advertising is not specified statically */
      expect(newState.advertising.length).toEqual(1);
      // $FlowFixMe /* .advertising is not specified statically */
      expect(newState1.advertising.length).toEqual(2);
    });
  });
  describe('CLEAR_ADVERTISING_DEVICE', () => {
    it('should clear the list of devices', () => {
      /* Create the actions */
      const addAction: foundDeviceActionType = {
        type: FOUND_ADVERTISING_DEVICE,
        payload: {
          peripheral: nobleDeviceFactory()
        }
      };
      const clearAction: clearAdvertisingActionType = { type: CLEAR_ADVERTISING_LIST };
      /* Call the reducer */
      const newState = reducer(defaultState, addAction);
      expect(defaultState.advertising.length).toEqual(0);
      // $FlowFixMe /* .advertising is not specified statically */
      expect(newState.advertising.length).toEqual(1);
      /* Clear the list */
      const newState1 = reducer(newState, clearAction);
      // $FlowFixMe /* .advertising is not specified statically */
      expect(newState1.advertising.length).toEqual(0);
      // $FlowFixMe /* .advertising is not specified statically */
      expect(newState.advertising.length).toEqual(1);
    });
  });
  /* Written by GW - needs refactoring for correctness */

  // describe('Testing deviceHandlers', () => {
  //   describe('Testing CLEAR_ADVERTISING_LIST', () => {
  //     it('Return the correct information', () => {
  //       const blankAdvertising = {
  //         advertising: []
  //       };
  //       expect(clearAdvertisingList).toEqual({
  //         connected: testDevicesStateType.connected,
  //         advertising: blankAdvertising.advertising
  //       });
  //     });
  //   });
  //   it('Does not throw an error', () => {
  //     expect(() => {
  //       deviceHandlers.CLEAR_ADVERTISING_LIST(testDevicesStateType, testDevicesActionType);
  //     }).not.toThrow();
  //   });
  //   describe('Testing FOUND_ADVERTISING_DEVICE', () => {
  //     it('Return the correct information', () => {
  //       const newAdvertisingValue = testDevicesStateType.advertising.concat(testFoundDevicesActionType.payload.peripheral);
  //       expect(foundAdvertisingDevice).toEqual({
  //         connected: testDevicesStateType.connected,
  //         advertising: newAdvertisingValue
  //       });
  //     });
  //     it('Does not throw an error', () => {
  //       expect(() => {
  //         deviceHandlers.FOUND_ADVERTISING_DEVICE(testDevicesStateType, testFoundDevicesActionType);
  //       }).not.toThrow();
  //     });
  //   });
  // });
  // it('Has a defaultState with values set to blank arrays', () => {
  //   expect(defaultState).toEqual({
  //     advertising: [],
  //     connected: []
  //   });
  // });
});

