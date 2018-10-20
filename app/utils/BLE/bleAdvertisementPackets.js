/* @flow */
/* eslint no-plusplus: 0 */
/* eslint no-bitwise: 0 */
/* **********************************************************
* File: utils/BLE/bleAdvertisementPackets.js
*
* Brief: Parsing BLE advertisement packets
*
* Authors: Craig Cheney
*
* 2017.11.15 CC - Document created
*
********************************************************* */
import { hexToString } from '../Developer/TerminalUtils';
import { twosCompToSigned } from '../mica/parseDataPacket';
import type { packetDataT } from '../dataStreams/packets';

export const BLE_GAPC_CONN_UNDIRECTED = 'BLE_GAPC_CONN_UNDIRECTED';
export const BLE_GAPC_CONN_DIRECTED = 'BLE_GAPC_CONN_DIRECTED';
export const BLE_GAPC_SCAN_UNDIRECTED = 'BLE_GAPC_SCAN_UNDIRECTED';
export const BLE_GAPC_NON_CONN_UNDIRECTED = 'BLE_GAPC_NON_CONN_UNDIRECTED';

export const BLE_GAP_ADDR_TYPE_PUBLIC = 'BLE_GAP_ADDR_TYPE_PUBLIC';
export const BLE_GAP_ADDR_TYPE_RANDOM = 'BLE_GAP_ADDR_TYPE_RANDOM';
export const BLE_GAP_ADDR_TYPE_PUBLIC_RPA = 'BLE_GAP_ADDR_TYPE_PUBLIC_RPA';
export const BLE_GAP_ADDR_TYPE_RANDOM_RPA = 'BLE_GAP_ADDR_TYPE_RANDOM_RPA';

export const ADV_PEER_ADDR_LEN = 6;
export const ADV_DATA_LEN_MAX = 31;

export const ADV_EVENT_TYPE_INDEX = 0;
export const ADV_PEER_TYPE_INDEX = 1;
export const ADV_PEER_ADDR_INDEX_START = 2;
export const ADV_PEER_ADDR_INDEX_END = ADV_PEER_ADDR_INDEX_START + ADV_PEER_ADDR_LEN;
export const ADV_DATA_LEN_INDEX = 8;
export const ADV_DATA_INDEX = 9;

export const ADV_DATA_FLAGS = 0x01;
export const ADV_DATA_COMPLETE_LOCAL_NAME = 0x09;
export const ADV_DATA_MANUFACTURER_SPECIFIC = 0xFF;

export const ADV_FLAG_LE_LIMITED_DISCOVER_POS = 0x00;
export const ADV_FLAG_LE_GENERAL_DISCOVER_POS = 0x01;
export const ADV_FLAG_BR_EDR_NOT_SUPPORTED_POS = 0x02;
export const ADV_FLAG_SIMU_LE_BD_EDR_CONTROLLER_POS = 0x03;
export const ADV_FLAG_SIMU_LE_BD_EDR_HOST_POS = 0x04;

export const ADV_FLAG_LE_LIMITED_DISCOVER_MASK = 1 << ADV_FLAG_LE_LIMITED_DISCOVER_POS;
export const ADV_FLAG_LE_GENERAL_DISCOVER_MASK = 1 << ADV_FLAG_LE_GENERAL_DISCOVER_POS;
export const ADV_FLAG_BR_EDR_NOT_SUPPORTED_MASK = 1 << ADV_FLAG_BR_EDR_NOT_SUPPORTED_POS;
export const ADV_FLAG_SIMU_LE_BD_EDR_CONTROLLER_MASK = 1 << ADV_FLAG_SIMU_LE_BD_EDR_CONTROLLER_POS;
export const ADV_FLAG_SIMU_LE_BD_EDR_HOST_MASK = 1 << ADV_FLAG_SIMU_LE_BD_EDR_HOST_POS;

export type advEventTypeT = 'BLE_GAPC_CONN_UNDIRECTED' | 'BLE_GAPC_CONN_DIRECTED' | 'BLE_GAPC_SCAN_UNDIRECTED' | 'BLE_GAPC_NON_CONN_UNDIRECTED';
export type peerAddrTypeT = 'BLE_GAP_ADDR_TYPE_PUBLIC' | 'BLE_GAP_ADDR_TYPE_RANDOM' | 'BLE_GAP_ADDR_TYPE_PUBLIC_RPA' | 'BLE_GAP_ADDR_TYPE_RANDOM_RPA';

