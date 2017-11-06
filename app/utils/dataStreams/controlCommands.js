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
import { createMicaPacket, MICA_PACKET_ID_MODULE_CONTROL } from './packets';
import { randomInt } from '../deviceUtils';

export const MICA_PACKET_CTRL_CMD_LED = 0x01;
export const MICA_PACKET_CTRL_CMD_DIO = 0x02;
export const MICA_PACKET_CTRL_CMD_AIO = 0x03;
export const MICA_PACKET_CTRL_CMD_BOOT = 0x04;
export const MICA_PACKET_CTRL_CMD_NAME = 0x05;

/* Enter the bootloader mode */
export function enterBootloaderCmd(): number[] {
  return createMicaPacket(
    MICA_PACKET_ID_MODULE_CONTROL,
    MICA_PACKET_CTRL_CMD_BOOT
  );
}

export function dummyCmd(): number[] {
  return createMicaPacket(
    MICA_PACKET_ID_MODULE_CONTROL,
    0xFF
  );
}

export function randomLed(): number[] {
  const enabled = 0b111;
  const R = randomInt();
  const G = randomInt();
  const B = randomInt();
  const payload = [enabled, R, G, B];
  return createMicaPacket(
    MICA_PACKET_ID_MODULE_CONTROL,
    MICA_PACKET_CTRL_CMD_LED,
    payload
  );
}
/* [] - END OF FILE */
