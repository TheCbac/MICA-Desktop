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
import {
  twosCompToSigned,
  sampleRateToPeriodCount,
  channelArrayToWord,
  encodeStartPacket
} from '../../../app/utils/mica/parseDataPacket';
import {
  CMD_START
} from '../../../app/utils/mica/micaConstants';
import type { sensorParamType, sensorListType } from '../../../app/types/paramTypes';

const accId = 0x01;
const accSensor: sensorParamType = {
  name: 'Accelerometer',
  active: true,
  channels: [
    0
  ],
  scalingConstant: 0.004784999880939722,
  gain: 0.5,
  offset: 0,
  units: 'm/s^2',
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

const gyrId = 0x02;
const gyrSensor: sensorParamType = {
  name: 'Gyroscope',
  active: false,
  channels: [
    0
  ],
  scalingConstant: 0.03406799957156181,
  gain: 1,
  offset: 0,
  units: 'rad/s',
  dynamicParams: {
    range: {
      address: 15,
      value: 0
    }
  }
};

/* Test suite */
describe('parseDataPacket.spec.js', () => {
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
  describe('channelArrayToWord', () => {
    it('Channel Array to word produces the correct result', () => {
      expect(channelArrayToWord([])).toEqual(0);
      expect(channelArrayToWord([0])).toEqual(1);
      expect(channelArrayToWord([1])).toEqual(2);
      expect(channelArrayToWord([0, 1])).toEqual(3);
      expect(channelArrayToWord([2])).toEqual(4);
      expect(channelArrayToWord([0, 2])).toEqual(5);
      expect(channelArrayToWord([1, 2])).toEqual(6);
      expect(channelArrayToWord([0, 1, 2])).toEqual(7);
    });
  });
  describe('encodeStartPacket', () => {
    /* Format: startCommand, pcMSB, pcLSB, sensorId, channels, numParams, params */
    it('Return start packet for one sensor with no params', () => {
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
      const accWithParam = { ...accSensor, channels: [0, 1] };
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
      const acc = { ...accSensor, channels: [2] };
      const gyr = { ...gyrSensor, channels: [0, 2] };
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
  });
});
/* [] - END OF FILE */
