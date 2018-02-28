// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* **********************************************************
* File: test/reducers/deviceActions.spec.js
*
* Brief: Testing deviceActions.js
* Author: George Whitfield
* Date: 2017.07.25
*
********************************************************* */

import { foundAdvertisingDevice, clearAdvertisingList } from '../../app/actions/devicesActions';
import noblePeripheralType from '../../app/types/paramTypes';

const testString = 'sefhskdhf74';

// Random data
const randomdata: typeof noblePeripheralType = {
  address: 'sdfhdh43fbDG3',
  addressType: 'string',
  advertisement: {
    localName: 'MICA_45',
    manufacturerData: 4,
    serviceData: [123, 234, 345, 234],
    serviceUuids: ['sjfds3f', 'gdhfjd3', 'sgdhf47FG'],
    txPowerLevel: 5
  },
  connectable: true,
  id: '23454345g',
  rssi: 6,
  services: 1,
  uuid: 'fgdhfhHJ4g'
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

