/* @flow */
/* eslint no-bitwise: 0 */
/* **********************************************************
* File: utils/dataStreams/packets.js
*
* Brief: Parsing MICA binary packets
*
* Authors: Craig Cheney
*
* 2017.11.03 CC - Document created
*
********************************************************* */
import { SHIFT_BYTE_ONE, MASK_BYTE_ONE } from '../bitConstants';

export const MICA_PACKET_SYM_START = 0x01;
export const MICA_PACKET_SYM_END = 0xAA;

export const MICA_PACKET_ID_MODULE_ENERGY = 0x00;
export const MICA_PACKET_ID_MODULE_ACTUATION = 0x01;
export const MICA_PACKET_ID_MODULE_POWER = 0x02;
export const MICA_PACKET_ID_MODULE_SENSING = 0x03;
export const MICA_PACKET_ID_MODULE_COMM = 0x04;
export const MICA_PACKET_ID_MODULE_CONTROL = 0x05;
export const MICA_PACKET_ID_MODULE_MAX = 0x05;

export const MICA_PACKET_RESP_LEN_HEADER = 0x05;
export const MICA_PACKET_RESP_LEN_FOOTER = 0x03;

export const MICA_PACKET_RESP_INDEX_LEN_MSB = 0x03;
export const MICA_PACKET_RESP_INDEX_LEN_LSB = 0x04;

export const MICA_PACKET_LEN_MAX_PAYLOAD = 1000;

export const PACKET_SUCCESS = 0x00;
export const PACKET_ERR_FORMAT = 0x01;
export const PACKET_ERR_MODULE = 0x02;
export const PACKET_ERR_LENGTH = 0x03;
export const PACKET_ERR_DATA = 0x04;
export const PACKET_ERR_CMD = 0x05;
export const PACKET_ERR_CHECKSUM = 0x06;
export const PACKET_ERR_STATE = 0x07;
export const PACKET_ERR_UNKNOWN = 0x08;
export const PACKET_REPORT_ADV = 0xF0;

export type micaPacketT = {
  moduleId: number,
  command: number,
  payload?: number[]
};
export type micaPacketObjT = {
  binary: number[],
  packetObj: micaPacketT
};
export type packetBinaryT = {
  success: boolean,
  error: string,
  binary: number[]
};
/* Construct a MICA packet from inputs */
export function createMicaPacketBinary(packetObj: micaPacketT): packetBinaryT {
  const result = { success: false, error: '', binary: [] };
  const { moduleId, command, payload = [] } = packetObj;
  /* Calculate 8 bit payload length */
  const payLenMsb = (payload.length >>> SHIFT_BYTE_ONE) & MASK_BYTE_ONE;
  const payLenLsb = payload.length & MASK_BYTE_ONE;
  /* Validate payload */
  const { success: validPayload, error } = validatePayload(payload);
  if (!validPayload) {
    result.error = error;
    return result;
  }
  /* Construct the command */
  const cmd = [MICA_PACKET_SYM_START, moduleId, command, payLenMsb, payLenLsb, ...payload];
  /* Add the footer */
  const { msb, lsb } = calcChecksum16(cmd);
  cmd.push(msb, lsb, MICA_PACKET_SYM_END);
  /* Update the return */
  result.success = true;
  result.binary = cmd;
  /* Return the command */
  return result;
}

export type payloadValidationT = {
  success: boolean,
  error: string
};
/* Ensure valid payload data */
export function validatePayload(data: packetDataT): payloadValidationT {
  const result = { success: false, error: '' };
  const len = data.length;
  if (len > MICA_PACKET_LEN_MAX_PAYLOAD) {
    result.error = 'Payload exceeds maximum length';
    return result;
  }
  /* Verify each element */
  for (let i = 0; i < len; i++) {
    const val = data[i];
    if (val < 0) {
      result.error = 'Payload contains negative value';
      return result;
    }
    if (val > 255) {
      result.error = 'Payload value exceeds 8-bits';
      return result;
    }
  }
  result.success = true;
  return result;
}

