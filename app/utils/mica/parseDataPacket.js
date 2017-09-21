// @flow
/* eslint no-bitwise: 0 */
/* eslint no-plusplus: 0 */
/* **********************************************************
* File: utils/mica/parseDataPacket.js
*
* Brief: Utility for parsing mica data packets
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.09.20 CC - Updated document for Electron
* 2017.07.28 GW - Document created
*
********************************************************* */
import { TimeEvent } from 'pondjs';
import PreciseTime from '../preciseTime';
import log from '../loggingUtils';

const LOW_NIBBLE_MASK = 0x0F;
const HALF_BYTE_SHIFT = 0x04;
const BYTE_SHIFT = 0x08;
const ROLLUNDER_FLAG = 0x08;
const BITS_12 = 12;
const ODD_MASK = 0x01;

/* Converts a twos complement word of numBits length to a signed int */
export function twosCompToSigned(value: number, numBits: number): number {
  /* if the sign bit is set */
  if ((value & (1 << (numBits - 1))) !== 0) {
    return (value - (2 ** numBits));
  }
  return value;
}

/* take two on the parsing function */
export function parseDataPacket(
  packetData: buffer,
  numChannels: number,
  periodLength: number,
  scalingConstant: number,
  gain: number,
  offset: number[],
  startTime: PreciseTime
): TimeEvent[] {
  /* return array */
  const eventArray = [];
  let idx = 0;
  /* Protect against corrupt packets */
  try {
    /* Iterate through the whole packet */
    while (idx < packetData.length) {
      /* ***************** Time information **************** */
      const timeMsb = packetData.readUInt8(idx++);
      const timeLsb = packetData.readUInt8(idx++);
      /* If the rollunder flag is set read secondsLSB */
      /* Currently no error correction is done with secondsLsb, but it
       * needs to be read to maintain packet index integrity  */
      const rollunder = (timeLsb & ROLLUNDER_FLAG);
      if (rollunder) {
        const secondsLsb = packetData.readUInt8(idx++); // eslint-disable-line no-unused-vars
      }
      /* ***************** Data information ***************** */
      const channelData = {};
      /* Iterate through the channels */
      for (let channel = 0; channel < numChannels; channel++) {
        let rawData;
        /* If an even numbered channel */
        if (!(channel & ODD_MASK)) {
          const dataMsb = packetData.readUInt8(idx++);
          const dataLsb = packetData.readUInt8(idx++);
          rawData = (dataMsb << HALF_BYTE_SHIFT) |
            ((dataLsb >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);
        } else { /* If an Odd numbered channel */
          /* Unpack the MSB of odd channels from the previous byte */
          const dataMsb = packetData.readUInt8(idx - 1);
          const dataLsb = packetData.readUInt8(idx++);
          rawData = ((dataMsb & LOW_NIBBLE_MASK) << BYTE_SHIFT) | dataLsb;
        }
        /* Record the results */
        const chanOffset = offset[channel];
        /* Convert from two's complement to signed */
        const signedData = twosCompToSigned(rawData, BITS_12);
        /* dataPoint = K/G*(x-x0) = K/G*x - offset */
        const value = ((scalingConstant / gain) * signedData) - chanOffset;
        /* Limit the precision */
        channelData[channel] = value.toFixed(5);
      }
      /* ***************** End Packet Data Parsing ***************** */
      /* Calculate the time differential */
      const timeDifferentialTwos = (timeMsb << HALF_BYTE_SHIFT) |
        ((timeLsb >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);
      /* Get the signed time differential */
      const timeDifferential = twosCompToSigned(timeDifferentialTwos, BITS_12);
      /* calculate the microsecond delta */
      const micro = periodLength + timeDifferential;
      /* Update the time */
      startTime.addMicroseconds(micro);
      /* Create the time event */
      const event = new TimeEvent(startTime.getPreciseTime(), channelData);
      /* Push the event */
      eventArray.push(event);
    }
  } catch (err) {
    log.warn('ParseDataPacket corrupted packet', err);
  }
  /* Return the event array */
  return eventArray;
}

/* [] - END OF FILE */
