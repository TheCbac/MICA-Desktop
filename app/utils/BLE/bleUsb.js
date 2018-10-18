// @flow
/* **********************************************************
* File: utils/BLE/bleUsb.js
*
* Brief: Contains the API for interacting with BLE devices
*   using the MICA BLE support cube via USB.
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document created
********************************************************* */
import type { bleApiResultType } from '../../types/bleTypes';
import { setPort, removePort, getPort } from 'micaUsb';


/* Placeholder until usb functions are written */
export function usbPlaceholder(): bleApiResultType {
  return { success: false, error: 'USB Dongle is not implemented yet' };
}

/* Start the USB scan */
export function usbStartScan(): bleApiResultType {
  const port = getPort();
  if (port && port.isOpen) {
    return { success: true, error: 'Found port' };
  }
  return { success: false, error: 'Scan start failed' };
}
/* [] - END OF FILE */
