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
import { getPort } from '../micaUsb/micaUsb';
import {constructPacket} from '../micaUsb/micaParser';
import * as packets from '../micaUsb/micaConstants';
import type { bleApiResultType } from '../../types/bleTypes';
import type { packetObj_T } from '../micaUsb/micaParser.types';

/* Placeholder until usb functions are written */
export function usbPlaceholder(): bleApiResultType {
  return { success: false, error: 'USB Dongle is not implemented yet' };
}

/* Wrapper for writing out a command */
export function writeCommand(command: packetObj_T): bleApiResultType {
  const port = getPort();
  if (port && port.isOpen) {
    const { success, err, packet } = constructPacket(command);
    if (success && packet) {
      port.write(packet);
      return { success: true };
    }
    return { success: false, error: err };
  }
  return { success: false, error: 'Port not found' };
}

/* Start the USB scan */
export function usbStartScan(): bleApiResultType {
  const idCommand = {
    module: 'control',
    cmd: packets.CMD_SCAN_START,
    payload: [],
    flags: packets.FLAG_NONE
  };
  return writeCommand(idCommand);
}

/* Stop the USB scan */
export function usbStopScan(): bleApiResultType {
  const idCommand = {
    module: 'control',
    cmd: packets.CMD_SCAN_STOP,
    payload: [],
    flags: packets.FLAG_NONE
  };
  return writeCommand(idCommand);
}

/* Connect to a remote device */
export function usbConnect(
  deviceId,
  connectCallback,
  disconnectCallback
): bleApiResultType {
  console.log(deviceId);
  const connectCmd = {
    module: 'control',
    cmd: packets.CMD_CONNECT,
    payload: deviceId.split(',').map(Number), 
    flags: packets.FLAG_NONE
  }
  return writeCommand(connectCmd);
}
/* [] - END OF FILE */
