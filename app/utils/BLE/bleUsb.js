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
import {
  getPort,
  
} from '../micaUsb/micaUsb';
import {constructPacket} from '../micaUsb/micaParser';
import type { bleApiResultType } from '../../types/bleTypes';


/* Placeholder until usb functions are written */
export function usbPlaceholder(): bleApiResultType {
  return { success: false, error: 'USB Dongle is not implemented yet' };
}

/* Start the USB scan */
export function usbStartScan(): bleApiResultType {
  const port = getPort();
  if (port && port.isOpen) {
    const idCommand = {
      module: 'control',
      cmd: 0x00,
      payload: [],
      flags: 0x00
    };
    const { success, err, packet } = constructPacket(idCommand);
    if (success) {
      port.write(packet);
    return { success: false, error: err };
    }
  }
  return { success: false, error: 'Port not found' };
}
/* [] - END OF FILE */
