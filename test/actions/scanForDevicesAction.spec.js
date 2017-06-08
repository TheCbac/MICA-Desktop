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
import * as actions from '../../app/actions/ScanForDevicesActions';

describe('ScanForDevicesActions', () => {
  it('changeScanMethod should create an increment action', () => {
    /* BLE */
    let act = actions.changeScanMethod('ble');
    expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
    expect(act.payload.method).toEqual('ble');
    /* USB */
    act = actions.changeScanMethod('usb');
    expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
    expect(act.payload.method).toEqual('usb');
  });
});
/* [] - END OF FILE */
