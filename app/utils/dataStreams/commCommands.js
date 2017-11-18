/* @flow */
/* **********************************************************
* File: utils/dataStreams/commCommands.js
*
* Brief:Commands available to communications module for MICA
*
* Authors: Craig Cheney
*
* 2017.11.14 CC - Document created
*
********************************************************* */
import {
  createMicaPacketBinary, MICA_PACKET_ID_MODULE_COMM, getResponseStatus
} from './packets';
import { logAsyncData, hexToString } from '../Developer/TerminalUtils';
import { ADV_PEER_ADDR_LEN } from '../BLE/bleAdvertisementPackets';
import type { responsePacketT, micaPacketT, packetDataT } from './packets';
import type { subCommandFuncT, subCommandT } from './commandTypes';
import type { terminalParsedObjT } from '../../types/developerTypes';

export const MICA_PACKET_CMD_COMM_SCAN = 0x01;
export const MICA_PACKET_CMD_COMM_CONN = 0x02;
export const MICA_PACKET_CMD_COMM_DCON = 0x03;
export const MICA_PACKET_CMD_COMM_WRITE = 0x04;
export const MICA_PACKET_CMD_COMM_READ = 0x05;

/* Start or stop a BLE scan on the target device */
const startStopScan = (terminalObj: terminalParsedObjT): subCommandFuncT => {
  const { args } = terminalObj;
  /* Create the packet object */
  let packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_COMM,
    command: MICA_PACKET_CMD_COMM_SCAN,
  };
  /* Parse the command */
  let nextState;
  if (args[1] && (args[1].toLowerCase() === 'start' || parseInt(args[1], 10) === 1)) {
    nextState = 1;
  } else if (args[1] && (args[1].toLowerCase() === 'stop' || parseInt(args[1], 10) === 0)) {
    nextState = 0;
  } else {
    return {
      packetObj,
      binary: [],
      output: 'Error: scan state must be passed in as an argument'
    };
  }
  /* Create the binary */
  packetObj = { ...packetObj, payload: [nextState] };
  const { success, error, binary } = createMicaPacketBinary(packetObj);
  const output = success ? '' : `Error: ${error}`;
  return {
    packetObj,
    binary,
    output
  };
};

/* Initiate a connection request */
const connectBleDevice = (terminalObj: terminalParsedObjT): subCommandFuncT => {
  const { args } = terminalObj;
  /* Create the packet object */
  let packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_COMM,
    command: MICA_PACKET_CMD_COMM_CONN,
  };
  let inputError;
  const addrType = parseInt(args[1], 16);
  if (addrType > 0x01) {
    inputError = 'Error: invalid address type';
  }
  /* Convert from ASCII string to little-endian hex */
  const addr = args[2].split(':').reverse().map((val) => parseInt(val, 16));
  /* Make sure each value is valid */
  const validValues = addr.every((val) => (val >= 0 && val <= 255));
  if (addr.length !== ADV_PEER_ADDR_LEN || !validValues) {
    inputError = 'Error: invalid address';
  }
  if (inputError) {
    return { packetObj, binary: [], output: inputError };
  }

  /* Create the binary */
  packetObj = { ...packetObj, payload: [addrType, ...addr] };
  const { success, error, binary } = createMicaPacketBinary(packetObj);
  const output = success ? '' : `Error: ${error}`;
  return {
    packetObj,
    binary,
    output
  };
};

/* Disconnect from a device - optimistic */
const disconnectBleDevice = (terminalObj: terminalParsedObjT): subCommandFuncT => {
  const { args } = terminalObj;
  /* Create the packet object */
  let packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_COMM,
    command: MICA_PACKET_CMD_COMM_DCON,
  };
  let inputError;
  const addrType = parseInt(args[1], 16);
  if (addrType > 0x01) {
    inputError = 'Error: invalid address type';
  }
  /* Convert from ASCII string to little-endian hex */
  const addr = args[2].split(':').reverse().map((val) => parseInt(val, 16));
  /* Make sure each value is valid */
  const validValues = addr.every((val) => (val >= 0 && val <= 255));
  if (addr.length !== ADV_PEER_ADDR_LEN || !validValues) {
    inputError = 'Error: invalid address';
  }
  if (inputError) {
    return { packetObj, binary: [], output: inputError };
  }

  /* Create the binary */
  packetObj = { ...packetObj, payload: [addrType, ...addr] };
  const { success, error, binary } = createMicaPacketBinary(packetObj);
  const output = success ? '' : `Error: ${error}`;
  return {
    packetObj,
    binary,
    output
  };
};

/* Generic function callback for communication subcommands */
function logCommunicationError(
  response: responsePacketT,
  cmdObj: terminalParsedObjT,
  prevPacket: micaPacketT,
  binary: packetDataT
): void {
  const { success, error } = getResponseStatus(response.status);

  if (!success) {
    logAsyncData(`Error: ${error}`);
  } else if (response.payload.length) {
    /* Log the Payload */
    logAsyncData(hexToString(response.payload));
  }
}

export const scanCmd: subCommandT = {
  generatePacketObj: startStopScan,
  callback: logCommunicationError
};

export const connectCmd: subCommandT = {
  generatePacketObj: connectBleDevice,
  callback: logCommunicationError
};

export const disconnectCmd: subCommandT = {
  generatePacketObj: disconnectBleDevice,
  callback: logCommunicationError
};
/* [] - END OF FILE */
