/* @flow */
/* **********************************************************
* File: /test/utils/dataStreams/controlCommands.spec.js
*
* Brief: Tests for serial control module subCommands
*
* Authors: Craig Cheney
*
* 2017.11.09 CC - Document created
*
********************************************************* */
import {
  ledCmd,
  MICA_PACKET_CTRL_CMD_LED,
} from '../../../app/utils/dataStreams/controlCommands';
import {
  MICA_PACKET_ID_MODULE_CONTROL,
} from '../../../app/utils/dataStreams/packets';

const { generatePacketObj: ledPacket } = ledCmd;
const ledTerminalCommand = {
  args: { '0': 'leds' },
  flags: {},
  input: 'serial leds',
  name: 'serial'
};

describe('controlCommands.spec.js', () => {
  describe('ledCmd', () => {
    it('should accept inputs for the LED mask, and RGB values', () => {
      const args = { '0': 'leds', '1': '7', '2': 'FF', '3': 'FF', '4': 'FF' };
      const packet = ledPacket({ ...ledTerminalCommand, args });
      /* Unpack the output */
      const { output, packetObj: { payload, moduleId, command } } = packet;
      expect(moduleId).toBe(MICA_PACKET_ID_MODULE_CONTROL);
      expect(command).toBe(MICA_PACKET_CTRL_CMD_LED);


      expect(output).toBe('07:FF:FF:FF');
      expect(payload).toEqual([0x07, 0xFF, 0xFF, 0xFF]);
    });
    it('should accept zero valued inputs', () => {
      const args = { '0': 'leds', '1': '7', '2': '0', '3': '00', '4': 'FF' };
      const packet = ledPacket({ ...ledTerminalCommand, args });
      /* Unpack the output */
      const { output, packetObj: { payload } } = packet;
      expect(output).toBe('07:00:00:FF');
      expect(payload).toEqual([0x07, 0x00, 0x00, 0xFF]);
    });
    it('should reject invalid payloads', () => {
      const args = { '0': 'leds', '1': '7', '2': '0', '3': '00', '4': 'FF1' };
      const packet = ledPacket({ ...ledTerminalCommand, args });
      /* Unpack the output */
      const { output, binary } = packet;
      expect(output).toBe('Error: Payload value exceeds 8-bits');
      expect(binary).toEqual([]);
    });
    it('should accept incomplete inputs', () => {
      const args = { '0': 'leds', '1': '7', '2': '0', '3': '00' };
      const packet = ledPacket({ ...ledTerminalCommand, args });
      /* Unpack the output */
      const { output, packetObj: { payload } } = packet;
      expect(output).toContain('07:00:00');
      expect(payload.slice(0, 3)).toEqual([0x07, 0x00, 0x00]);
      expect(payload && payload[3] >= 0 && payload[3] <= 255).toBeTruthy();
    });
  });
});

/* [] - END OF FILE */
