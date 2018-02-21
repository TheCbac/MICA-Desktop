/* @flow */
/* **********************************************************
* File: test/utils/Developer/SerialCommands.spec.js
*
* Brief: Tests for SerialCommands
*
* Authors: Craig Cheney
*
* 2017.11.17 CC - Document created
*
********************************************************* */
import {
  isMicaSerialDevice
} from '../../../app/utils/Developer/SerialCommands';
import {
  MICA_CYPRESS_PID, MICA_CYPRESS_VID
} from '../../../app/utils/dataStreams/packets';

describe('SerialCommands.js', () => {
  describe('isMicaSerialDevice', () => {
    it('should accept valid PID and VID', () => {
      let pid = '0002';
      let vid = '04B4';
      expect(isMicaSerialDevice(pid, vid)).toBeTruthy();

      pid = '2';
      vid = '4b4';
      expect(isMicaSerialDevice(pid, vid)).toBeTruthy();

      pid = '000002';
      vid = '4B4';
      expect(isMicaSerialDevice(pid, vid)).toBeTruthy();
    });
    it('should reject invalid PID and VID', () => {
      let pid = '0001';
      let vid = '04B4';
      expect(isMicaSerialDevice(pid, vid)).toBeFalsy();

      pid = '0002';
      vid = '4b5';
      expect(isMicaSerialDevice(pid, vid)).toBeFalsy();

      pid = undefined;
      vid = '4b5';
      expect(isMicaSerialDevice(pid, vid)).toBeFalsy();

      pid = 'undefined';
      vid = '4b5';
      expect(isMicaSerialDevice(pid, vid)).toBeFalsy();
    });
  });
});
/* [] - END OF FILE */
