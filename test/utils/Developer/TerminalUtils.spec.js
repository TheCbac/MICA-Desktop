/* @flow */
/* **********************************************************
* File: test/utils/Developer/TerminalUtils.spec.js
*
* Brief: Tests for TerminalUtils.js
*
* Authors: Craig Cheney
*
* 2017.11.06 CC - Document created
*
********************************************************* */
import {
  hexToString
} from '../../../app/utils/Developer/TerminalUtils';


/* Test suite */
describe('TerminalUtils', () => {
  describe('hexToString', () => {
    it('Should convert a number to ascii string', () => {
      expect(hexToString(0x10)).toBe('10');
      expect(hexToString(0xFF)).toBe('FF');
      expect(hexToString(0xAA)).toBe('AA');
      expect(hexToString(0x60)).toBe('60');
    });
    it('Should pad single character inputs', () => {
      expect(hexToString(0x00)).toBe('00');
      expect(hexToString(0x01)).toBe('01');
      expect(hexToString(0x02)).toBe('02');
      expect(hexToString(0x03)).toBe('03');
      expect(hexToString(0x04)).toBe('04');
    });
    it('Should convert arrays', () => {
      expect(hexToString([])).toBe('');
      expect(hexToString([0x00])).toBe('00');
      expect(hexToString([0x00, 0x01, 0x02])).toBe('00:01:02');
      expect(hexToString([0x00, 0x01, 0x03, 0x04])).toBe('00:01:03:04');
      expect(hexToString([0x00, 0x01, 0xFF, 0xAA])).toBe('00:01:FF:AA');
    });
    it('Should convert buffers', () => {
      let data = Buffer.from([0x00, 0x01, 0xFF, 0xAA]);
      expect(hexToString(data)).toBe('00:01:FF:AA');
      data = Buffer.from([0x00]);
      expect(hexToString(data)).toBe('00');
    });
  });
});
/* [] - END OF FILE */
