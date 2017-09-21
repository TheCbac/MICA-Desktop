/* Returns the data packet object from the dataPacket data */
/* eslint no-bitwise: 0 */
/* eslint no-plusplus: 0 */
/* **********************************************************
* File: actions/ScanForDevicesActions.js
*
* Brief: Actions for the scanning devices
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.07.28 GW - Document created
*
********************************************************* */
import { TimeSeries } from 'pondjs';

const LOW_NIBBLE_MASK = 0x0F;
const HALF_BYTE_SHIFT = 4;
const BYTE_SHIFT = 8;
const ROLLUNDER_FLAG = 0x08;
const BITS_12 = 12;
const IS_ODD = 0x01;


/* Converts a twos complement word of numBits length to a signed int */
export function twosCompToSigned(value: number, numBits: number): number {
  /* if the sign bit is set */
  if ((value & (1 << (numBits - 1))) !== 0) {
    return (value - (2 ** numBits));
  }
  return value;
}

/* take two on the parsing function */
export function parseDataPacket2(
  packetData: buffer,
  numChannels: number,
  periodLength: number,
  scalingConstant: number,
  gain: number,
  offset: number
): TimeSeries {

}

/* Parse Data Function */
export function parseDataPacket(
  peripheralId: number,
  data: buffer,
  numChannels: number,
  periodLength: number,
  packetTime,
  scalingConstant,
  gain,
  offset
) {
  let i = 0;
  const dataArray = [];

  while (i < data.length) {
    try {
      /* ***************** Time information ***************** */
      const timeMSB = getValue(data, i++);
      const timeLSB = getValue(data, i++);
      /* If the rollunder flag is set read secondsLSB */
      /* Currently no error correction is done with secondsLSB, but it
          needs to be read to maintain packet index integrity  */
      const rollunder = (timeLSB & ROLLUNDER_FLAG);
      if (rollunder) {
        const secondsLSB = getValue(data, i++);
      }
      /* ***************** Data information ***************** */
      const channelData = [];
      let dataMSB;
      let dataLSB;
      let rawData;
      for (let channel = 0; channel < numChannels; channel++) {
        /* If an even numbered channel */
        if (!(channel & IS_ODD)) {
          dataMSB = getValue(data, i++);
          dataLSB = getValue(data, i++);
          rawData = (dataMSB << HALF_BYTE_SHIFT) | ((dataLSB >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);
        } else { /* If an odd numbered channel */
          /* Unpack the MSB of odd channels from the previous byte */
          dataMSB = getValue(data, (i - 1));
          dataLSB = getValue(data, (i + 1));
          rawData = ((dataMSB & LOW_NIBBLE_MASK) << BYTE_SHIFT) | dataLSB;
          // console.log('rawData for channel ' + channel + ' --> ' + rawData);
        }
        /* Record the result */
        const chanOffset = offset[channel];
        /* Convert from two's complement to signed */
        const x = twosCompToSigned(rawData, BITS_12);
        /* dataPoint = K/G*(x-x0) = K/G*x - offset */
        const value = ((scalingConstant / gain) * x) - chanOffset;
        channelData[channel] = value.toFixed(5);
      }
      /* ***************** End Packet Data Parsing ***************** */
      /* Calculate the time differential */
      const timeDifferentialTwos = (timeMSB << HALF_BYTE_SHIFT) |
        ((timeLSB >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);

      const timeDifferential = twosCompToSigned(timeDifferentialTwos, BITS_12);

      const micro = periodLength + timeDifferential;

      /* Add the number of microseconds to the packet time obj */
      packetTime.addMicroseconds(micro);
      const newTime = packetTime.getTimeMicro();

      /* Push the data array */
      const result = {
        t: newTime,
        d: channelData
      };

      dataArray.push(result);
      const array = [];
      array.push(result);

      /* ***************** Update on the graph ***************** */
      /* Time in milliseconds between updates */
      const graphingInterval = 60;
      /* Graph on client if beyond the graphing interval */
      if (packetTime.lastLogged === null || (newTime - packetTime.lastLogged) > graphingInterval) {
        packetTime.lastLogged = newTime;
          /* report to client */
      }
    /* Catch any Errors */
    } catch (err) {
      console.log('parseDataPacket: ', err);
    }
  } /* End While */
  return dataArray;
}

/* ****************** untested ****************** */
export function newPacketTime() {
  const packetTime = new Date();
  packetTime.microsecond = 0;
  packetTime.lastLogged = null;
  /* Modify packetTime for microseconds */
  packetTime.addMicroseconds = function (usec) {
    const micro = usec + this.microsecond;
    const millisecond = Math.floor(micro / 1000);
    this.setTime(this.getTime() + millisecond);
    this.microsecond = (micro % 1000);
    return this.microsecond;
  };
  // Look into 'extends'
  packetTime.getMicroseconds = () => this.microsecond;
  /* returns the timestamp with microseconds */
  packetTime.getTimeMicro = () => Number(`${this.getTime()}.${this.microsecond}`);

  return packetTime;
}

/* ************* Generic Helpers ************* */
/* wrapper function to ensure BLE and USB functionality  */
function getValue(data, index) {
  if (data._isBuffer) {
    return data.readUInt8(index);
  }
  return data[index];
}


/* [] - END OF FILE */
