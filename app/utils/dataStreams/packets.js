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
