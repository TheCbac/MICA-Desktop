// @flow
/* **********************************************************
* File: test/ScanForDevicesActions.spec.js
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
    expect(act.payload).toEqual('ble');
    /* USB */
    act = actions.changeScanMethod('usb');
    expect(act.type).toEqual(actions.CHANGE_SCAN_METHOD);
    expect(act.payload).toEqual('usb');
  });
});
/* [] - END OF FILE */