export type packetDataT = number[] | Buffer;
export type responsePacketT = {
  status: number,
  moduleId: number,
  payload: packetDataT
};
/* Parse a MICA packet */
export type micaResponseT = {
  success: boolean,
  error: string,
  data?: responsePacketT
};
export type validationObjT = {
  success: boolean,
  error: string
};
/* Parse a response packet from a device */
export function parseMicaResponse(packet: packetDataT): micaResponseT {
  const responseObj = { success: false, error: '' };
  const header = packet.slice(0, MICA_PACKET_RESP_LEN_HEADER);
  const payload = packet.slice(MICA_PACKET_RESP_LEN_HEADER, -MICA_PACKET_RESP_LEN_FOOTER);
  const footer = packet.slice(-MICA_PACKET_RESP_LEN_FOOTER);
  /* Validate components */
  const validHeader = validateResponseHeader(header);
  if (!validHeader.success) {
    responseObj.error = validHeader.error;
    return responseObj;
  }
  const validFooter = validateResponseFooter(footer);
  if (!validFooter.success) {
    responseObj.error = validFooter.error;
    return responseObj;
  }
  const validPayload = validateResponsePayload(header, payload);
  if (!validPayload.success) {
    responseObj.error = validPayload.error;
    return responseObj;
  }
  const validChecksum = validateResponseChecksum(packet);
  if (!validChecksum.success) {
    responseObj.error = validChecksum.error;
    return responseObj;
  }
  /* Packet is valid, unpack */
  const moduleId = header[1];
  const status = header[2];
  const data = { moduleId, status, payload };
  responseObj.data = data;
  responseObj.success = true;
  return responseObj;
}
/* Validate the header of the response packet */
export function validateResponseHeader(header: packetDataT): validationObjT {
  const result = { success: false, error: '' };
  if (header.length !== MICA_PACKET_RESP_LEN_HEADER) {
    result.error = 'Invalid header length';
    return result;
  }
  if (header[0] !== MICA_PACKET_SYM_START) {
    result.error = 'Invalid start symbol';
    return result;
  }
  if (header[1] > MICA_PACKET_ID_MODULE_MAX) {
    result.error = 'Invalid Module';
    return result;
  }
  /* Return success */
  result.success = true;
  return result;
}
/* Validate the footer of the response packet */
export function validateResponseFooter(footer: packetDataT): validationObjT {
  const result = { success: false, error: '' };
  if (footer.length !== MICA_PACKET_RESP_LEN_FOOTER) {
    result.error = 'Invalid footer length';
    return result;
  }
  if (footer[footer.length - 1] !== MICA_PACKET_SYM_END) {
    result.error = 'Invalid end symbol';
    return result;
  }
  /* Return success */
  result.success = true;
  return result;
}

/* Validate the checksum */
export function validateResponseChecksum(packet: packetDataT): validationObjT {
  const result = { success: false, error: '' };
  const len = packet.length;
  const msb = packet[len - 3];
  const lsb = packet[len - 2];
  const calc = calcChecksum16(packet.slice(0, -3));
  if (calc.msb !== msb || calc.lsb !== lsb) {
    result.error = 'Invalid checksum';
    return result;
  }
  /* Return success */
  result.success = true;
  return result;
}

/* Validate the checksum */
export function validateResponsePayload(
  header: packetDataT,
  payload: packetDataT
): validationObjT {
  const result = { success: false, error: '' };
  const msb = header[3];
  const lsb = header[4];
  const reportedLength = (msb << SHIFT_BYTE_ONE) | lsb;
  if (reportedLength !== payload.length) {
    result.error = 'Invalid payload length';
    return result;
  }
  /* Return success */
  result.success = true;
  return result;
}

/* Get the Error associated with a code */
export function getResponseStatus(status: number): validationObjT {
  const result = { success: false, error: '' };
  switch (status) {
    case PACKET_SUCCESS:
      result.success = true;
      break;
    case PACKET_ERR_FORMAT:
      result.error = 'Packet in the incorrect format';
      break;
    case PACKET_ERR_MODULE:
      result.error = 'Command addressed invalid Module id';
      break;
    case PACKET_ERR_LENGTH:
      result.error = 'Payload was an invalid length';
      break;
    case PACKET_ERR_DATA:
      result.error = 'Payload data was in an incorrect format';
      break;
    case PACKET_ERR_CMD:
      result.error = 'Command was invalid';
      break;
    case PACKET_ERR_CHECKSUM:
      result.error = 'Packet Checksum did not match calculated checksum';
      break;
    case PACKET_ERR_STATE:
      result.error = 'Device is in incorrect state to execute command';
      break;
    case PACKET_ERR_UNKNOWN:
      result.error = 'Packet failed with an unknown error';
      break;
    default:
      result.error = `An unknown error code "${status}" was received`;
      break;
  }
  return result;
}

/* Calculate the 16 bit checksum */
export function calcChecksum16(dataArray: packetDataT): {
  msb: number,
  lsb: number
} {
  let checkSum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    checkSum += dataArray[i];
  }
  /* convert to 16 bits */
  checkSum %= ((2 ** 16) - 1);
  /* Take the two's complement */
  checkSum = ((~checkSum >>> 0) & 0xFFFF) + 1;
  /* Return the MSB and LSB */
  const msb = (checkSum >> 8) & 0xFF;
  const lsb = checkSum & 0xFF;
  return { msb, lsb };
}

