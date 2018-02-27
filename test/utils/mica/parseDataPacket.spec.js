// @flow
/* **********************************************************
* File: test/utils/mica/parseDataPacket.spec.js
*
* Brief: Test the parsing functionality for arriving packets
*
* Authors: Craig Cheney
*
* 2017.09.20 CC - Document created
*
********************************************************* */
import { TimeEvent } from 'pondjs';
import {
  parseDataPacket2,
  twosCompToSigned,
  sampleRateToPeriodCount,
  channelObjToWord,
  encodeStartPacket,
  encodeStopPacket
} from '../../../app/utils/mica/parseDataPacket';
import {
  CMD_START,
  CMD_STOP
} from '../../../app/utils/mica/micaConstants';
import { channelArrayToObj } from '../../factories/factories';
import type { sensorParamType, sensorListType } from '../../../app/types/paramTypes';

const accId = 0x01;
const gyrId = 0x02;
/* Return an accelerometer */
function accFactory(): sensorParamType {
  return {
    name: 'Accelerometer',
    active: true,
    channels: {
      '0': { active: true, name: 'X', offset: 0 },
      '1': { active: false, name: 'Y', offset: 0 },
      '2': { active: false, name: 'Z', offset: 0 },
    },
    scalingConstant: 0.004784999880939722,
    gain: 0.5,
    units: 'm/s^2',
    sampleRate: 100,
    dynamicParams: {
      range: {
        address: 15,
        value: 3
      },
      bandwidth: {
        address: 16,
        value: 11
      }
    }
  };
}

/* Return a gyroscope  */
function gyrFactory(): sensorParamType {
  return {
    name: 'Gyroscope',
    active: true,
    channels: {
      '0': { active: true, name: 'X', offset: 0 },
      '1': { active: false, name: 'Y', offset: 0 },
      '2': { active: false, name: 'Z', offset: 0 },
    },
    scalingConstant: 0.03406799957156181,
    gain: 1,
    units: 'rad/s',
    sampleRate: 100,
    dynamicParams: {
      range: {
        address: 15,
        value: 0
      }
    }
  };
}

