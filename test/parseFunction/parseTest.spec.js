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

import sinon from 'sinon';

// rewire module can acess non-exported variables
const rewire = require('rewire');

// the path given for rewire needs to be relative to where rewire is on the computer I believe.
const actions = rewire('/Users/George/srv_bilab/micaReactElectron/test/parseFunction/parseDataPacket');
// Fake Data

const newPacketTimeVariable = newPacketTime();

function newPacketTime() {
  const packetTime = new Date();
  packetTime.microsecond = 0;
  packetTime.lastLogged = null;
  /* Modify packetTime for microseconds */
  packetTime.addMicroseconds = function (usec) {
    let micro = usec + this.microsecond;
    console.log(this.microsecond);
    console.log('This.microsecond^^^^^^^^^^^^^^^^^');
    let millisecond = Math.floor(micro/1000);
    this.setTime(this.getTime() + millisecond);
    console.log(this.getTime());
    console.log('This.getTime()^^^^^^^^^^^^^^^');
    this.microsecond = (micro % 1000);
    return this.microsecond;
  };
  // Look into 'extends'
  packetTime.getMicroseconds = function () {
    return this.microsecond;
  };
  /* returns the timestamp with microseconds */
  packetTime.getTimeMicro = function () {
    return Number(this.getTime()+ "." + this.microsecond);
  };

  return packetTime;
}

const peripheralId = 6;
    // the data array is an array of 8 bit integers
const data = [110, 209, 90, 88, 130, 77, 34, 102];
const numChannels = 5;
const periodLength = 24;
const scalingConstant = 5;
const gain = 1;
const offset = function (numChannelsVariable) {
  let i;
  let offSetArray = [];
  for (i = 0; i < numChannelsVariable; i++) {
    offSetArray.push(0);
  }
  return offSetArray;
};
// Defining variables from parsePacketData.js
const LOW_NIBBLE_MASK = actions.__get__('LOW_NIBBLE_MASK');
const HALF_BYTE_SHIFT = actions.__get__('HALF_BYTE_SHIFT');
const BYTE_SHIFT = actions.__get__('BYTE_SHIFT');
const ROLLUNDER_FLAG = actions.__get__('ROLLUNDER_FLAG');
const BITS_12 = actions.__get__('BITS_12');
const IS_ODD = actions.__get__('IS_ODD');

const parseSpy = sinon.spy(actions.parseDataPacket);

describe('parseDataPacket.js test', () => {
  describe('Test variables', () => {
    // sinon.useFakeTimers(123456);
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
        newPacketTimeVariable,
        scalingConstant,
        gain,
        offset
        )).not.toThrow();
    });
    it('Returns coorect values in dataArray', () => {
      expect(parseSpy.withArgs(
        peripheralId,
        data,
        numChannels,
        periodLength,
        newPacketTimeVariable,
        scalingConstant,
        gain,
        offset
      ).returned([{
        t: 1501785157331.797,
        d: [
          0.0034602076124567475,
          -0.0025367833587011668,
          -0.002485089463220676,
          -0.0075075075075075074,
          0.00909090909090909
        ]
      }])).toBe(true);
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

/* ********Notes********** /*
*
*   - need to find some way to assert values of timeMSB/LSB and dataMSB/LSB
*
*
*
*
*************************/
