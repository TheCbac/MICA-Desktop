// @flow
/* **********************************************************
* File: test/reducers/ScanForDevicesReducers.spec.js
*
* Brief: Testing of the scan for device reducer
*
* Author: Craig Cheney
* Date: 2017.06.06
*
**********************************************************/
import scanForDevicesReducer from '../../app/reducers/ScanForDevicesReducer';
import { CHANGE_SCAN_METHOD, ENABLE_SCAN_METHOD } from '../../app/actions/ScanForDevicesActions'

describe('ScanForDevicesReducer', () => {
  it('should handle initial state', () => {
    expect(scanForDevicesReducer(undefined, {})).toEqual({
      method: 'ble',
      enabled: false,
      scanning: false
    });
  });
  /* Change the scanning method */
  describe('CHANGE_SCAN_METHOD', () => {
    it('Accepts valid actions', () => {
      const state1 = scanForDevicesReducer(undefined, {
        type: CHANGE_SCAN_METHOD,
        payload: {
          method: 'usb',
          enable: false
        }
      });
      expect(state1).toEqual({
        method: 'usb',
        enabled: false,
        scanning: false
      });
      const state2 = scanForDevicesReducer(undefined, {
        type: CHANGE_SCAN_METHOD,
        payload: {
          method: 'ble',
          enable: false
        }
      });
      expect(state2).toEqual({
        method: 'ble',
        enabled: false,
        scanning: false
      });
    });
    it('Disables scanning on switch', () => {
      const state0 = {
        method: 'ble',
        enabled: true,
        scanning: true
      };
      const state1 = scanForDevicesReducer(state0, {
        type: CHANGE_SCAN_METHOD,
        payload: {
          method: 'usb',
          enable: false
        }
      });
      expect(state1).toEqual({
        method: 'usb',
        enabled: false,
        scanning: false
      });
    });
  });
  /* Enable the scanning method */
  describe('ENABLE_SCAN_METHOD', () => {
    it('Does not alter state if methods don\'t match', () => {
      const state0 = { method: 'ble', enabled: false, scanning: false };
      const state1 = scanForDevicesReducer(state0, {
        type: ENABLE_SCAN_METHOD,
        payload: {
          method: 'usb',
          enable: true
        }
      });
      expect(state1).toEqual(state0);
    });
    it('Alters state if methods do match', () => {
      const state0 = { method: 'ble', enabled: false, scanning: false };
      const state1 = scanForDevicesReducer(state0, {
        type: ENABLE_SCAN_METHOD,
        payload: {
          method: 'ble',
          enable: true
        }
      });
      expect(state1).toEqual({ ...state0, enabled: true });
    });
    it('Stops scans if disabled', () => {
      const state0 = { method: 'ble', enabled: true, scanning: true };
      const state1 = scanForDevicesReducer(state0, {
        type: ENABLE_SCAN_METHOD,
        payload: {
          method: 'ble',
          enable: false
        }
      });
      expect(state1).toEqual({ ...state0, enabled: false, scanning: false });
    });
  });
});

/* [] - END OF FILE */