export type advFlagsT = {
  leLimitedDiscoverableMode: boolean,
  leGeneralDiscoverableMode: boolean,
  brEdrNotSupported: boolean,
  simultaneousLeAndBrEdrController: boolean,
  simultaneousLeAndBrEdrHost: boolean
};
export type advPacketDataT = {
  localName: string,
  serviceUuids: string[],
  manufacturerData: packetDataT,
  flags?: advFlagsT
};
export type bleAdvPacketT = {
  eventType: advEventTypeT,
  peerAddrType: peerAddrTypeT,
  peerAddr: string,
  advPacketData: advPacketDataT,
  rssi: number
};

export type bleAdvPacketObjT = {
  success: boolean,
  error?: string,
  packet?: bleAdvPacketT
};
/* Parse the advertisement packet reported */
export function parseAdvertisementPacket(advPacket: packetDataT): bleAdvPacketObjT {
  /* Return objects */
  const advPacketObj: bleAdvPacketObjT = {
    success: false,
  };
  const packet = {};
  /* Check the event type */
  const eventTypeObj = advGetEventType(advPacket[ADV_EVENT_TYPE_INDEX]);
  if (eventTypeObj.success && eventTypeObj.type) {
    packet.eventType = eventTypeObj.type;
  } else {
    advPacketObj.error = eventTypeObj.error;
    return advPacketObj;
  }
  /* Get the peer address type */
  const peerAddrTypeObj = advGetPeerType(advPacket[ADV_PEER_TYPE_INDEX]);
  if (peerAddrTypeObj.success && peerAddrTypeObj.type) {
    packet.peerAddrType = peerAddrTypeObj.type;
  } else {
    advPacketObj.error = peerAddrTypeObj.error;
    return advPacketObj;
  }
  /* Get the peer address value */
  const peerAddrArray = advPacket.slice(ADV_PEER_ADDR_INDEX_START, ADV_PEER_ADDR_INDEX_END);
  const peerAddrObj = advGetPeerAddr(peerAddrArray);
  if (peerAddrObj.success && peerAddrObj.address) {
    packet.peerAddr = peerAddrObj.address;
  } else {
    advPacketObj.error = peerAddrObj.error;
    return advPacketObj;
  }

  /* Extract the advertisement data */
  const advDataLen = advPacket[ADV_DATA_LEN_INDEX];
  if (advDataLen > ADV_DATA_LEN_MAX) {
    advPacketObj.error = 'Reported data length out of range';
    return advPacketObj;
  }
  const advDataEndIndex = ADV_DATA_INDEX + advDataLen;
  const advDataArray = advPacket.slice(ADV_DATA_INDEX, advDataEndIndex);
  const advDataArrayObj = advParseDataPacket(advDataArray);
  if (advDataArrayObj.success && advDataArrayObj.advPacketData) {
    packet.advPacketData = advDataArrayObj.advPacketData;
  } else {
    advPacketObj.error = peerAddrTypeObj.error;
    return advPacketObj;
  }

  /* Extract the rssi */
  const rssi = twosCompToSigned(advPacket[advDataEndIndex], 8);
  if (rssi > 0 || rssi < -85) {
    advPacketObj.error = 'RSSI out of range';
    return advPacketObj;
  }
  packet.rssi = rssi;

  /* Return the valid packet */
  advPacketObj.success = true;
  advPacketObj.packet = packet;
  return advPacketObj;
}

export type advEventTypeObjT = {
  success: boolean,
  error?: string,
  type?: advEventTypeT
};
/* Return the Advertisement event type */
export function advGetEventType(advEventType: number): advEventTypeObjT {
  const advEventObj: advEventTypeObjT = {
    success: true,
  };
  switch (advEventType) {
    case 0x00:
      advEventObj.type = BLE_GAPC_CONN_UNDIRECTED;
      break;
    case 0x01:
      advEventObj.type = BLE_GAPC_CONN_DIRECTED;
      break;
    case 0x02:
      advEventObj.type = BLE_GAPC_SCAN_UNDIRECTED;
      break;
    case 0x03:
      advEventObj.type = BLE_GAPC_NON_CONN_UNDIRECTED;
      break;
    default:
      advEventObj.error = `Unknown Advertisement event type ${hexToString(advEventType)}`;
      advEventObj.success = false;
  }
  return advEventObj;
}

