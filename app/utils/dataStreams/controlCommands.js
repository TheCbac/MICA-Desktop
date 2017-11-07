/* @flow */
/* **********************************************************
* File: utils/dataStreams/controlCommands.js
*
* Brief:Commands available to control module for MICA
*
* Authors: Craig Cheney
*
* 2017.11.06 CC - Document created
*
********************************************************* */
import {
  createMicaPacketBinary,
  getResponseStatus,
  MICA_PACKET_ID_MODULE_CONTROL
} from './packets';
import { logAsyncData, hexToString } from '../Developer/TerminalUtils';
import { randomInt } from '../deviceUtils';
import type { responsePacketT, micaPacketObjT, micaPacketT } from './packets';
import type {
  terminalParsedObjT
} from '../../types/developerTypes';

export const MICA_PACKET_CTRL_CMD_LED = 0x01;
export const MICA_PACKET_CTRL_CMD_DIO = 0x02;
export const MICA_PACKET_CTRL_CMD_AIO = 0x03;
export const MICA_PACKET_CTRL_CMD_BOOT = 0x04;
export const MICA_PACKET_CTRL_CMD_NAME = 0x05;

export type subCommandT = {
  generatePacketObj: (terminalParsedObjT) => micaPacketObjT,
  callback: (responsePacketT, terminalParsedObjT, micaPacketT) => void
};

export type subCommandObjT = {
  [commandName: string]: subCommandT
};

/* Enter the bootloader mode */
export function enterBootloaderCmd(): micaPacketObjT {
  const packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_CONTROL,
    command: MICA_PACKET_CTRL_CMD_BOOT
  };
  const binary = createMicaPacketBinary(packetObj);
  return {
    packetObj,
    binary
  };
}

export function dummyCmd(): micaPacketObjT {
  const packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_CONTROL,
    command: 0xFF
  };
  const binary = createMicaPacketBinary(packetObj);
  return {
    packetObj,
    binary
  };
}

const randomLed = (terminalObj: terminalParsedObjT): micaPacketObjT => {
  const enabled = 0b111;
  const R = randomInt();
  const G = randomInt();
  const B = randomInt();
  const payload = [enabled, R, G, B];
  const packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_CONTROL,
    command: MICA_PACKET_CTRL_CMD_LED,
    payload
  };
  const binary = createMicaPacketBinary(packetObj);
  return {
    packetObj,
    binary
  };
};

function logControlError(
  response: responsePacketT,
  cmdObj: terminalParsedObjT,
  prevPacket: micaPacketT
): void {
  const { success, error } = getResponseStatus(response.status);
  if (!success) {
    logAsyncData(`Error: ${error}`);
  }
}

export const ledCmd: subCommandT = {
  generatePacketObj: randomLed,
  callback: logControlError
};

/* [] - END OF FILE */
