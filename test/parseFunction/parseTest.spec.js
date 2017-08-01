// @flow
/* **********************************************************
* File: test/parseDataPacket/parseDataPacket.spec.js
*
* Brief: Test for data packet parsing function
*
* Author: George Whitfield
* Date: 2017.07.31
*
**********************************************************/
// with rewire, two files within the same directory cannot have the same name, even
// the extensions are dirrent.

import { spy } from 'sinon';
const rewire = require('rewire');
import scanRewire from './parseDataPacket';

// the path given for rewire needs to be relative to where rewire is installed on the computer
const actions = rewire('/Users/George/srv_bilab/micaReactElectron/test/parseFunction/parseDataPacket');

// Fake Data
const peripheralId = 6;
const data = [1, 2, 3, 4, 5, 23423, 23424, 5, 455, 65657, 5757, 4564, 45345, 45453, 34554, 345];
const numChannels = 5;
const periodLength = 3;
const packetTime = 1;
const scalingConstant = 1;
const gain = 1;
const offset = 1;

// Defining variables from parsePacketData.js
const LOW_NIBBLE_MASK = actions.__get__('LOW_NIBBLE_MASK');
const HALF_BYTE_SHIFT = actions.__get__('HALF_BYTE_SHIFT');
const BYTE_SHIFT = actions.__get__('BYTE_SHIFT');
const ROLLUNDER_FLAG = actions.__get__('ROLLUNDER_FLAG');
const BITS_12 = actions.__get__('BITS_12');
const IS_ODD = actions.__get__('IS_ODD');

const parseSpy = spy(actions.parseDataPacket);

describe('parseDataPacket.js test', () => {
  describe('Test variables', () => {
    it('LOW_NIBBLE_MASK', () => {
      expect(LOW_NIBBLE_MASK).toEqual(0x0F);
    });
    it('HAlF_BYTE_SHIFT', () => {
      expect(HALF_BYTE_SHIFT).toEqual(4);
    });
    it('BYTE_SHIFT', () => {
      expect(BYTE_SHIFT).toEqual(8);
    });
    it('ROLLUNDER_FLAG', () => {
      expect(ROLLUNDER_FLAG).toEqual(0x08);
    });
    it('BITS_12', () => {
      expect(BITS_12).toEqual(12);
    });
    it('IS_ODD', () => {
      expect(IS_ODD).toEqual(0x01);
    });
  });
  describe('parseDataPacket function', () => {
    it('Does not throw an error', () => {
      expect(parseSpy.withArgs(
        peripheralId,
        data,
        numChannels,
        periodLength,
        packetTime,
        scalingConstant,
        gain,
        offset
        )).not.toThrow();
    });
    it('Returns coorect t value in dataArray', () => {

    });
    it('Returns correct d value in dataArray', () => {

    });
    it('Time differential is calculated correctly', () => {

    });
    it('rawdData is calculated correctly', () => {

    });
    it('Returns the correct error when function throws', () => {

    });
  });
});

