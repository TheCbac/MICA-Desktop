// @flow
/* **********************************************************
* File: actions/nobleCallbackActions.js
*
* Brief: Registers all of the Noble BLE callbacks, such as
*   startScan, Discovered, etc.
*
* Author: Craig Cheney
* Date: 2017.07.10
*
**********************************************************/
// import Noble from 'noble';
import { Noble } from '../utils/nativeModules';
import {
  changeScanState,
  enableScanMethod
} from './ScanForDevicesActions';
import { foundAdvertisingDevice } from './devicesActions';
import store from '../index';
// import store from '../createNewStore';

/* Noble callback */
export function stateChange() {
  Noble.on('stateChange', (state: string) => {
    let enabled = false;
    if (state === 'poweredOn') {
      enabled = true;
    }
  /* Dispatch the action */
    store.dispatch(enableScanMethod('ble', enabled));
  });
}
/* The Noble BLE scan has started, dispatch an event */
export function scanStart() {
  Noble.on('scanStart', () => {
    store.dispatch(changeScanState('ble', true));
  });
}
  /* The Noble BLE Scan has stopped, update the state */
export function scanStop() {
  Noble.on('scanStop', () => {
    store.dispatch(changeScanState('ble', false));
  });
}
/* A peripheral was discovered */
export function discover() {
  Noble.on('discover', (peripheral) => {
    store.dispatch(foundAdvertisingDevice(peripheral));
  });
}
stateChange();
scanStart();
scanStop();
discover();
/* [] - END OF FILE */
