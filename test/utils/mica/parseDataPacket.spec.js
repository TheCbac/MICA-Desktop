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
  sampleRateToPeriodCount
} from '../../../app/utils/mica/parseDataPacket';

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
});
/* [] - END OF FILE */
