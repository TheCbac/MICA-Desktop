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
  createMicaPacketBinary, MICA_PACKET_ID_MODULE_COMM, getResponseStatus,
  PACKET_REPORT_ADV
} from './packets';
import { logAsyncData, hexToString } from '../Developer/TerminalUtils';
import { parseAdvertisementPacket } from '../BLE/bleAdvertisementPackets';
import type { responsePacketT, micaPacketT, packetDataT } from './packets';
import type { subCommandFuncT, subCommandT } from './commandTypes';
import type { terminalParsedObjT } from '../../types/developerTypes';

export const MICA_PACKET_CMD_COMM_SCAN = 0x01;
export const MICA_PACKET_CMD_COMM_WRITE = 0x02;
export const MICA_PACKET_CMD_COMM_READ = 0x03;

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

/* Generic function callback for communication subcommands */
function receiveAdvertisingPacket(
  response: responsePacketT,
  cmdObj: terminalParsedObjT,
  prevPacket: micaPacketT,
  binary: packetDataT
): void {
  if (response.moduleId !== MICA_PACKET_ID_MODULE_COMM) {
    logAsyncData('receiveAdvertisingPacket got wrong command module');
    return;
  }

  if (response.status === PACKET_REPORT_ADV) {
    /* Parse the advertisement packet */
    const { success, error, packet } = parseAdvertisementPacket(response.payload);
    if (!success && error) {
      logAsyncData(`Error: ${error}`);
      return;
    }
    if (packet) {
      logAsyncData(`${packet.advPacketData.localName} ${packet.peerAddr} ${packet.rssi}`);
    }
  } else {
    const status = getResponseStatus(response.status);
    if (!status.success) {
      logAsyncData(`Error: ${status.error}`);
    }
  }
}

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
  callback: receiveAdvertisingPacket
};
/* [] - END OF FILE */