export type advPeerAddrTypeObjT = {
  success: boolean,
  error?: string,
  type?: peerAddrTypeT
};
/* Validate and return the Peer address type of the connection */
export function advGetPeerType(peerAddrType: number): advPeerAddrTypeObjT {
  const peerAddrTypeObj: advPeerAddrTypeObjT = {
    success: true,
  };
  switch (peerAddrType) {
    case 0x00:
      peerAddrTypeObj.type = BLE_GAP_ADDR_TYPE_PUBLIC;
      break;
    case 0x01:
      peerAddrTypeObj.type = BLE_GAP_ADDR_TYPE_RANDOM;
      break;
    case 0x02:
      peerAddrTypeObj.type = BLE_GAP_ADDR_TYPE_PUBLIC_RPA;
      break;
    case 0x03:
      peerAddrTypeObj.type = BLE_GAP_ADDR_TYPE_RANDOM_RPA;
      break;
    default:
      peerAddrTypeObj.error = `Unknown Peer Address type ${hexToString(peerAddrType)}`;
      peerAddrTypeObj.success = false;
  }
  return peerAddrTypeObj;
}

export type peerAddrT = string;
export type peerAddrObjT = {
  success: boolean,
  error?: string,
  address?: peerAddrT
};
/* Return the ASCII hex formated string of the Peer Address */
export function advGetPeerAddr(peerAddrArray: packetDataT): peerAddrObjT {
  const peerAddrObj: peerAddrObjT = {
    success: false,
  };
  /* Peer address is reported in opposite order - need to reverse */
  peerAddrArray.reverse();
  /* Ensure address is 6 octets */
  const addrLen = peerAddrArray.length;
  if (addrLen !== ADV_PEER_ADDR_LEN) {
    peerAddrObj.error = `Peer address must be ${ADV_PEER_ADDR_LEN} Bytes long`;
    return peerAddrObj;
  }
  /* Convert to ascii hex */
  peerAddrObj.address = hexToString(peerAddrArray);
  peerAddrObj.success = true;
  return peerAddrObj;
}

export type advPacketDataObjT = {
  success: boolean,
  error?: string,
  advPacketData?: advPacketDataT
};
/* Parse the Advertisement data packet - currently incomplete */
export function advParseDataPacket(advDataArray: packetDataT): advPacketDataObjT {
  const advPacketDataObj: advPacketDataObjT = {
    success: false
  };
  const advPacketData: advPacketDataT = {
    localName: 'Peer Device',
    serviceUuids: [],
    manufacturerData: []
  };
  let i = 0;
  /* Iterate through the entire array */
  while (i < advDataArray.length - 1) {
    /* Extract the length, remove the length of the data type */
    const len = advDataArray[i++] - 1;
    const dataType = advDataArray[i++];
    const data = advDataArray.slice(i, i += len);
    /* Handle the data passed in (incomplete implementation) */
    switch (dataType) {
      /* Construct the BLE flags */
      case ADV_DATA_FLAGS: {
        if (len !== 1) {
          advPacketDataObj.error = 'Flags data is longer than one byte';
          return advPacketDataObj;
        }
        const flags = data[0];
        const advFlags = {};
        advFlags.leLimitedDiscoverableMode = !!(flags & ADV_FLAG_LE_LIMITED_DISCOVER_MASK);
        advFlags.leGeneralDiscoverableMode = !!(flags & ADV_FLAG_LE_GENERAL_DISCOVER_MASK);
        advFlags.brEdrNotSupported = !!(flags & ADV_FLAG_BR_EDR_NOT_SUPPORTED_MASK);
        advFlags.simultaneousLeAndBrEdrController = !!(
          flags & ADV_FLAG_SIMU_LE_BD_EDR_CONTROLLER_MASK);
        advFlags.simultaneousLeAndBrEdrHost = !!(flags & ADV_FLAG_SIMU_LE_BD_EDR_HOST_MASK);
        advPacketData.flags = advFlags;
        break;
      }
      /* Parse the local name */
      case ADV_DATA_COMPLETE_LOCAL_NAME: {
        if (len === 0) {
          advPacketDataObj.error = 'Local name must not be blank';
          return advPacketDataObj;
        }
        let localName = '';
        for (let j = 0; j < len; j++) {
          const val = data[j];
          /* Ignore null bytes */
          if (val) {
            localName += String.fromCharCode(val);
          }
        }
        advPacketData.localName = localName;
        break;
      }
      /* Store but otherwise ignore manufacturer specific data */
      case ADV_DATA_MANUFACTURER_SPECIFIC:
        if (len === 0) {
          advPacketDataObj.error = 'Manufacturer data must not be blank';
          return advPacketDataObj;
        }
        advPacketData.manufacturerData = data;
        break;
      /* Log a warning */
      default:
        console.log('advParseDataPacket: unknown Adv data type', dataType, data);
        break;
    }
  }
  /* Return the successfully parsed data */
  advPacketDataObj.advPacketData = advPacketData;
  advPacketDataObj.success = true;
  return advPacketDataObj;
}

/* [] - END OF FILE */
