// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }]*/
/* **********************************************************
* File: test/reducers/devicesReducer.spec.js
*
* Brief: testing deviceReducer.js
*
* Author: George Whitfield
* Date: 2017.07.25
*
**********************************************************/
import { deviceHandlers, defaultState } from '../../app/reducers/devicesReducer';
// import { createReducer } from '../../app/reducers/devicesReducer';

const testDevicesStateType = {
  advertising: [2, 3, 4],
  connected: [5, 3, 5]
};

const testDevicesActionType = {
  type: 'CLEAR_ADVERTISING_LIST'
};
const testFoundDevicesActionType = {
  payload: {
    peripheral: {}
  },
  type: 'FOUND_ADVERTISING_DEVICE'
};

const clearAdvertisingList = deviceHandlers.CLEAR_ADVERTISING_LIST(testDevicesStateType, testDevicesActionType);
const foundAvertisingDevice = deviceHandlers.FOUND_ADVERTISING_DEVICE(testDevicesStateType, testFoundDevicesActionType);

// Need to figure out what the colon after the parenthesis means in devicesReducer.js.
describe('Testing devicesReducer.js', () => {
  describe('Testing deivceHandlers', () => {
    describe('Testing CLEAR_ADVERTISING_LIST', () => {
      it('Return the correct information', () => {
        const blankAdvertising = {
          advertising: []
        };
        expect(clearAdvertisingList).toEqual({
          connected: testDevicesStateType.connected,
          advertising: blankAdvertising.advertising
        });
      });
    });
    it('Does not throw an error', () => {
      expect(() => {
        deviceHandlers.CLEAR_ADVERTISING_LIST(testDevicesStateType, testDevicesActionType);
      }).not.toThrow();
    });
    describe('Testing FOUND_ADVERTISING_DEVICE', () => {
      it('Return the correct information', () => {
        const newAdvertisingValue = testDevicesStateType.advertising.concat(testFoundDevicesActionType.payload.peripheral);
        expect(foundAvertisingDevice).toEqual({
          connected: testDevicesStateType.connected,
          advertising: newAdvertisingValue
        });
      });
      it('Does not throw an error', () => {
        expect(() => {
          deviceHandlers.FOUND_ADVERTISING_DEVICE(testDevicesStateType, testFoundDevicesActionType);
        }).not.toThrow();
      });
    });
  });
  it('Has a defaultState with values set to blank arrays', () => {
    expect(defaultState).toEqual({
      advertising: [],
      connected: []
    });
  });
});

