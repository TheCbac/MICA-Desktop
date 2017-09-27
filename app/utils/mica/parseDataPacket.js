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
import {
  MASK_BIT_ODD,
  MASK_BYTE_ONE,
  MASK_NIBBLE_LOW,
  SHIFT_BYTE_HALF,
  SHIFT_BYTE_ONE,
  FLAG_DATA_ROLLUNDER
} from '../bitConstants';
import { DATA_CLOCK_FREQ, CMD_START, CMD_STOP } from './micaConstants';
import log from '../loggingUtils';
import type { periodCountType, sensorListType } from '../../types/paramTypes';
import type { bleApiResultType } from '../../types/bleTypes';


/* Converts a twos complement word of numBits length to a signed int */
export function twosCompToSigned(value: number, numBits: number): number {
  /* if the sign bit is set */
  if ((value & (1 << (numBits - 1))) !== 0) {
    return (value - (2 ** numBits));
  }
  return value;
}

/* take two on the parsing function only works for single sensors right now */
export function parseDataPacket(
  packetData: Buffer,
  numChannels: number,
  periodLength: number,
  scalingConstant: number,
  gain: number,
  offset: number[],
  startIndex: number
): TimeEvent[] {
  /* return array */
  const eventArray = [];
  let idx = 0;
  let t = startIndex;
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
      const rollunder = (timeLsb & FLAG_DATA_ROLLUNDER);
      if (rollunder) {
        const secondsLsb = packetData.readUInt8(idx++); // eslint-disable-line no-unused-vars
      }
      /* ***************** Data information ***************** */
      const channelData = {};
      /* Iterate through the channels */
      for (let channel = 0; channel < numChannels; channel++) {
        let rawData;
        /* If an even numbered channel */
        if (!(channel & MASK_BIT_ODD)) {
          const dataMsb = packetData.readUInt8(idx++);
          const dataLsb = packetData.readUInt8(idx++);
          rawData = (dataMsb << SHIFT_BYTE_HALF) |
            ((dataLsb >> SHIFT_BYTE_HALF) & MASK_NIBBLE_LOW);
        } else { /* If an Odd numbered channel */
          /* Unpack the MSB of odd channels from the previous byte */
          const dataMsb = packetData.readUInt8(idx - 1);
          const dataLsb = packetData.readUInt8(idx++);
          rawData = ((dataMsb & MASK_NIBBLE_LOW) << SHIFT_BYTE_ONE) | dataLsb;
        }
        /* Record the results */
        const chanOffset = offset[channel];
        /* Convert from two's complement to signed */
        const signedData = twosCompToSigned(rawData, 12);
        /* dataPoint = K/G*(x-x0) = K/G*x - offset */
        const value = ((scalingConstant / gain) * signedData) - chanOffset;
        /* Limit the precision */
        // channelData[channel] = parseInt(value.toFixed(5), 10);
        channelData[channel] = value;
      }
      /* ***************** End Packet Data Parsing ***************** */
      /* Calculate the time differential */
      const timeDifferentialTwos = (timeMsb << SHIFT_BYTE_HALF) |
        ((timeLsb >> SHIFT_BYTE_HALF) & MASK_NIBBLE_LOW);
      /* Get the signed time differential */
      const timeDifferential = twosCompToSigned(timeDifferentialTwos, 12);
      /* calculate the microsecond delta */
      const micro = periodLength + timeDifferential;
      /* Update the time */
      // t += micro;
      const time = new Date();
      /* Create the time event */
      const event = new TimeEvent(time, channelData);
      /* Push the event */
      eventArray.push(event);
    }
  } catch (err) {
    log.warn('ParseDataPacket corrupted packet', err);
  }
  /* Return the event array */
  return eventArray;
}

/* Returns the period count from the sample rate - MINIMUM SAMPLE RATE is ~1.5 HZ */
export function sampleRateToPeriodCount(sampleRate: number): periodCountType {
  /* Calculate the 16-bit period count */
  const periodCount = Math.abs(Math.round(DATA_CLOCK_FREQ / sampleRate));
  /* Clip to at 16 bit number */
  if (periodCount >= ((2 ** 16) - 1)) {
    return { msb: 0xFF, lsb: 0xFF };
  }
  /* Break into MSB and LSB */
  const msb = (periodCount >> SHIFT_BYTE_ONE) & MASK_BYTE_ONE;
  const lsb = (periodCount & MASK_BYTE_ONE);
  return { msb, lsb };
}
/* Returns the channel word given an array of channel indices */
export function channelArrayToWord(channelArray: number[]): number {
  let channelWord = 0;
  /* Iterate through the channels */
  for (let i = 0; i < channelArray.length; i++) {
    channelWord |= (0x01 << channelArray[i]);
  }
  return channelWord;
}

/* Create the start packet from a list of sensors */
export function encodeStartPacket(sampleRate: number, sensorList: sensorListType): number[] {
  /* Array to return */
  const startPacket = [];
  /* Iterate over each sensor */
  const sensorIds = Object.keys(sensorList);
  for (let i = 0; i < sensorIds.length; i++) {
    /* Get the specific sensor */
    const sensorId = parseInt(sensorIds[i], 10);
    const sensor = sensorList[sensorId];
    /* Ensure the sensor is active */
    if (sensor.active) {
      /* get the channels */
      const channels = channelArrayToWord(sensor.channels);
      /* Get the dynamic params */
      const paramList = [];
      const paramKeys = Object.keys(sensor.dynamicParams);
      const numParams = paramKeys.length;
      for (let j = 0; j < numParams; j++) {
        /* Get the address and value */
        const { address, value } = sensor.dynamicParams[paramKeys[j]];
        /* Order is important here */
        paramList.push(address, value);
      }
      /* Push each sensor to the start packet */
      startPacket.push(sensorId, channels, numParams, ...paramList);
    }
  }
  /* Only add start bytes if there are active sensors */
  if (startPacket.length) {
    /* Get the period count */
    const { msb, lsb } = sampleRateToPeriodCount(sampleRate);
    startPacket.unshift(CMD_START, msb, lsb);
  }
  /* Return the start packet */
  return startPacket;
}

/* Create the stop packet. Currently the stop packet does not depend on the sensorList */
// eslint-disable-next-line no-unused-vars
export function encodeStopPacket(sensorList: sensorListType): number[] {
  return [CMD_STOP];
}

type settingsSuccessT = {
  success: true,
  payload: {
    numChannels: number,
    periodLength: number,
    scalingConstant: number,
    gain: number,
    offset: number[]
  }
};
type settingsFailedT = {
  success: false,
  error: string
};
type settingsResultT = settingsSuccessT | settingsFailedT;
/* Extract sensor settings from the state */
export function getSensorSettingsFromState(sensors: sensorListType): settingsResultT {
  /* Extract params - Currently only looking for the first sensor */
  const periodLength = 0.1; /* TODO: dynamically select */
  /* Iterate through each sensor */
  const sensorsIdList = Object.keys(sensors);
  for (let i = 0; i < sensorsIdList.length; i++) {
    /* Get the specific sensor */
    const sensorId = parseInt(sensorsIdList[i], 10);
    const sensor = sensors[sensorId];
    /* Ensure the sensor is active */
    if (sensor.active) {
      const numChannels = sensor.channels.length;
      const { gain, scalingConstant, offset } = sensor;
      /* Return success */
      return {
        success: true,
        payload: {
          numChannels,
          periodLength,
          scalingConstant,
          gain,
          offset
        }
      };
    }
  }
  /* No active devices */
  return { success: false, error: 'No active devices found' };
}

/* [] - END OF FILE */