/* Test suite */
describe('parseDataPacket.spec.js', () => {
  describe('parseDataPacket', () => {
    it('should parse a simple one value data packet', () => {
      const tMSB = 0x8F;
      const tLSB = 0x00;
      const dMSB = 0xBF;
      const dLSB = 0xB0;
      const simplePacket = new Buffer([tMSB, tLSB, dMSB, dLSB]);
      /* Parse the packet */
      const accSensor = accFactory();
      const { scalingConstant, channels, gain, sampleRate } = accSensor;
      const periodLength = 1 / sampleRate;
      const startTime = new Date().getTime();
      const dataArray = parseDataPacket2(simplePacket, channels, periodLength, scalingConstant, gain, startTime);
      /* Evaluate */
      expect(dataArray.length).toBe(1);
      const dataPoint = dataArray[0];
      const timeStamp = dataPoint.toPoint()[0];
      const sample = dataPoint.toPoint()[1];
      /* Expected value */
      const accValue = -9.847;
      const timeDiff = -1.808; /* Milliseconds */
      expect(sample).toBeCloseTo(accValue);
      expect(timeStamp).toBe(Math.round(startTime + timeDiff));
      expect(dataPoint.toJSON().data.X).toBeCloseTo(accValue);
    });
    it('should parse a three channel data packet', () => {
      const tMSB = 0x8F;
      const tLSB = 0x00;
      const d1 = 0xBF;
      const d12 = 0xBB;
      const d2 = 0xFB;
      const d3 = 0x40;
      const d34 = 0x50;
      const simplePacket = new Buffer([tMSB, tLSB, d1, d12, d2, d3, d34]);
      const acc = accFactory();
      acc.channels['0'].active = true;
      acc.channels['1'].active = true;
      acc.channels['2'].active = true;
      /* Parse the packet */
      const { scalingConstant, channels, gain, sampleRate } = acc;
      const periodLength = 1 / sampleRate;
      const startTime = new Date().getTime();
      const dataArray = parseDataPacket2(simplePacket, channels, periodLength, scalingConstant, gain, startTime);
      /* Evaluate */
      expect(dataArray.length).toBe(1);
      const dataPoint = dataArray[0];
      const timeStamp = dataPoint.toPoint()[0];
      /* Expected value */
      const accValue = -9.847;
      const timeDiff = -1.808; /* Milliseconds */
      expect(timeStamp).toBe(Math.round(startTime + timeDiff));
      expect(dataPoint.toJSON().data.X).toBeCloseTo(accValue);
      expect(dataPoint.toJSON().data.Y).toBeCloseTo(accValue);
      expect(dataPoint.toJSON().data.Z).toBeCloseTo(-accValue);
    });
  });
  describe('Two Complement', () => {
    /* Two's Complement */
    it('twosCompToSigned returns the correct values', () => {
      expect(twosCompToSigned(23, 8)).toEqual(23);
      expect(twosCompToSigned(233, 8)).toEqual(-23);
      expect(twosCompToSigned(128, 8)).toEqual(-128);
      expect(twosCompToSigned(3840, 12)).toEqual(-256);
      expect(twosCompToSigned(467, 12)).toEqual(467);
    });
  });
  describe('Period Count', () => {
    it('sampleRateToPeriodCount returns the correct values', () => {
      let { msb, lsb } = sampleRateToPeriodCount(100000);
      expect(msb).toEqual(0x00);
      expect(lsb).toEqual(0x01);
      ({ msb, lsb } = sampleRateToPeriodCount(1000));
      expect(msb).toEqual(0x00);
      expect(lsb).toEqual(0x64);
      ({ msb, lsb } = sampleRateToPeriodCount(525));
      expect(msb).toEqual(0x00);
      expect(lsb).toEqual(0xBE);
      ({ msb, lsb } = sampleRateToPeriodCount(100));
      expect(msb).toEqual(0x03);
      expect(lsb).toEqual(0xE8);
      ({ msb, lsb } = sampleRateToPeriodCount(10));
      expect(msb).toEqual(0x27);
      expect(lsb).toEqual(0x10);
    });
    it('SampleRateToPeriodCount should clip very low sample rates', () => {
      let { msb, lsb } = sampleRateToPeriodCount(1);
      expect(msb).toEqual(0xFF);
      expect(lsb).toEqual(0xFF);
      ({ msb, lsb } = sampleRateToPeriodCount(1.5));
      expect(msb).toEqual(0xFF);
      expect(lsb).toEqual(0xFF);
      ({ msb, lsb } = sampleRateToPeriodCount(2));
      expect(msb).toEqual(0xC3);
      expect(lsb).toEqual(0x50);
    });
  });
  describe('channelObjToWord', () => {
    it('Channel Array to word produces the correct result', () => {
      expect(channelObjToWord(channelArrayToObj([]))).toEqual(0);
      expect(channelObjToWord(channelArrayToObj([0]))).toEqual(1);
      expect(channelObjToWord(channelArrayToObj([1]))).toEqual(2);
      expect(channelObjToWord(channelArrayToObj([0, 1]))).toEqual(3);
      expect(channelObjToWord(channelArrayToObj([2]))).toEqual(4);
      expect(channelObjToWord(channelArrayToObj([0, 2]))).toEqual(5);
      expect(channelObjToWord(channelArrayToObj([1, 2]))).toEqual(6);
      expect(channelObjToWord(channelArrayToObj([0, 1, 2]))).toEqual(7);
    });
  });
  describe('encodeStartPacket', () => {
    /* Format: startCommand, pcMSB, pcLSB, sensorId, channels, numParams, params */
    it('Return start packet for one sensor with no params', () => {
      const accSensor = accFactory();
      const accNoParam = { ...accSensor, dynamicParams: {} };
      const sensorList: sensorListType = {};
      sensorList[accId] = accNoParam;
      const sampleRate = 100;
      /* Result constants */
      const msb = 0x03;
      const lsb = 0xE8;
      const sensorId = 0x01;
      const channels = 0x01;
      const numParams = 0x00;
      /* Test */
      expect(encodeStartPacket(sampleRate, sensorList)).toEqual([
        CMD_START, msb, lsb, sensorId, channels, numParams
      ]);
    });
    it('Return start packet for one sensor with params', () => {
      const accSensor = accFactory();
      const accWithParam = { ...accSensor, channels: channelArrayToObj([0, 1]) };
      const sensorList: sensorListType = {};
      sensorList[accId] = accWithParam;
      const sampleRate = 10;
      /* Result constants */
      const msb = 0x27;
      const lsb = 0x10;
      const sensorId = 0x01;
      const channels = 0x03;
      const numParams = 0x02;
      const params = [15, 3, 16, 11];
      /* Test */
      expect(encodeStartPacket(sampleRate, sensorList)).toEqual([
        CMD_START, msb, lsb, sensorId, channels, numParams, ...params
      ]);
    });
    it('Return start packet for two sensor with params', () => {
      const accSensor = accFactory();
      const gyrSensor = gyrFactory();
      const acc = { ...accSensor, channels: channelArrayToObj([2]) };
      const gyr = { ...gyrSensor, channels: channelArrayToObj([0, 2]) };
      const sensorList: sensorListType = {};
      sensorList[accId] = acc;
      sensorList[gyrId] = gyr;
      const sampleRate = 525;
      const msb = 0x00;
      const lsb = 0xBE;
      /* Acc Result constants */
      const aSensorId = 0x01;
      const aChannels = 0x04;
      const aNumParams = 0x02;
      const aParams = [15, 3, 16, 11];
      /* Gyr result constants */
      const gSensorId = 0x02;
      const gChannels = 0x05;
      const gNumParams = 0x01;
      const gParams = [15, 0];
      /* Test */
      expect(encodeStartPacket(sampleRate, sensorList)).toEqual([
        CMD_START, msb, lsb,
        aSensorId, aChannels, aNumParams, ...aParams,
        gSensorId, gChannels, gNumParams, ...gParams
      ]);
    });
    it('Do not include inactive sensors', () => {
      const accSensor = accFactory();
      const gyrSensor = gyrFactory();
      const acc = { ...accSensor, channels: channelArrayToObj([2]) };
      const gyr = { ...gyrSensor, active: false };
      const sensorList: sensorListType = {};
      sensorList[accId] = acc;
      sensorList[gyrId] = gyr;
      const sampleRate = 525;
      const msb = 0x00;
      const lsb = 0xBE;
      /* Acc Result constants */
      const aSensorId = 0x01;
      const aChannels = 0x04;
      const aNumParams = 0x02;
      const aParams = [15, 3, 16, 11];
      /* Test */
      expect(encodeStartPacket(sampleRate, sensorList)).toEqual([
        CMD_START, msb, lsb,
        aSensorId, aChannels, aNumParams, ...aParams
      ]);
    });
    it('Inactive sensors should return an empty array', () => {
      const accSensor = accFactory();
      const gyrSensor = gyrFactory();
      const acc = { ...accSensor, active: false };
      const gyr = { ...gyrSensor, active: false };
      const sensorList: sensorListType = {};
      const sampleRate = 525;
      /* Create the sensor array */
      sensorList[accId] = acc;
      sensorList[gyrId] = gyr;
      /* Test */
      expect(encodeStartPacket(sampleRate, sensorList)).toEqual([]);
    });
  });
  describe('Encode stop packet', () => {
    it('Should return the correct stop packet', () => {
      const sensorList: sensorListType = {};
      expect(encodeStopPacket(sensorList)).toEqual([CMD_STOP]);
    });
  });
});
/* [] - END OF FILE */
