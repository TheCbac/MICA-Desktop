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
  createMicaPacketBinary, parseMicaResponse, calcChecksum16,
  validateResponseHeader, validateResponseFooter,
  validateResponseChecksum, validateResponsePayload,
  validatePayload, processMicaPacketByte, resetByteParse,
  MICA_PACKET_ID_MODULE_CONTROL,
  MICA_PACKET_SYM_START,
  MICA_PACKET_SYM_END,
  MICA_PACKET_LEN_MAX_PAYLOAD
} from '../../../app/utils/dataStreams/packets';
import {
  MICA_PACKET_CMD_CTRL_BOOT
} from '../../../app/utils/dataStreams/controlCommands';


describe('Packets', () => {
  describe('validatePayload', () => {
    it('should accept valid payloads', () => {
      let payload = [0x01, 0x02, 0x03, 0xFF];
      let { success, error } = validatePayload(payload);
      expect(success).toBeTruthy();
      expect(error).toBe('');

      payload = [0x00, 0x00];
      ({ success, error } = validatePayload(payload));
      expect(success).toBeTruthy();
      expect(error).toBe('');

      payload = [];
      ({ success, error } = validatePayload(payload));
      expect(success).toBeTruthy();
      expect(error).toBe('');
    });
    it('should reject payloads that are too long', () => {
      const payload = [];
      for (let i = 0; i <= MICA_PACKET_LEN_MAX_PAYLOAD; i++) {
        payload.push(0x00);
      }
      const { success, error } = validatePayload(payload);
      expect(success).toBeFalsy();
      expect(error).toBe('Payload exceeds maximum length');
    });
    it('should reject negative values', () => {
      let payload = [0x01, -45, 0x03, 0xFF];
      let { success, error } = validatePayload(payload);
      expect(success).toBeFalsy();
      expect(error).toBe('Payload contains negative value');

      payload = [0x00, 0xEE, -25];
      ({ success, error } = validatePayload(payload));
      expect(success).toBeFalsy();
      expect(error).toBe('Payload contains negative value');

      payload = [-1, 0xEE, 0x25];
      ({ success, error } = validatePayload(payload));
      expect(success).toBeFalsy();
      expect(error).toBe('Payload contains negative value');
    });
    it('should reject non 8-bit values', () => {
      let payload = [0x01, 0x300, 0xFF];
      let { success, error } = validatePayload(payload);
      expect(success).toBeFalsy();
      expect(error).toBe('Payload value exceeds 8-bits');

      payload = [0xF01, 0xEE, 0x25];
      ({ success, error } = validatePayload(payload));
      expect(success).toBeFalsy();
      expect(error).toBe('Payload value exceeds 8-bits');

      payload = [0xF0, 0xEE, 256];
      ({ success, error } = validatePayload(payload));
      expect(success).toBeFalsy();
      expect(error).toBe('Payload value exceeds 8-bits');
    });
  });
  describe('createMicaPacketBinary', () => {
    it('Should construct a packet with no payload', () => {
      const packetObj = {
        moduleId: MICA_PACKET_ID_MODULE_CONTROL,
        command: MICA_PACKET_CMD_CTRL_BOOT
      };
      const { success, error, binary } = createMicaPacketBinary(packetObj);
      expect(success).toBeTruthy();
      expect(error).toBe('');
      expect(binary).toBeDefined();
      expect(binary[0]).toBe(MICA_PACKET_SYM_START);
      expect(binary[1]).toBe(MICA_PACKET_ID_MODULE_CONTROL);
      expect(binary[2]).toBe(MICA_PACKET_CMD_CTRL_BOOT);
      expect(binary[3]).toBe(0);
      expect(binary[4]).toBe(0);
      expect(binary[binary.length - 1]).toBe(MICA_PACKET_SYM_END);
    });
    it('Should create a packet with a payload', () => {
      const payload = [0x01, 0x02, 0x03, 0xFF];
      const packetObj = {
        moduleId: MICA_PACKET_ID_MODULE_CONTROL,
        command: MICA_PACKET_CMD_CTRL_BOOT,
        payload
      };
      const { success, error, binary } = createMicaPacketBinary(packetObj);
      expect(success).toBeTruthy();
      expect(error).toBe('');
      expect(binary[0]).toBe(MICA_PACKET_SYM_START);
      expect(binary[1]).toBe(MICA_PACKET_ID_MODULE_CONTROL);
      expect(binary[2]).toBe(MICA_PACKET_CMD_CTRL_BOOT);
      expect(binary[3]).toBe(0);
      expect(binary[4]).toBe(payload.length);
      expect(binary[5]).toBe(payload[0]);
      expect(binary[6]).toBe(payload[1]);
      expect(binary[7]).toBe(payload[2]);
      expect(binary[8]).toBe(payload[3]);
      expect(binary[binary.length - 1]).toBe(MICA_PACKET_SYM_END);
    });
    it('Should only return 8 bit values', () => {
      const payload = [0xFF, 0xFFFF, 0xA456, 0x45];
      const packetObj = {
        moduleId: MICA_PACKET_ID_MODULE_CONTROL,
        command: MICA_PACKET_CMD_CTRL_BOOT,
        payload
      };
      const { success, error, binary } = createMicaPacketBinary(packetObj);
      expect(success).toBeFalsy();
      expect(error).toBe('Payload value exceeds 8-bits');
      expect(binary).toEqual([]);
    });
  });
  describe('parseMicaResponse', () => {
    it('should validate the header', () => {
      const statusOk = 0x00;
      /* Use end symbol */
      let header = [MICA_PACKET_SYM_END, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x00, 0x01];
      let payload = [0xFD];
      let { msb, lsb } = calcChecksum16([...header, ...payload]);
      let footer = [msb, lsb, MICA_PACKET_SYM_END];
      let packet = [...header, ...payload, ...footer];
      let parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid start symbol');
      expect(parsed.data).toBeUndefined();

      /* Invalid module */
      header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL + 10, statusOk, 0x00, 0x01];
      payload = [0xFD];
      ({ msb, lsb } = calcChecksum16([...header, ...payload]));
      footer = [msb, lsb, MICA_PACKET_SYM_END];
      packet = [...header, ...payload, ...footer];
      parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid Module');
      expect(parsed.data).toBeUndefined();
    });
    it('should validate the footer', () => {
      const statusOk = 0x00;
      let header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x00, 0x01];
      let payload = [0xFD];
      let { msb, lsb } = calcChecksum16([...header, ...payload]);
      /* swap endianess */
      let footer = [lsb, msb, MICA_PACKET_SYM_END];
      let packet = [...header, ...payload, ...footer];
      let parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid checksum');
      expect(parsed.data).toBeUndefined();

      header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x00, 0x01];
      payload = [0xFD];
      ({ msb, lsb } = calcChecksum16([...header, ...payload]));
      /* Use start symbol */
      footer = [msb, lsb, MICA_PACKET_SYM_START];
      packet = [...header, ...payload, ...footer];
      parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid end symbol');
      expect(parsed.data).toBeUndefined();
    });
    it('should validate the payload', () => {
      const statusOk = 0x00;
      /* Remove Packet id */
      let header = [
        MICA_PACKET_SYM_START, /* MICA_PACKET_ID_MODULE_CONTROL, */ statusOk, 0x00, 0x01
      ];
      let payload = [0xFD];
      let { msb, lsb } = calcChecksum16([...header, ...payload]);
      let footer = [msb, lsb, MICA_PACKET_SYM_END];
      let packet = [...header, ...payload, ...footer];
      let parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid payload length');
      expect(parsed.data).toBeUndefined();

      /* Change payload len endianess */
      header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x01, 0x00];
      payload = [0xFD];
      ({ msb, lsb } = calcChecksum16([...header, ...payload]));
      footer = [msb, lsb, MICA_PACKET_SYM_END];
      packet = [...header, ...payload, ...footer];
      parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid payload length');
      expect(parsed.data).toBeUndefined();
    });
    it('should validate the checksum', () => {
      const statusOk = 0x00;
      let header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x00, 0x01];
      let payload = [0xFD];
      let { msb, lsb } = calcChecksum16([...header, ...payload]);
      /* Alter payload */
      payload[0] = 0xDF;
      let footer = [msb, lsb, MICA_PACKET_SYM_END];
      let packet = [...header, ...payload, ...footer];
      let parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid checksum');
      expect(parsed.data).toBeUndefined();

      header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x00, 0x01];
      payload = [0xFD];
      ({ msb, lsb } = calcChecksum16([...header, ...payload]));
      /* Change checksum endianess */
      footer = [lsb, msb, MICA_PACKET_SYM_END];
      packet = [...header, ...payload, ...footer];
      parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeFalsy();
      expect(parsed.error).toBe('Invalid checksum');
      expect(parsed.data).toBeUndefined();
    });
    it('should accept valid packets', () => {
      const statusOk = 0x00;
      let header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x00, 0x01];
      let payload = [0xFD];
      let { msb, lsb } = calcChecksum16([...header, ...payload]);
      let footer = [msb, lsb, MICA_PACKET_SYM_END];
      let packet = [...header, ...payload, ...footer];
      let parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeTruthy();
      expect(parsed.error).toBe('');
      expect(parsed.data).toEqual({
        status: statusOk,
        moduleId: MICA_PACKET_ID_MODULE_CONTROL,
        payload
      });

      header = [MICA_PACKET_SYM_START, MICA_PACKET_ID_MODULE_CONTROL, statusOk, 0x01, 0x01];
      payload = [];
      for (let i = 0; i <= 256; i++) {
        payload.push(i);
      }
      ({ msb, lsb } = calcChecksum16([...header, ...payload]));
      footer = [msb, lsb, MICA_PACKET_SYM_END];
      packet = [...header, ...payload, ...footer];
      parsed = parseMicaResponse(packet);
      expect(parsed.success).toBeTruthy();
      expect(parsed.error).toBe('');
      expect(parsed.data).toEqual({
        status: statusOk,
        moduleId: MICA_PACKET_ID_MODULE_CONTROL,
        payload
      });
    });
  });
  describe('validateResponseHeader', () => {
    it('should validate header for length', () => {
      let header = [];
      let result = validateResponseHeader(header);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid header length');

      header = [0x00, 0x00, 0x00, 0x00];
      result = validateResponseHeader(header);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid header length');
    });
    it('should validate header for Start symbol', () => {
      let header = [0x00, 0x00, 0x00, 0x00, 0x00];
      let result = validateResponseHeader(header);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid start symbol');

      header = [0x02, 0x00, 0x00, 0x00, 0x00];
      result = validateResponseHeader(header);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid start symbol');
    });
    it('should validate header for module ID', () => {
      let header = [MICA_PACKET_SYM_START, 0x06, 0x00, 0x00, 0x00];
      let result = validateResponseHeader(header);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid Module');

      header = [MICA_PACKET_SYM_START, 0xFF, 0x00, 0x00, 0x00];
      result = validateResponseHeader(header);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid Module');
    });
    it('should accept valid headers', () => {
      let header = [MICA_PACKET_SYM_START, 0x00, 0x00, 0x00, 0x00];
      let result = validateResponseHeader(header);
      expect(result.success).toBeTruthy();
      expect(result.error).toBe('');

      header = [MICA_PACKET_SYM_START, 0x01, 0x01, 0x01, 0x01];
      result = validateResponseHeader(header);
      expect(result.success).toBeTruthy();
      expect(result.error).toBe('');
    });
  });
  describe('validateResponseFooter', () => {
    it('should validate footer for length', () => {
      let footer = [];
      let result = validateResponseFooter(footer);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid footer length');

      footer = [0x00, 0x00];
      result = validateResponseFooter(footer);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid footer length');
    });
    it('should validate footer for end symbol', () => {
      let footer = [0x00, 0x00, 0x00];
      let result = validateResponseFooter(footer);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid end symbol');

      footer = [0x00, 0x00, 0xA0];
      result = validateResponseFooter(footer);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid end symbol');
    });
    it('should accept valid footers', () => {
      let footer = [0x00, 0x00, MICA_PACKET_SYM_END];
      let result = validateResponseFooter(footer);
      expect(result.success).toBeTruthy();
      expect(result.error).toBe('');

      footer = [0xCC, 0xF0, MICA_PACKET_SYM_END];
      result = validateResponseFooter(footer);
      expect(result.success).toBeTruthy();
      expect(result.error).toBe('');
    });
  });
  describe('validateResponseChecksum', () => {
    it('should validate based on reported checksum', () => {
      let packet = [0x01, 0x00, 0x00, 0x00, 0x04, 0x0F, 0x00, 0xFF, 0x01, 0xFE, 0xEC, 0xAA];
      let result = validateResponseChecksum(packet);
      expect(result.success).toBeTruthy();
      expect(result.error).toBe('');

      packet = [0x01, 0x01, 0x00, 0x00, 0x04, 0x0F, 0x00, 0xFF, 0x01, 0xFE, 0xEC, 0xAA];
      result = validateResponseChecksum(packet);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid checksum');

      packet = [0x01, 0x00, 0x00, 0x00, 0x04, 0x0F, 0x00, 0xFF, 0x01, 0xEE, 0xEC, 0xAA];
      result = validateResponseChecksum(packet);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid checksum');

      packet = [0x01, 0x00, 0x00, 0x00, 0x04, 0x0F, 0x00, 0xFF, 0x01, 0xFE, 0xEE, 0xAA];
      result = validateResponseChecksum(packet);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid checksum');
    });
  });
  describe('validateResponsePayload', () => {
    it('should validate length of the payload', () => {
      let header = [MICA_PACKET_SYM_START, 0x00, 0x00, 0x00, 0x02];
      let payload = [0xFD];
      let result = validateResponsePayload(header, payload);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid payload length');

      header = [MICA_PACKET_SYM_START, 0x00, 0x00, 0x01, 0x00];
      payload = [0xFD];
      result = validateResponsePayload(header, payload);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('Invalid payload length');
    });
    it('should accept valid payloads', () => {
      let header = [MICA_PACKET_SYM_START, 0x00, 0x00, 0x00, 0x01];
      let payload = [0xFD];
      let result = validateResponsePayload(header, payload);
      expect(result.success).toBeTruthy();
      expect(result.error).toBe('');

      header = [MICA_PACKET_SYM_START, 0x00, 0x00, 0x01, 0x00];
      payload = [];
      for (let i = 0; i < 256; i++) {
        payload.push(i);
      }
      result = validateResponsePayload(header, payload);
      expect(result.success).toBeTruthy();
      expect(result.error).toBe('');
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
  describe('processMicaPacketByte', () => {
    it('should accept packets with no payload', () => {
      const data = [0x01, 0x04, 0x00, 0x00, 0x00, 0xFF, 0xFB, 0xAA];
      let { complete, packet } = processMicaPacketByte(data);
      expect(complete).toBeTruthy();
      expect(packet).toEqual(data);
      /* Pass data in one at a time */
      for (let i = 0; i < data.length; i++) {
        ({ complete, packet } = processMicaPacketByte([data[i]]));
        if (i < data.length - 1) {
          expect(complete).toBeFalsy();
          expect(packet).toBeUndefined();
        }
      }
      expect(complete).toBeTruthy();
      expect(packet).toEqual(data);
    });
    it('should accept packets with a payload', () => {
      const data = [0x01, 0x02, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xB0, 0xB0, 0xAA];
      let { complete, packet } = processMicaPacketByte(data);
      expect(complete).toBeTruthy();
      expect(packet).toEqual(data);
      /* Pass data in one at a time */
      for (let i = 0; i < data.length; i++) {
        ({ complete, packet } = processMicaPacketByte([data[i]]));
        if (i < data.length - 1) {
          expect(complete).toBeFalsy();
          expect(packet).toBeUndefined();
        }
      }
      expect(complete).toBeTruthy();
      expect(packet).toEqual(data);
    });
    it('should reject packets with an invalid start byte', () => {
      const data = [0x00, 0x02, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xB0, 0xB0, 0xAA];
      const { complete, packet } = processMicaPacketByte(data);
      expect(complete).toBeFalsy();
      expect(packet).toBeUndefined();
    });
    it('should reject packets with an invalid end byte', () => {
      const data = [0x01, 0x02, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xB0, 0xB0, 0xAB];
      const { complete, packet } = processMicaPacketByte(data);
      expect(complete).toBeFalsy();
      expect(packet).toBeUndefined();
    });
  });
});

/* [] - END OF FILE */
