/* @flow */
/* **********************************************************
* File: /test/utils/dataStreams/commCommands.spec.js
*
* Brief: Tests for serial communication module subCommands
*
* Authors: Craig Cheney
*
* 2017.11.09 CC - Document created
*
********************************************************* */
import {
  connectCmd,
  MICA_PACKET_CMD_COMM_SCAN,
  MICA_PACKET_CMD_COMM_CONN
} from '../../../app/utils/dataStreams/commCommands';
import {
  MICA_PACKET_ID_MODULE_COMM,
} from '../../../app/utils/dataStreams/packets';
import { parseInput } from '../../../app/utils/Developer/TerminalUtils';


const { generatePacketObj: createConnectPacket } = connectCmd;

describe('commCommands.js', () => {
  describe('connectBleDevice', () => {
    it('should accept valid commands', () => {
      let input = 'serial connect 0 CB:AC:00:D1:5B:0E';
      let packet = createConnectPacket(parseInput(input));
      /* Unpack the output */
      let { output, packetObj: { payload, moduleId, command } } = packet;
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('');
      expect(payload).toEqual([0x00, 0x0E, 0x5B, 0xD1, 0x00, 0xAC, 0xCB]);

      input = 'serial connect 1 CB:AC:00:D1:5B:0E';
      packet = createConnectPacket(parseInput(input));
      /* Unpack the output */
      ({ output, packetObj: { payload, moduleId, command } } = packet);
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('');
      expect(payload).toEqual([0x01, 0x0E, 0x5B, 0xD1, 0x00, 0xAC, 0xCB]);

      input = 'serial connect 00 CB:AC:00:D1:5B:0E';
      packet = createConnectPacket(parseInput(input));
      /* Unpack the output */
      ({ output, packetObj: { payload, moduleId, command } } = packet);
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('');
      expect(payload).toEqual([0x00, 0x0E, 0x5B, 0xD1, 0x00, 0xAC, 0xCB]);
    });
    it('should reject invalid address types', () => {
      let input = 'serial connect 2 CB:AC:00:D1:5B:0E';
      let packet = createConnectPacket(parseInput(input));
      let { output, packetObj: { payload, moduleId, command } } = packet;
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('Error: invalid address type');
      expect(payload).toBeUndefined();

      input = 'serial connect 10 CB:AC:00:D1:5B:0E';
      packet = createConnectPacket(parseInput(input));
      ({ output, packetObj: { payload, moduleId, command } } = packet);
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('Error: invalid address type');
      expect(payload).toBeUndefined();
    });
    it('should reject invalid addresses', () => {
      let input = 'serial connect 0 CB:AC:00:D1:5B';
      let packet = createConnectPacket(parseInput(input));
      let { output, packetObj: { payload, moduleId, command } } = packet;
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('Error: invalid address');
      expect(payload).toBeUndefined();

      input = 'serial connect 0 CBAC00D15B0E';
      packet = createConnectPacket(parseInput(input));
      ({ output, packetObj: { payload, moduleId, command } } = packet);
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('Error: invalid address');
      expect(payload).toBeUndefined();

      input = 'serial connect 0 CB:AC:00:D1:5B:ZZ';
      packet = createConnectPacket(parseInput(input));
      ({ output, packetObj: { payload, moduleId, command } } = packet);
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_COMM);
      expect(command).toBe(MICA_PACKET_CMD_COMM_CONN);
      expect(output).toBe('Error: invalid address');
      expect(payload).toBeUndefined();
    });
  });
});

/* [] - END OF FILE */
