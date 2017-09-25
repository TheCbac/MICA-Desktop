// @flow
/* **********************************************************
* File: utils/BLE/bleNoble.js
*
* Brief: Contains the MICA API for interacting with BLE
* devices via Noble.
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document created
********************************************************* */
import store from '../../index';
import { foundAdvertisingDevice } from '../../actions/devicesActions';
import { changeScanState, enableScanMethod } from '../../actions/ScanForDevicesActions';
import { Noble } from '../nativeModules';
import { micaServiceUuid } from '../mica/micaConstants';
import log from '../loggingUtils';
import type { bleApiResultType } from '../../types/bleTypes';
import type { idType, newDeviceObjType } from '../../types/paramTypes';

/* Store the Noble objects */
const nobleObjects = {};
/* Start a Noble scan */
export function nobleStartScan(): bleApiResultType {
  Noble.startScanning([micaServiceUuid], false);
  return { success: true };
}
/* Stop a Noble scan */
export function nobleStopScan(): bleApiResultType {
  Noble.stopScanning();
  return { success: true };
}
/* Connect to a noble device */
export function nobleConnect(
  deviceId: idType,
  connectCallback: (id: idType, error?: string) => void,
  disconnectCallback: (id: idType) => void
): bleApiResultType {
  /* Get the device */
  const device = nobleObjects[deviceId];
  if (!device) {
    return { success: false, error: 'could not find the specified device' };
  }
  /* Connect to the device */
  device.connect(connectCallback);
  /* Register the disconnect callback */
  device.once('disconnect', disconnectCallback);
  /* Return success */
  return { success: true };
}

/* Disconnect from a Noble device */
export function nobleDisconnect(
  deviceId: idType,
): bleApiResultType {
  /* Get the device */
  const device = nobleObjects[deviceId];
  if (!device) {
    return { success: false, error: 'could not find the specified device' };
  }
  /* Connect to the device */
  device.disconnect();
  /* Return success */
  return { success: true };
}


/* ======== Noble Native Callbacks ======== */
Noble.on('stateChange', (state: string) => {
  let enabled = false;
  if (state === 'poweredOn') {
    enabled = true;
  }
  log.verbose('Noble state:', state);
/* Dispatch the action */
  store.dispatch(enableScanMethod('ble', enabled));
});

Noble.on('scanStart', () => {
  /* Set a timeout */
  const timeoutId = setTimeout(() => {
    Noble.stopScanning();
  }, 15000);
  /* Dispatch the start scan action */
  store.dispatch(changeScanState('ble', true, timeoutId));
});

Noble.on('scanStop', () => {
  /* Get the timeout ID saved */
  const timeoutId = store.getState().scanForDevices.timeoutId;
  /* Clear if applicable */
  if (timeoutId) { clearTimeout(timeoutId); }
  /* Dispatch the stop scan action */
  store.dispatch(changeScanState('ble', false));
});

/* A peripheral was discovered */
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
  /* Keep track of the object */
  nobleObjects[deviceId] = peripheral;
  /* Dispatch the action */
  store.dispatch(foundAdvertisingDevice(newDeviceObj));
});

/* [] - END OF FILE */
