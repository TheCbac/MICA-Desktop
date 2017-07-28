// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/actions/ScanForDevicesActions.spec.js
*
* Brief: Testing of the scan for device actions
*
* Author: Craig Cheney
* Date: 2017.06.06
*
**********************************************************/
// $FlowFixMe
import scanRewire, * as actions from '../../app/actions/ScanForDevicesActions';
import React from 'react';

describe('ScanForDevicesActions', () => {
  describe('changeScanMethod', () => {
    it('BLE should create a change scan action', () => {
      /* BLE off */
      scanRewire.__Rewire__('Noble', { state: 'poweredOff' });
      let act = actions.changeScanMethod('ble');
      expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
      expect(act.payload).toEqual({ method: 'ble', enable: false });
      /* BLE on */
      scanRewire.__Rewire__('Noble', { state: 'poweredOn' });
      act = actions.changeScanMethod('ble');
      expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
      expect(act.payload).toEqual({ method: 'ble', enable: true });
    });
    it('USB should create a valid scan action', () => {
      /* USB */
      const act = actions.changeScanMethod('usb');
      expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
      expect(act.payload).toEqual({ method: 'usb', enable: false });
    });
  });
  describe('enableScanMethod', () => {
    it('enableScanMethod should create an enable scan action', () => {
      /* BLE */
      let act = actions.enableScanMethod('ble', true);
      expect(act.type).toEqual(actions.ENABLE_SCAN_METHOD);
      expect(act.payload).toEqual({
        method: 'ble',
        enable: true
      });
      act = actions.enableScanMethod('ble', false);
      expect(act.type).toEqual(actions.ENABLE_SCAN_METHOD);
      expect(act.payload).toEqual({
        method: 'ble',
        enable: false
      });
      /* USB */
      act = actions.enableScanMethod('usb', true);
      expect(act.type).toEqual(actions.ENABLE_SCAN_METHOD);
      expect(act.payload).toEqual({
        method: 'usb',
        enable: true
      });
      act = actions.enableScanMethod('usb', false);
      expect(act.type).toEqual(actions.ENABLE_SCAN_METHOD);
      expect(act.payload).toEqual({
        method: 'usb',
        enable: false
      });
    });
  });
});
/* [] - END OF FILE */
