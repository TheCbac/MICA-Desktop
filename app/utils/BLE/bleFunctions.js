// @flow
/* **********************************************************
* File: utils/BLE/bleFunctions.js
*
* Brief: Contains the API for interacting with BLE devices.
*   This is a wrapper library that allows for communication
*   over Noble or USB.
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document created
********************************************************* */
import { nobleStartScan, nobleStopScan, nobleConnect, nobleDisconnect
 } from './bleNoble';
import { usbPlaceholder } from './bleUsb';
import type { scanTypes, idType } from '../../types/paramTypes';
import type { bleApiResultType, bleWrapperObjType } from '../../types/bleTypes';

/* Start a BLE scan */
export function bleStartScan(method: scanTypes): bleApiResultType {
  const bleWrapperObj: bleWrapperObjType = {
    method,
    bleMethod: nobleStartScan,
    usbMethod: usbPlaceholder
  };
  /* Wrap the function */
  return wrapBle(bleWrapperObj);
}

/* Stop a BLE scan */
export function bleStopScan(method: scanTypes): bleApiResultType {
  const bleWrapperObj: bleWrapperObjType = {
    method,
    bleMethod: nobleStopScan,
    usbMethod: usbPlaceholder
  };
  /* Wrap the function */
  return wrapBle(bleWrapperObj);
}
/* Connect to a device */
export function bleConnect(
  method: scanTypes,
  id: idType,
  connectCallback: (id: idType, error?: string) => void,
  disconnectCallback: (id: idType) => void
): bleApiResultType {
  const bleWrapperObj: bleWrapperObjType = {
    method,
    bleMethod: nobleConnect,
    usbMethod: usbPlaceholder
  };
  /* Wrap the function */
  return wrapBle(bleWrapperObj, id, connectCallback, disconnectCallback);
}

/* Cancel a pending connection to a device */
export function bleCancelPending(
  method: scanTypes,
  id: idType,
): bleApiResultType {
  const bleWrapperObj: bleWrapperObjType = {
    method,
    bleMethod: nobleDisconnect,
    usbMethod: usbPlaceholder
  };
  /* Wrap the function */
  return wrapBle(bleWrapperObj, id);
}

/* Disconnect from a device */
export function bleDisconnect(
  method: scanTypes,
  id: idType,
): bleApiResultType {
  const bleWrapperObj: bleWrapperObjType = {
    method,
    bleMethod: nobleDisconnect,
    usbMethod: usbPlaceholder
  };
  /* Wrap the function */
  return wrapBle(bleWrapperObj, id);
}

/* ==============================  */

/* Wrapper function that reduces writing a switch for each case */
function wrapBle(
  wrapperObj: bleWrapperObjType,
  ...args: Array<mixed>
): bleApiResultType {
  /* Extract the parameters */
  const { method, bleMethod, usbMethod } = wrapperObj;
  /* Act according to the scan method */
  switch (method) {
    case 'ble':
      return bleMethod(...args);
    case 'usb':
      return usbMethod(...args);
    default:
      return { success: false, error: 'Unknown Scan Method' };
  }
}
/* [] - END OF FILE */
