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
import { getMicaHandleFromUuid } from '../mica/micaConstants';

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
  const connectCmd = {
    module: 'control',
    cmd: packets.CMD_CONNECT,
    payload: deviceId.split(',').map(Number), 
    flags: packets.FLAG_NONE
  };
  return writeCommand(connectCmd);
}

/* Cancel a pending connection */
export function usbCancelPending(deviceId): bleApiResultType {
  const cancelPendingCmd = {
    module: 'control',
    cmd: packets.CMD_CONNECT_CANCEL,
    payload: deviceId.split(',').map(Number), 
    flags: packets.FLAG_NONE
  };
  return writeCommand(cancelPendingCmd);
}

/* Disconnect from a remote device */
export function usbDisconnect(deviceId): bleApiResultType {
  const disconnectCmd = {
    module: 'control',
    cmd: packets.CMD_DISCONNECT,
    payload: deviceId.split(',').map(Number), 
    flags: packets.FLAG_NONE
  };
  return writeCommand(disconnectCmd);
}

  // const uuidArray = charUuid.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
/* Write to a BLE characteristic */
export function usbWriteChar(deviceId, charUuid, payload): bleApiResultType {
  /* Convert the deviceId to a array of numbers */
  const deviceIdArray = deviceId.split(',').map(Number);
  /* Convert the charUuid to an array of numbers */
  const charHandle = getMicaHandleFromUuid(charUuid);
  /* Write the command */
  const writeCmd = {
    module: 'control',
    cmd: packets.CMD_CHAR_WRITE,
    payload: [...deviceIdArray, charHandle, ...payload],
    flags: packets.FLAG_NONE
  };
  return writeCommand(writeCmd);

}

/* Read from a BLE characteristic */
export function usbReadChar(deviceId, charUuid): bleApiResultType {
  /* Convert the deviceId to a array of numbers */
  const deviceIdArray = deviceId.split(',').map(Number);
  /* Convert the charUuid to an array of numbers */
  const charHandle = getMicaHandleFromUuid(charUuid);
  /* Read command */
  const readCmd = {
    module: 'control',
    cmd: packets.CMD_CHAR_READ,
    payload: [...deviceIdArray, charHandle],
    flags: packets.FLAG_NONE
  };
  return writeCommand(readCmd);
}

/* Prepare the device for initialization */
export function usbInitDevice(deviceId): bleApiResultType {
  console.log(`Init device ${deviceId}`);
  /* Pick up here */
  return { success: true };
}
/* [] - END OF FILE */
