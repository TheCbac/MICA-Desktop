// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }]*/
/* **********************************************************
* File: test/reducers/deviceActions.spec.js
*
* Brief: Testing deviceActions.js
* Author: George Whitfield
* Date: 2017.08.25
*
**********************************************************/

import { foundAdvertisingDevice, clearAdvertisingList } from '../../app/actions/devicesActions';

const testString = 'lemon';

const randomdata = {
  peripheral: testString
};
// testing suite
describe('Testing devicesActions.js', () => {
  describe('Testing foundAdvertisingDevice', () => {
    const foundAdvertisingDeviceFunction = foundAdvertisingDevice(randomdata);
    it('Does not throw an error', () => {
      expect(() => {
        foundAdvertisingDevice(randomdata);
      }).not.toThrow();
    });
    it('Has a type of FOUND_ADVERTISING_DEVICE', () => {
      expect((foundAdvertisingDeviceFunction).type).toEqual('FOUND_ADVERTISING_DEVICE');
    });
    it('Has a returned peripheral which is the same as the input peripheral', () => {
      expect((foundAdvertisingDeviceFunction).payload.peripheral).toBe(randomdata);
    });
  });
  describe('Testing clearAdvertisingList', () => {
    it('Does not throw an error', () => {
      expect(() => {
        clearAdvertisingList(randomdata);
      }).not.toThrow();
    });
    it('Has a type of CLEAR_ADVERTISING_LIST', () => {
      const clearAdvertisingListFunction = clearAdvertisingList(testString);
      expect((clearAdvertisingListFunction).type).toEqual('CLEAR_ADVERTISING_LIST');
    });
  });
});

