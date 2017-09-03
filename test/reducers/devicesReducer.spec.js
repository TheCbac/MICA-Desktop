// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }]*/
/* eslint max-len: 0 */
/* **********************************************************
* File: test/reducers/devicesReducer.spec.js
*
* Brief: testing deviceReducer.js
*
* Author: George Whitfield
* Date: 2017.07.25
*
**********************************************************/
import reducer from '../../app/reducers/devicesReducer';
import { FOUND_ADVERTISING_DEVICE } from '../../app/actions/devicesActions';
import type { devicesStateType } from '../../app/types/stateTypes';
import type { noblePeripheralType } from '../../app/types/paramTypes';
import type { foundDeviceActionType } from '../../app/types/actionTypes';

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

/* Default noblePeripehral */
const dummyBle: noblePeripheralType = {
  address: 'CBAC123456',
  addressType: 'public',
  advertisement: {
    localName: 'IMU1',
    serviceData: [],
    serviceUuids: [],
  },
  connectable: true,
  id: '1234567890',
  rssi: -56,
  services: [],
  uuid: '1234567890'
};

/* Test Suite */
describe('devicesReducer.spec.js', () => {
  describe('FOUND_ADVERTISING_DEVICE', () => {
    it('Should add in a new device to an empty list', () => {
      /* Create the action */
      const action: foundDeviceActionType = {
        type: FOUND_ADVERTISING_DEVICE,
        payload: {
          peripheral: dummyBle
        }
      };
      /* Call the reducer */
      const newState = reducer(defaultState, action);
      expect(defaultState.advertising.length).toEqual(0);
      //$flowFixMe
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

