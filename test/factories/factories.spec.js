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
  clearAdvertisingListFactory,
  connectingToDeviceActionFactory,
  connectedToDeviceActionFactory,
  cancelConnectToDeviceActionFactory,
  disconnectingFromDeviceActionFactory,
  disconnectedFromDeviceActionFactory,
  lostConnectionFromDeviceActionFactory
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
  describe('connectingToDeviceActionFactory', () => {
    it('returns a valid action creator', () => {
      const action = connectingToDeviceActionFactory();
      expect(action.type).toBe('CONNECTING_TO_DEVICE');
      expect(typeof action.payload.deviceId).toBe('string');
      expect(action.payload.deviceId.length).toBe(32);
    });
    it('Returns the id passed in', () => {
      const id = deviceIdFactory();
      const action = connectingToDeviceActionFactory(id);
      expect(action.type).toBe('CONNECTING_TO_DEVICE');
      expect(action.payload.deviceId).toBe(id);
    });
  });
  describe('connectedToDeviceActionFactory', () => {
    it('returns a valid action creator', () => {
      const action = connectedToDeviceActionFactory();
      expect(action.type).toBe('CONNECTED_TO_DEVICE');
      expect(typeof action.payload.deviceId).toBe('string');
      expect(action.payload.deviceId.length).toBe(32);
    });
    it('Returns the id passed in', () => {
      const id = deviceIdFactory();
      const action = connectedToDeviceActionFactory(id);
      expect(action.type).toBe('CONNECTED_TO_DEVICE');
      expect(action.payload.deviceId).toBe(id);
    });
  });
  describe('cancelConnectToDeviceActionFactory', () => {
    it('returns a valid action creator', () => {
      const action = cancelConnectToDeviceActionFactory();
      expect(action.type).toBe('CANCEL_CONNECT_TO_DEVICE');
      expect(typeof action.payload.deviceId).toBe('string');
      expect(action.payload.deviceId.length).toBe(32);
    });
    it('Returns the id passed in', () => {
      const id = deviceIdFactory();
      const action = cancelConnectToDeviceActionFactory(id);
      expect(action.type).toBe('CANCEL_CONNECT_TO_DEVICE');
      expect(action.payload.deviceId).toBe(id);
    });
  });
  describe('disconnectingFromDeviceActionFactory', () => {
    it('returns a valid action creator', () => {
      const action = disconnectingFromDeviceActionFactory();
      expect(action.type).toBe('DISCONNECTING_FROM_DEVICE');
      expect(typeof action.payload.deviceId).toBe('string');
      expect(action.payload.deviceId.length).toBe(32);
    });
    it('Returns the id passed in', () => {
      const id = deviceIdFactory();
      const action = disconnectingFromDeviceActionFactory(id);
      expect(action.type).toBe('DISCONNECTING_FROM_DEVICE');
      expect(action.payload.deviceId).toBe(id);
    });
  });
  describe('disconnectedFromDeviceActionFactory', () => {
    it('returns a valid action creator', () => {
      const action = disconnectedFromDeviceActionFactory();
      expect(action.type).toBe('DISCONNECTED_FROM_DEVICE');
      expect(typeof action.payload.deviceId).toBe('string');
      expect(action.payload.deviceId.length).toBe(32);
    });
    it('Returns the id passed in', () => {
      const id = deviceIdFactory();
      const action = disconnectedFromDeviceActionFactory(id);
      expect(action.type).toBe('DISCONNECTED_FROM_DEVICE');
      expect(action.payload.deviceId).toBe(id);
    });
  });
  describe('lostConnectionFromDeviceActionFactory', () => {
    it('returns a valid action creator', () => {
      const action = lostConnectionFromDeviceActionFactory();
      expect(action.type).toBe('LOST_CONNECTION_FROM_DEVICE');
      expect(typeof action.payload.deviceId).toBe('string');
      expect(action.payload.deviceId.length).toBe(32);
    });
    it('Returns the id passed in', () => {
      const id = deviceIdFactory();
      const action = lostConnectionFromDeviceActionFactory(id);
      expect(action.type).toBe('LOST_CONNECTION_FROM_DEVICE');
      expect(action.payload.deviceId).toBe(id);
    });
  });
});
/* [] - END OF FILE */
