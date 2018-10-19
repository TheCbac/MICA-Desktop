/* @flow */
/* **********************************************************
* File: src/micaParser.js
*
* Brief: Parser for MICA packets. See packet.c/h for definitions
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */
import type {
  moduleName_T,
  packetData_T,
  bufferResponse_T,
  constructResponse_T,
  rxBufferObj_T,
  txBufferObj_T,
  packetObj_T,
  parsePacketResponse_T
} from './micaParser.types';
import * as packets from './micaConstants';

const rxBuffer: rxBufferObj_T = {
  buffer: [],
  state: 'wait',
  payloadLen: 0
};

const txBuffer: txBufferObj_T = {
  buffer: [],
  state: 'wait',
  payloadLen: 0
};

/* Compute a 16 bit checksum for a packet */
export function computeChecksum16(dataArray: packetData_T): {
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

/* Map the MICA Command to a module */
export function commandToModule(cmd: number): moduleName_T {
  /* Mask the response flag */
  const masked = cmd & (~packets.RSP_BIT);
  /* Check the command */
  if (masked >= packets.CMD_CONTROL_MIN && masked <= packets.CMD_CONTROL_MAX) {
    return 'control';
  } if (masked >= packets.CMD_ACTUATION_MIN && masked <= packets.CMD_ACTUATION_MAX) {
    return 'actuation';
  } if (masked >= packets.CMD_SENSING_MIN && masked <= packets.CMD_SENSING_MAX) {
    return 'sensing';
  } if (masked >= packets.CMD_ENERGY_MIN && masked <= packets.CMD_ENERGY_MAX) {
    return 'energy';
  }
  return 'unknown';
}


/* Construct a packet from the command and payload */
export function constructPacket(inPacket: packetObj_T): constructResponse_T {
  const result = {
    success: true,
    err: '',
    packet: null
  };
  const buffer = [];
  /* Ensure payload size is valid */
  if (inPacket.payload.length >= packets.LEN_MAX_PAYLOAD) {
    result.success = false;
    result.err = 'Payload exceeds maximum length';
    return result;
  }

  /* Pack the buffer */
  buffer.push(packets.SYM_START);
  buffer.push(inPacket.cmd);
  /* Payload MSB/LSB */
  buffer.push((inPacket.payload.length >> 8) & 0xFF);
  buffer.push(inPacket.payload.length & 0xFF);
  /* Payload */
  buffer.push(...inPacket.payload);
  /* Flags */
  buffer.push((inPacket.flags >> 8) & 0xFF);
  buffer.push((inPacket.flags) & 0xFF);
  /* Calculate checksum */
  const { msb, lsb } = computeChecksum16(buffer);
  buffer.push(msb, lsb);
  /* End symbol */
  buffer.push(packets.SYM_END);
  result.packet = buffer;
  return result;
}

/* Set the TX buffer to it's initial state */
export function resetTxBuffer(): void {
  txBuffer.buffer = [];
  txBuffer.state = 'wait';
  txBuffer.payloadLen = 0;
}

/* Reset the receive buffer to it's initial state */
export function resetRxBuffer(): void {
  rxBuffer.buffer = [];
  rxBuffer.state = 'wait';
  rxBuffer.payloadLen = 0;
}

// /* Get the packed data from the tx buffer, and then clear the buffer */
// export function getTxBuffer(): number[] {
//   const packetData = txBuffer.buffer.slice();
//   resetTxBuffer();
//   return packetData;
// }

/* Process one byte of the received packet */
export function processRxByte(byte: number): bufferResponse_T {
  const result = {
    complete: false,
    success: true,
    err: ''
  };
    /* Act according to state */
  switch (rxBuffer.state) {
    /* Waiting for start (no data so far) */
    case 'wait': {
      if (byte !== packets.SYM_START) {
        result.success = false;
        result.err = 'Invalid start symbol';
        return result;
      }
      /* Clear the buffer and push the data */
      resetRxBuffer();
      rxBuffer.buffer.push(byte);
      rxBuffer.state = 'header';
      break;
    }
    /* Receive packet header */
    case 'header': {
      rxBuffer.buffer.push(byte);
      /* Check if header is finished */
      if (rxBuffer.buffer.length === packets.LEN_HEADER) {
        rxBuffer.payloadLen = (rxBuffer.buffer[packets.INDEX_LEN_MSB] << 8)
          | rxBuffer.buffer[packets.INDEX_LEN_LSB];
        if (rxBuffer.payloadLen === 0) {
          rxBuffer.state = 'footer';
        } else {
          rxBuffer.state = 'payload';
        }
      }
      break;
    }
    /* receive packet payload */
    case 'payload': {
      rxBuffer.buffer.push(byte);
      /* See if all data has been collected */
      if (rxBuffer.buffer.length === (packets.LEN_HEADER + rxBuffer.payloadLen)) {
        rxBuffer.state = 'footer';
      }
      break;
    }
    /* Receive the footer */
    case 'footer': {
      rxBuffer.buffer.push(byte);
      const fullLen = packets.LEN_HEADER + rxBuffer.payloadLen + packets.LEN_FOOTER;
      if (rxBuffer.buffer.length === fullLen) {
        rxBuffer.state = 'complete';
        result.complete = true;
      }
      break;
    }
    /* Current packet is complete */
    case 'complete': {
      result.success = false;
      result.err = 'Completed packet has not been handled yet';
      result.complete = true;
      break;
    }
    default: {
      result.success = false;
      result.err = 'Unknown state';
      break;
    }
  }

  return result;
}


/* Parse the rx packet - return the state of the packet */
export function parseRxPacket(buffer: number[]): parsePacketResponse_T {
  const result = {
    success: true,
    err: '',
    packet: null
  };
    /* Ensure start of packet  */
  if (buffer[packets.INDEX_START] !== packets.SYM_START) {
    result.success = false;
    result.err = 'Invalid start symbol';
    return result;
  }
  const cmd = buffer[packets.INDEX_CMD];
  const moduleName = commandToModule(cmd);
  /* Get the payload */
  const payloadLen = (buffer[packets.INDEX_LEN_MSB] << 8) | buffer[packets.INDEX_LEN_LSB];
  if (payloadLen > packets.LEN_MAX_PAYLOAD) {
    result.success = false;
    result.err = 'Payload too long';
    return result;
  }
  const payload = buffer.slice(packets.INDEX_PAYLOAD, packets.INDEX_PAYLOAD + payloadLen);
  /* Footer */
  let footerIndex = packets.LEN_HEADER + payloadLen;
  const flagMsb = buffer[footerIndex++];
  const flagLsb = buffer[footerIndex++];
  const flags = (flagMsb << 8) | flagLsb;
  /* Checksum */
  const { msb, lsb } = computeChecksum16(
    buffer.slice(0, -1 * (packets.LEN_CHECKSUM + packets.LEN_SYM_END))
  );
  const checkMsb = buffer[footerIndex++];
  const checkLsb = buffer[footerIndex++];
  if (msb !== checkMsb || lsb !== checkLsb) {
    result.success = false;
    result.err = 'Checksum does not match';
    return result;
  }
  /* End Symbol */
  if (buffer[footerIndex] !== packets.SYM_END) {
    result.success = false;
    result.err = 'Invalid end symbol';
    return result;
  }
  /* All valid, place into out packet */
  result.packet = {
    module: moduleName,
    cmd,
    payload,
    flags
  };
  /* Clear the rx buffer */
  resetRxBuffer();
  return result;
}


/* [] - END OF FILE */
