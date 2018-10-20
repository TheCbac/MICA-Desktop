/* @flow */
/* **********************************************************
* File: /test/utils/BLE/bleAdvertisementPackets.spec.js
*
* Brief: Tests for parsing of the BLE advertisement packet
*
* Authors: Craig Cheney
*
* 2017.11.15 CC - Document created
*
********************************************************* */
import {
  advGetEventType,
  advGetPeerType,
  advGetPeerAddr,
  advParseDataPacket,
  parseAdvertisementPacket,
  BLE_GAPC_CONN_UNDIRECTED,
  BLE_GAPC_CONN_DIRECTED,
  BLE_GAPC_SCAN_UNDIRECTED,
  BLE_GAPC_NON_CONN_UNDIRECTED,
  BLE_GAP_ADDR_TYPE_PUBLIC,
  BLE_GAP_ADDR_TYPE_RANDOM,
  BLE_GAP_ADDR_TYPE_PUBLIC_RPA,
  BLE_GAP_ADDR_TYPE_RANDOM_RPA,
  ADV_DATA_FLAGS,
  ADV_DATA_COMPLETE_LOCAL_NAME,
  ADV_DATA_MANUFACTURER_SPECIFIC
} from '../../../app/utils/BLE/bleAdvertisementPackets';

const defaultAdvDataPacket = {
  localName: 'Peer Device',
  serviceUuids: [],
  manufacturerData: []
};

