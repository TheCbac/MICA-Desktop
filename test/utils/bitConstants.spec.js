// @flow
/* eslint no-bitwise: 0 */
/* **********************************************************
* File: test/utils/bitConstants.spec.js
*
* Brief: Tests for Bit constants
*
* Authors: Craig Cheney
*
* 2017.09.21 CC - Document created
*
********************************************************* */
import {
  MASK_BIT_ODD,
  MASK_NIBBLE_LOW,
  MASK_NIBBLE_HIGH,
  MASK_BYTE_ONE,
  MASK_BYTE_TWO,
  SHIFT_BIT_ONE,
  SHIFT_BIT_TWO,
  SHIFT_BYTE_HALF,
  SHIFT_BYTE_ONE,
  SHIFT_BYTE_TWO,
  FLAG_DATA_ROLLUNDER
} from '../../app/utils/bitConstants';

describe('bitConstants.spec.js', () => {
  describe('Masks', () => {
    it('Should have an odd bit mask', () => {
      expect(0x01 & MASK_BIT_ODD).toBeTruthy();
      expect(0x10 & MASK_BIT_ODD).toBeFalsy();
    });
    it('Should have a low nibble mask', () => {
      expect(0xFF & MASK_NIBBLE_LOW).toEqual(0x0F);
      expect(0xF0 & MASK_NIBBLE_LOW).toEqual(0x00);
      expect(0x56 & MASK_NIBBLE_LOW).toEqual(0x06);
    });
    it('Should have a high nibble mask', () => {
      expect(0xFF & MASK_NIBBLE_HIGH).toEqual(0xF0);
      expect(0xF0 & MASK_NIBBLE_HIGH).toEqual(0xF0);
      expect(0x56 & MASK_NIBBLE_HIGH).toEqual(0x50);
      expect(0xFF56 & MASK_NIBBLE_HIGH).toEqual(0x50);
    });
    it('Should have a one byte mask', () => {
      expect(0xFFFF & MASK_BYTE_ONE).toEqual(0xFF);
      expect(0xF005 & MASK_BYTE_ONE).toEqual(0x05);
      expect(0x5600 & MASK_BYTE_ONE).toEqual(0x00);
    });
    it('Should have a two byte mask', () => {
      expect(0xFFFFFF & MASK_BYTE_TWO).toEqual(0xFFFF);
      expect(0xFFF005 & MASK_BYTE_TWO).toEqual(0xF005);
      expect(0x005600 & MASK_BYTE_TWO).toEqual(0x5600);
    });
  });
  describe('Shifts', () => {
    it('should have a one bit shift', () => {
      expect(0b01 << SHIFT_BIT_ONE).toEqual(0b10);
      expect(0b10 << SHIFT_BIT_ONE).toEqual(0b100);
      expect(0b11 << SHIFT_BIT_ONE).toEqual(0b110);
    });
    it('should have a two bit shift', () => {
      expect(0b01 << SHIFT_BIT_TWO).toEqual(0b100);
      expect(0b10 << SHIFT_BIT_TWO).toEqual(0b1000);
      expect(0b11 << SHIFT_BIT_TWO).toEqual(0b1100);
    });
    it('should have a half byte shift', () => {
      expect(0x01 << SHIFT_BYTE_HALF).toEqual(0x10);
      expect(0x0F << SHIFT_BYTE_HALF).toEqual(0xF0);
      expect(0xF0 << SHIFT_BYTE_HALF).toEqual(0xF00);
    });
    it('should have a one byte shift', () => {
      expect(0x01 << SHIFT_BYTE_ONE).toEqual(0x0100);
      expect(0x0F << SHIFT_BYTE_ONE).toEqual(0x0F00);
      expect(0xF0 << SHIFT_BYTE_ONE).toEqual(0xF000);
    });
    it('should have a two byte shift', () => {
      expect(0x01 << SHIFT_BYTE_TWO).toEqual(0x010000);
      expect(0x0F << SHIFT_BYTE_TWO).toEqual(0x0F0000);
      expect(0xF0 << SHIFT_BYTE_TWO).toEqual(0xF00000);
    });
  });
  describe('Flags', () => {
    it('should have a data rollunder flag', () => {
      expect(0x08 & FLAG_DATA_ROLLUNDER).toBeTruthy();
      expect(0x01 & FLAG_DATA_ROLLUNDER).toBeFalsy();
      expect(0xFF & FLAG_DATA_ROLLUNDER).toBeTruthy();
    });
  });
});
/* [] - END OF FILE */
