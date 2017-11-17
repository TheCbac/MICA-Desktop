/* @flow */
/* **********************************************************
* File: utils/dataStreams/asyncResponses.js
*
* Brief: Asynchronous responses from the MICA support cube
*
* Authors: Craig Cheney
*
* 2017.11.17 CC - Document created
*
********************************************************* */
import {
  MICA_PACKET_ID_MODULE_COMM
} from './packets';
import { parseAdvertisementPacket } from '../BLE/bleAdvertisementPackets';
import { logAsyncData } from '../Developer/TerminalUtils';
import type { responsePacketT, packetDataT } from './packets';

export const MICA_PACKET_ASYNC_RESP = 0x80;
export const MICA_PACKET_ASYNC_REPORT_ADV = 0x80;
/* handle the async reported data */
export function handleAsyncData(data: responsePacketT, packet: packetDataT): void {
  /* Extract the response */
  const { status } = data;
  switch (status) {
    case MICA_PACKET_ASYNC_REPORT_ADV:
      receiveAdvertisingPacket(data);
      break;
    default:
      break;
  }
}


/* Generic function callback for communication subcommands */
function receiveAdvertisingPacket(advResponse: responsePacketT): void {
  if (advResponse.moduleId !== MICA_PACKET_ID_MODULE_COMM) {
    logAsyncData('receiveAdvertisingPacket passed wrong command module');
    return;
  }

  /* Parse the advertisement packet */
  const { success, error, packet } = parseAdvertisementPacket(advResponse.payload);
  if (!success && error) {
    logAsyncData(`Error: ${error}`);
    return;
  } else if (success && packet) {
    logAsyncData(`${packet.advPacketData.localName} ${packet.peerAddr} ${packet.rssi}`);
  }
}


/* [] - END OF FILE */
