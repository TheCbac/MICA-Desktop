/* @flow */
/* eslint no-bitwise: 0 */
/* **********************************************************
* File: utils/dataStreams/packets.js
*
* Brief: Parsing MICA binary packets
*
* Authors: Craig Cheney
*
* 2017.11.03 CC - Document created
*
********************************************************* */
import { SHIFT_BYTE_ONE, MASK_BYTE_ONE } from '../bitConstants';

export const MICA_PACKET_SYM_START = 0x01;
export const MICA_PACKET_SYM_END = 0xAA;

export const MICA_PACKET_ID_MODULE_ENERGY = 0x00;
export const MICA_PACKET_ID_MODULE_ACTUATION = 0x01;
export const MICA_PACKET_ID_MODULE_POWER = 0x02;
export const MICA_PACKET_ID_MODULE_SENSING = 0x03;
export const MICA_PACKET_ID_MODULE_COMM = 0x04;
export const MICA_PACKET_ID_MODULE_CONTROL = 0x05;


/* Construct a MICA packet */
export function createMicaPacket(
  moduleId: number,
  command: number,
  payload?: number[] = []
): number[] {
  /* Calculate 8 bit payload length */
  const payLenMsb = (payload.length >>> SHIFT_BYTE_ONE) & MASK_BYTE_ONE;
  const payLenLsb = payload.length & MASK_BYTE_ONE;
  /* Construct the command */
  const cmd = [MICA_PACKET_SYM_START, moduleId, command, payLenMsb, payLenLsb, ...payload];
  /* Add the footer */
  const { msb, lsb } = calcChecksum16(cmd);
  cmd.push(msb, lsb, MICA_PACKET_SYM_END);
  /* Return the command */
  return cmd;
}

/* Calculate the 8 bit checksum */
export function calcChecksum8(dataArray: number[]): number {
  let checkSum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    checkSum += dataArray[i];
  }
  return checkSum % ((2 ** 8) - 1);
}
/* Calculate the 16 bit checksum */
export function calcChecksum16(dataArray: number[]): {
  msb: number,
  lsb: number
} {
  let checkSum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    checkSum += dataArray[i];
  }
  /* convert to 16 bits */
  checkSum %= ((2 ** 16) - 1);
  /* Take the two's complement */
  checkSum = ((~checkSum >>> 0) & 0xFFFF) + 1;
  /* Return the MSB and LSB */
  const msb = (checkSum >> 8) & 0xFF;
  const lsb = checkSum & 0xFF;
  return { msb, lsb };
}


/* [] - END OF FILE */
