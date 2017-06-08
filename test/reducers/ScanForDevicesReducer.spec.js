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
      method: 'ble',
      enabled: false
    });
  });
  it('CHANGE_STATE_METHOD', () => {
    const state1 = scanForDevices(undefined, {
      type: CHANGE_SCAN_METHOD,
      payload: {
        method: 'usb'
      }
    });
    expect(state1).toEqual({
      method: 'usb',
      enabled: false
    });
    const state2 = scanForDevices(undefined, {
      type: CHANGE_SCAN_METHOD,
      payload: {
        method: 'ble'
      }
    });
    expect(state2).toEqual({
      method: 'ble',
      enabled: false
    });
  });
});

/* [] - END OF FILE */
