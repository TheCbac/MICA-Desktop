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


// testing suite
describe('Testing devicesActions.js', () => {
  describe('Testing foundAdvertisingDevice', () => {
    const randomdata = {
      peripheral: 'lemon'
    };
    it('Does not throw an error', () => {
      expect(() => {
        foundAdvertisingDevice(randomdata);
      }).not.toThrow();
    });
    it('Has a type of FOUND_ADVERTISING_DEVICE', () => {
      expect(() => {
        foundAdvertisingDevice(randomdata);
      });
    });
  });
  describe('Testing clearAdvertisingList', () => {
    it('Does not throw an error', () => {
      const clearAdvertisingListFunction = clearAdvertisingList('lemon');
      expect((clearAdvertisingListFunction).type).toEqual('CLEAR_ADVERTISING_LIST');
    });
  });
});

