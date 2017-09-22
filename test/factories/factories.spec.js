// @flow
/* **********************************************************
* File: tests/factories/factories.spec.js
*
* Brief: Unit tests for factories

* Author: Craig Cheney
*
* 2017.09.22 CC - Document Created
*
********************************************************* */
import {
  deviceIdFactory,
  foundDeviceActionFactory,
  clearAdvertisingListFactory
} from './factories';

/* Test suite */
describe('Factories.spec.js', () => {
  describe('deviceIdFactory', () => {
    it('should return a 128 bit uuid', () => {
      /* Run test 5 times */
      for (let i = 0; i < 5; i++) {
        const id = deviceIdFactory();
        expect(typeof id).toEqual('string');
        expect(id.length).toEqual(32);
      }
    });
  });
  describe('foundDeviceActionFactory', () => {
    it('should return a valid action creator', () => {
      /* Run test 5 times */
      for (let i = 0; i < 5; i++) {
        const action = foundDeviceActionFactory();
        expect(action.type).toEqual('FOUND_ADVERTISING_DEVICE');
        expect(typeof action.payload.deviceId).toEqual('string');
        expect(action.payload.deviceId.length).toEqual(32);
      }
    });
    it('should accept an argument of an id', () => {
      const id = deviceIdFactory();
      const action = foundDeviceActionFactory(id);
      expect(action.payload.deviceId).toBe(id);
    });
  });
  describe('clearAdvertisingListFactory', () => {
    it('return a valid action creator', () => {
      const action = clearAdvertisingListFactory();
      expect(action).toEqual({
        type: 'CLEAR_ADVERTISING_LIST',
        payload: {}
      });
    });
  });
});
/* [] - END OF FILE */
