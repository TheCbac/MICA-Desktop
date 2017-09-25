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
********************************************************* */
import { Noble } from '../utils/nativeModules';
import {
  changeScanState,
  enableScanMethod
} from './ScanForDevicesActions';
import { foundAdvertisingDevice } from './devicesActions';
import store from '../index';
import log from '../utils/loggingUtils';
import type { newDeviceObjType } from '../types/paramTypes';

/* Noble callback */
export function stateChange() {
  Noble.on('stateChange', (state: string) => {
    let enabled = false;
    if (state === 'poweredOn') {
      enabled = true;
    }
    log.verbose('Noble state:', state);
  /* Dispatch the action */
    store.dispatch(enableScanMethod('ble', enabled));
  });
}
/* The Noble BLE scan has started, dispatch an event */
export function scanStart() {
  Noble.on('scanStart', () => {
    /* Set a timeout */
    const timeoutId = setTimeout(() => {
      Noble.stopScanning();
    }, 15000);
    /* Dispatch the start scan action */
    store.dispatch(changeScanState('ble', true, timeoutId));
  });
}
  /* The Noble BLE Scan has stopped, update the state */
export function scanStop() {
  Noble.on('scanStop', () => {
    /* Get the timeout ID saved */
    const timeoutId = store.getState().scanForDevices.timeoutId;
    /* Clear if applicable */
    if (timeoutId) { clearTimeout(timeoutId); }
    /* Dispatch the stop scan action */
    store.dispatch(changeScanState('ble', false));
  });
}
/* A peripheral was discovered */
export function discover() {
  Noble.on('discover', (peripheral: *) => {
    /* Get the relevant parameters */
    const { id: deviceId, rssi, address } = peripheral;
    const name = peripheral.advertisement.localName;
    /* construct the object */
    const newDeviceObj: newDeviceObjType = {
      deviceId,
      address,
      name,
      rssi
    };
    /* Dispatch the action */
    store.dispatch(foundAdvertisingDevice(newDeviceObj));
  });
}
/* Register the callbacks */
stateChange();
scanStart();
scanStop();
discover();
/* [] - END OF FILE */
