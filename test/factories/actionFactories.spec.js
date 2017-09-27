// @flow
/* **********************************************************
* File: tests/factories/actionFactories.spec.js
*
* Brief: Unit tests for action creator factories

* Author: Craig Cheney
*
* 2017.09.23 CC - Document Created
*
********************************************************* */
import { deviceIdFactory } from './factories';
import {
  foundDeviceActionFactory,
  clearAdvertisingListFactory,
  connectingToDeviceActionFactory,
  connectedToDeviceActionFactory,
  cancelConnectToDeviceActionFactory,
  disconnectingFromDeviceActionFactory,
  disconnectedFromDeviceActionFactory,
  lostConnectionFromDeviceActionFactory,
  reportMetadataFactory
} from './actionFactories';

/* Test suite */
describe('actionFactories.spec.js', () => {
  describe('foundDeviceActionFactory', () => {
    it('should return a valid action creator', () => {
      /* Run test 5 times */
      for (let i = 0; i < 5; i++) {
        const action = foundDeviceActionFactory();
        const { deviceId, name, address, rssi } = action.payload;
        expect(action.type).toBe('FOUND_ADVERTISING_DEVICE');
        expect(typeof deviceId).toBe('string');
        expect(deviceId.length).toBe(32);
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
        expect(typeof address).toBe('string');
        expect(address.length).toBeGreaterThan(0);
        expect(typeof rssi).toBe('number');
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
  describe('reportMetadataFactory', () => {
    it('returns a valid action creator', () => {
      const action = reportMetadataFactory();
      expect(action.type).toBe('REPORT_META_DATA');
      expect(typeof action.payload.deviceId).toBe('string');
    });
  });
});
/* [] - END OF FILE */
