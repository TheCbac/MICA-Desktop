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
import scanForDevices from '../../app/reducers/ScanForDevicesReducer';
import { CHANGE_SCAN_METHOD } from '../../app/actions/ScanForDevicesActions';

describe('ScanForDevicesReducer', () => {
  it('should handle initial state', () => {
    expect(scanForDevices(undefined, {})).toEqual({
      scanningMethod: 'ble',
      methodEnabled: false
    });
  });
  it('CHANGE_STATE_METHOD', () => {
    const state1 = scanForDevices(undefined, {
      type: CHANGE_SCAN_METHOD,
      scanningMethod: 'usb'
    });
    expect(state1).toEqual({
      scanningMethod: 'usb',
      methodEnabled: false
    });
    const state2 = scanForDevices(undefined, {
      type: CHANGE_SCAN_METHOD,
      scanningMethod: 'ble'
    });
    expect(state2).toEqual({
      scanningMethod: 'ble',
      methodEnabled: false
    });
  });
});

/* [] - END OF FILE */