export type byteParserT = {
  complete: boolean,
  packet?: packetDataT
};

export const STATE_WAIT_FOR_START = 'STATE_WAIT_FOR_START';
export const STATE_RECEIVE_HEADER = 'STATE_RECEIVE_HEADER';
export const STATE_RECEIVE_PAYLOAD = 'STATE_RECEIVE_PAYLOAD';
export const STATE_RECEIVE_FOOTER = 'STATE_RECEIVE_FOOTER';

export type byteParserObjT = {
  state: 'STATE_WAIT_FOR_START' | 'STATE_RECEIVE_HEADER' | 'STATE_RECEIVE_PAYLOAD' | 'STATE_RECEIVE_FOOTER',
  byteBuffer: number[],
  payloadLen: number
};


/* Object to store the current packet */
const byteParserObj: byteParserObjT = {
  state: STATE_WAIT_FOR_START,
  byteBuffer: [],
  payloadLen: 0
};

/* parse a byte of data from the serial port - this is not a pure function */
export function processMicaPacketByte(data: packetDataT): byteParserT {
  /* Return value */
  let packetStateComplete = false;
  /* Iterate over all of the data */
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    /* Act according to state */
    /* eslint default-case: 0 */
    switch (byteParserObj.state) {
      /* ### Waiting for start symbol ### */
      case STATE_WAIT_FOR_START:
        if (byte === MICA_PACKET_SYM_START) {
          /* Reset the buffer */
          byteParserObj.byteBuffer = [MICA_PACKET_SYM_START];
          byteParserObj.payloadLen = 0;
          /* Advance to next state */
          byteParserObj.state = STATE_RECEIVE_HEADER;
        }
        break;
      /* ### Waiting for the header ### */
      case STATE_RECEIVE_HEADER:
        /* Store the data */
        byteParserObj.byteBuffer.push(byte);
        /* If the header is complete */
        if (byteParserObj.byteBuffer.length === MICA_PACKET_RESP_LEN_HEADER) {
          const { byteBuffer } = byteParserObj;
          /* Extract the payload */
          const payloadLen =
            (byteBuffer[MICA_PACKET_RESP_INDEX_LEN_MSB] << SHIFT_BYTE_ONE) |
            byteBuffer[MICA_PACKET_RESP_INDEX_LEN_LSB];
          /* Store the length */
          byteParserObj.payloadLen = payloadLen;
          /* validate length */
          if (payloadLen > MICA_PACKET_LEN_MAX_PAYLOAD) {
            /* error - move back to start state */
            byteParserObj.state = STATE_WAIT_FOR_START;
          } else if (payloadLen === 0) {
            /* skip payload collection */
            byteParserObj.state = STATE_RECEIVE_FOOTER;
          } else {
            /* Advance to next state */
            byteParserObj.state = STATE_RECEIVE_PAYLOAD;
          }
        }
        break;
      /* ### Waiting for the payload ### */
      case STATE_RECEIVE_PAYLOAD: {
        /* Store the data */
        byteParserObj.byteBuffer.push(byte);
        const { byteBuffer, payloadLen } = byteParserObj;
        /* See if all payload data has been captured */
        if (byteBuffer.length === (MICA_PACKET_RESP_LEN_HEADER + payloadLen)) {
          byteParserObj.state = STATE_RECEIVE_FOOTER;
        }
        break;
      }
      /* ### Waiting for the footer ### */
      case STATE_RECEIVE_FOOTER: {
        /* Store the data */
        byteParserObj.byteBuffer.push(byte);
        const { byteBuffer, payloadLen } = byteParserObj;
        /* See if all data has been captured */
        if (byteBuffer.length === (
          MICA_PACKET_RESP_LEN_HEADER + payloadLen + MICA_PACKET_RESP_LEN_FOOTER
        )) {
          /* Ensure stop symbol */
          if (byte === MICA_PACKET_SYM_END) {
            packetStateComplete = true;
          }
          /* Return to original state */
          byteParserObj.state = STATE_WAIT_FOR_START;
        }
        break;
      }
    }
  }
  /* Return full object if complete */
  if (packetStateComplete) {
    return {
      complete: packetStateComplete,
      packet: byteParserObj.byteBuffer
    };
  }
  /* No data to return */
  return {
    complete: packetStateComplete
  };
}

/* Reset the state of the byte parser */
export function resetByteParse(): void {
  byteParserObj.byteBuffer = [];
  byteParserObj.payloadLen = 0;
  byteParserObj.state = STATE_WAIT_FOR_START;
}
/* [] - END OF FILE */