describe('bleAdvertisementPackets.spec.js', () => {
  describe('advGetEventType', () => {
    it('Should accept valid Event type values', () => {
      let typeByte = 0x00;
      let { success, error, type } = advGetEventType(typeByte);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAPC_CONN_UNDIRECTED);

      typeByte = 0x01;
      ({ success, error, type } = advGetEventType(typeByte));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAPC_CONN_DIRECTED);

      typeByte = 0x02;
      ({ success, error, type } = advGetEventType(typeByte));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAPC_SCAN_UNDIRECTED);

      typeByte = 0x03;
      ({ success, error, type } = advGetEventType(typeByte));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAPC_NON_CONN_UNDIRECTED);
    });
    it('should return an error for invalid types', () => {
      let typeByte = -1;
      let { success, error, type } = advGetEventType(typeByte);
      expect(success).toBeFalsy();
      expect(error).toBe('Unknown Advertisement event type -1');
      expect(type).toBeUndefined();

      typeByte = 0x04;
      ({ success, error, type } = advGetEventType(typeByte));
      expect(success).toBeFalsy();
      expect(error).toBe('Unknown Advertisement event type 04');
      expect(type).toBeUndefined();
    });
  });
  describe('advGetPeerType', () => {
    it('Should accept valid Peer Address type values', () => {
      let typeByte = 0x00;
      let { success, error, type } = advGetPeerType(typeByte);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAP_ADDR_TYPE_PUBLIC);

      typeByte = 0x01;
      ({ success, error, type } = advGetPeerType(typeByte));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAP_ADDR_TYPE_RANDOM);

      typeByte = 0x02;
      ({ success, error, type } = advGetPeerType(typeByte));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAP_ADDR_TYPE_PUBLIC_RPA);

      typeByte = 0x03;
      ({ success, error, type } = advGetPeerType(typeByte));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(type).toBe(BLE_GAP_ADDR_TYPE_RANDOM_RPA);
    });
    it('should return an error for invalid types', () => {
      let typeByte = -1;
      let { success, error, type } = advGetPeerType(typeByte);
      expect(success).toBeFalsy();
      expect(error).toBe('Unknown Peer Address type -1');
      expect(type).toBeUndefined();

      typeByte = 0x04;
      ({ success, error, type } = advGetPeerType(typeByte));
      expect(success).toBeFalsy();
      expect(error).toBe('Unknown Peer Address type 04');
      expect(type).toBeUndefined();
    });
  });
  describe('advGetPeerAddr', () => {
    it('Should reject addresses that are not 6 bytes', () => {
      let addrArray = [0x01, 0x02, 0x03, 0x04, 0x05];
      let { success, error, address } = advGetPeerAddr(addrArray);
      expect(success).toBeFalsy();
      expect(error).toBe('Peer address must be 6 Bytes long');
      expect(address).toBeUndefined();

      addrArray = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07];
      ({ success, error, address } = advGetPeerAddr(addrArray));
      expect(success).toBeFalsy();
      expect(error).toBe('Peer address must be 6 Bytes long');
      expect(address).toBeUndefined();
    });
    it('Should format valid addresses', () => {
      let addrArray = [0x06, 0x05, 0x04, 0x03, 0x02, 0x01];
      let { success, error, address } = advGetPeerAddr(addrArray);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(address).toBe('01:02:03:04:05:06');

      addrArray = [0x00, 0x00, 0x00, 0x05, 0xAC, 0xCB];
      ({ success, error, address } = advGetPeerAddr(addrArray));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(address).toBe('CB:AC:05:00:00:00');
    });
  });
  describe('advParseDataPacket', () => {
    it('should handle an empty data array', () => {
      const { success, error, advPacketData } = advParseDataPacket([]);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(advPacketData).toEqual(defaultAdvDataPacket);
    });
    it('should handle flags data', () => {
      let payload = [0x06];
      let len = payload.length + 1; /* adjust for data type */
      let flagsArray = [len, ADV_DATA_FLAGS, ...payload];
      let { success, error, advPacketData } = advParseDataPacket(flagsArray);
      let flags = {
        leLimitedDiscoverableMode: false,
        leGeneralDiscoverableMode: true,
        brEdrNotSupported: true,
        simultaneousLeAndBrEdrController: false,
        simultaneousLeAndBrEdrHost: false
      };
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(advPacketData.flags).toEqual(flags);
      expect(advPacketData).toEqual({ ...defaultAdvDataPacket, flags });

      payload = [0xFF];
      len = payload.length + 1;
      flagsArray = [len, ADV_DATA_FLAGS, ...payload];
      ({ success, error, advPacketData } = advParseDataPacket(flagsArray));
      flags = {
        leLimitedDiscoverableMode: true,
        leGeneralDiscoverableMode: true,
        brEdrNotSupported: true,
        simultaneousLeAndBrEdrController: true,
        simultaneousLeAndBrEdrHost: true
      };
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(advPacketData.flags).toEqual(flags);
      expect(advPacketData).toEqual({ ...defaultAdvDataPacket, flags });

      payload = [0x08];
      len = payload.length + 2;
      flagsArray = [len, ADV_DATA_FLAGS, ...payload];
      ({ success, error, advPacketData } = advParseDataPacket(flagsArray));
      expect(success).toBeFalsy();
      expect(error).toBe('Flags data is longer than one byte');
      expect(advPacketData).toBeUndefined();
    });
    it('should handle local name', () => {
      let payload = [0x43, 0x72, 0x61, 0x69, 0x67, 0x20, 0x30, 0x30, 0x33];
      let len = payload.length + 1; /* adjust for data type */
      let nameArray = [len, ADV_DATA_COMPLETE_LOCAL_NAME, ...payload];
      let { success, error, advPacketData } = advParseDataPacket(nameArray);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(advPacketData.localName).toEqual('Craig 003');

      payload = [0x43, 0x72, 0x61, 0x69, 0x67, 0x20, 0x30, 0x30, 0x33, 0x00, 0x00];
      len = payload.length + 1; /* adjust for data type */
      nameArray = [len, ADV_DATA_COMPLETE_LOCAL_NAME, ...payload];
      ({ success, error, advPacketData } = advParseDataPacket(nameArray));
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(advPacketData.localName).toEqual('Craig 003');

      payload = [];
      len = payload.length + 1; /* adjust for data type */
      nameArray = [len, ADV_DATA_COMPLETE_LOCAL_NAME, ...payload];
      ({ success, error, advPacketData } = advParseDataPacket(nameArray));
      expect(success).toBeFalsy();
      expect(error).toBe('Local name must not be blank');
      expect(advPacketData).toBeUndefined();
    });
    it('should handle manufacturer data', () => {
      let payload = [0x43, 0x72, 0x61, 0x69, 0x67, 0x20, 0x30, 0x30, 0x33];
      let len = payload.length + 1; /* adjust for data type */
      let nameArray = [len, ADV_DATA_MANUFACTURER_SPECIFIC, ...payload];
      let { success, error, advPacketData } = advParseDataPacket(nameArray);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(advPacketData.manufacturerData).toEqual(payload);

      payload = [];
      len = payload.length + 1; /* adjust for data type */
      nameArray = [len, ADV_DATA_MANUFACTURER_SPECIFIC, ...payload];
      ({ success, error, advPacketData } = advParseDataPacket(nameArray));
      expect(success).toBeFalsy();
      expect(error).toBe('Manufacturer data must not be blank');
      expect(advPacketData).toBeUndefined();
    });
    it('should handle multiple data types', () => {
      const flagsPayload = [0x06];
      const flagsLen = flagsPayload.length + 1; /* adjust for data type */
      const namePayload = [0x43, 0x72, 0x61, 0x69, 0x67, 0x20, 0x30, 0x30, 0x33];
      const nameLen = namePayload.length + 1; /* adjust for data type */
      const multiArray = [
        flagsLen, ADV_DATA_FLAGS, ...flagsPayload,
        nameLen, ADV_DATA_COMPLETE_LOCAL_NAME, ...namePayload
      ];
      const flags = {
        leLimitedDiscoverableMode: false,
        leGeneralDiscoverableMode: true,
        brEdrNotSupported: true,
        simultaneousLeAndBrEdrController: false,
        simultaneousLeAndBrEdrHost: false
      };

      const { success, error, advPacketData } = advParseDataPacket(multiArray);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(advPacketData.localName).toEqual('Craig 003');
      expect(advPacketData.flags).toEqual(flags);
    });
  });
  describe('parseAdvertisementPacket', () => {
    const advPacket = [
      0x00, 0x00, 0x0E, 0x5B, 0xD1, 0x00, 0xAC, 0xCB, 0x1F,
      0x02, 0x01, 0x06, 0x1B, 0x09, 0x43, 0x72, 0x61, 0x69,
      0x67, 0x20, 0x30, 0x30, 0x33, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0xD3
    ];
    const { success, error, packet } = parseAdvertisementPacket(advPacket);
    expect(success).toBeTruthy();
    expect(error).toBeUndefined();
    expect(packet).toEqual({
      eventType: BLE_GAPC_CONN_UNDIRECTED,
      peerAddrType: BLE_GAP_ADDR_TYPE_PUBLIC,
      peerAddr: 'CB:AC:00:D1:5B:0E',
      advPacketData: {
        localName: 'Craig 003',
        serviceUuids: [],
        manufacturerData: [],
        flags: {
          brEdrNotSupported: true,
          leGeneralDiscoverableMode: true,
          leLimitedDiscoverableMode: false,
          simultaneousLeAndBrEdrController: false,
          simultaneousLeAndBrEdrHost: false,
        }
      },
      rssi: -45
    });
  });
});

/* [] - END OF FILE */
