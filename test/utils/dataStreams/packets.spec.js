/* @flow */
/* **********************************************************
* File: /test/utils/dataStreams/packets.spec.js
*
* Brief: Tests for packets.js
*
* Authors: Craig Cheney
*
* 2017.11.07 CC - Document created
*
********************************************************* */
import {
  createMicaPacket, calcChecksum16,
  MICA_PACKET_ID_MODULE_CONTROL,
  MICA_PACKET_SYM_START,
  MICA_PACKET_SYM_END
} from '../../../app/utils/dataStreams/packets';
import {
  MICA_PACKET_CTRL_CMD_BOOT
} from '../../../app/utils/dataStreams/controlCommands';


describe('Packets', () => {
  describe('createMicaPackets', () => {
    it('Should construct a packet with no payload', () => {
      const packet = createMicaPacket(MICA_PACKET_ID_MODULE_CONTROL, MICA_PACKET_CTRL_CMD_BOOT);
      expect(packet[0]).toBe(MICA_PACKET_SYM_START);
      expect(packet[1]).toBe(MICA_PACKET_ID_MODULE_CONTROL);
      expect(packet[2]).toBe(MICA_PACKET_CTRL_CMD_BOOT);
      expect(packet[3]).toBe(0);
      expect(packet[4]).toBe(0);
      expect(packet[packet.length - 1]).toBe(MICA_PACKET_SYM_END);
    });
  });
  describe('calcChecksum16', () => {
    it('Should calculate the correct 16 bit checksum', () => {
      /* Taken from BLE OTA log */
      let data = [0x01, 0x38, 0x00, 0x00];
      let { msb, lsb } = calcChecksum16(data);
      expect(msb).toBe(0xFF);
      expect(lsb).toBe(0xC7);
      /* Line 180 of OTA2.log - WHICH IS INCORRECT IN LOG */
      data = [0x01, 0x00, 0x32, 0xAA, 0x11, 0x6D, 0x1A, 0x00, 0x32, 0x01, 0x01];
      ({ msb, lsb } = calcChecksum16(data));
      expect(msb).toBe(0xFE);
      expect(lsb).toBe(0x57); // Not 0x81 as reported

      data = [0x01, 0x00, 0x04, 0x00, 0x0F, 0x00, 0xFF, 0x01];
      ({ msb, lsb } = calcChecksum16(data));
      expect(msb).toBe(0xFE);
      expect(lsb).toBe(0xEC);
    });
  });
});

/* [] - END OF FILE */
