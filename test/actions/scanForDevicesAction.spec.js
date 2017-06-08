// @flow
/* **********************************************************
* File: test/actions/ScanForDevicesActions.spec.js
*
* Brief: Testing of the scan for device actions
*
* Author: Craig Cheney
* Date: 2017.06.06
*
**********************************************************/
// import { spy } from 'sinon';
// import scanActions from '../../app/actions/ScanForDevicesActions';
import * as actions from '../../app/actions/ScanForDevicesActions';
// import { __RewireAPI__ as scanActionRewire } from '../../app/actions/ScanForDevicesActions';

// scanActions.__Rewrire__('Noble', { state: false });

describe('ScanForDevicesActions', () => {
  it('changeScanMethod should create a change scan action', () => {
    /* BLE */
    let act = actions.changeScanMethod('ble');
    expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
    expect(act.payload.method).toEqual('ble');
    /* USB */
    act = actions.changeScanMethod('usb');
    expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
    expect(act.payload.method).toEqual('usb');
  });
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
/* [] - END OF FILE */
