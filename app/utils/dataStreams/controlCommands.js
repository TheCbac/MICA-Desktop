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
import type { responsePacketT, micaPacketT, packetDataT } from './packets';
import type { subCommandFuncT, subCommandT } from './commandTypes';
import type {
  terminalParsedObjT
} from '../../types/developerTypes';

export const MICA_PACKET_CMD_CTRL_LED = 0x01;
export const MICA_PACKET_CMD_CTRL_DIO = 0x02;
export const MICA_PACKET_CMD_CTRL_AIO = 0x03;
export const MICA_PACKET_CMD_CTRL_BOOT = 0x04;
export const MICA_PACKET_CMD_CTRL_NAME = 0x05;

/* Enter bootloader */
const enterBootloaderCmd = (terminalObj: terminalParsedObjT): subCommandFuncT => {
  const packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_CONTROL,
    command: MICA_PACKET_CMD_CTRL_BOOT
  };
  /* Create the binary */
  const { success, error, binary } = createMicaPacketBinary(packetObj);
  const output = success ? 'Entering bootloader mode' : `Error: ${error}`;
  /* Return the result */
  return {
    packetObj,
    binary,
    output
  };
};
/* Begin the bootloader chain */

export const bootloaderCmd: subCommandT = {
  generatePacketObj: enterBootloaderCmd,
  callback: logControlError
};


/* Set the leds to a random color */
const randomLed = (terminalObj: terminalParsedObjT): subCommandFuncT => {
  const { args } = terminalObj;
  /* enable all Leds */
  const enabled = parseInt(args[1], 16) || 0b111;
  /* Get a random value [0-255] */
  let R = parseInt(args[2], 16);
  R = Number.isNaN(R) ? randomInt() : R;

  let G = parseInt(args[3], 16);
  G = Number.isNaN(G) ? randomInt() : G;

  let B = parseInt(args[4], 16);
  B = Number.isNaN(B) ? randomInt() : B;

  const payload = [enabled, R, G, B];
  const packetObj = {
    moduleId: MICA_PACKET_ID_MODULE_CONTROL,
    command: MICA_PACKET_CMD_CTRL_LED,
    payload
  };
  /* Create the binary */
  const { success, error, binary } = createMicaPacketBinary(packetObj);
  const output = success ? hexToString(payload) : `Error: ${error}`;
  /* Return the result */
  return {
    packetObj,
    binary,
    output
  };
};

/* Generic function callback for control subcommands */
function logControlError(
  response: responsePacketT,
  cmdObj: terminalParsedObjT,
  prevPacket: micaPacketT,
  binary: packetDataT
): void {
  const { success, error } = getResponseStatus(response.status);
  if (!success) {
    logAsyncData(`Error: ${error}`);
  } else if (cmdObj.flags.v) {
    /* Verbose - log full response */
    logAsyncData(hexToString(binary));
  } else if (response.payload.length) {
    /* Log the Payload */
    logAsyncData(hexToString(response.payload));
  }
}

export const ledCmd: subCommandT = {
  generatePacketObj: randomLed,
  callback: logControlError
};

/* [] - END OF FILE */
