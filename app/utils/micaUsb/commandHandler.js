// @flow
/* **********************************************************
* File: utils/micaUsb/commandHandler.js
*
* Brief: handles commands received by
*
* Author: Craig Cheney
*
* 2018.10.19 CC - Document created
********************************************************* */
import store from '../../index';
import {
    changeScanMethod,
    changeScanState
 } from '../../actions/ScanForDevicesActions';
import type {
    packetObj_T
} from './micaParser.types';
import * as packets from './micaConstants';

/* Handle a command or async data received */
export function handleCmd(packet: packetObj_T) {

}

/* Handle the response for to a command */
export function handleResponse(packet: packetObj_T) {
    const { module, cmd, payload, flags } = packet;
    switch(cmd) {
        case packets.CMD_ID: {
            const deviceIdMajor = payload[0];
            const deviceIdMinor = payload[1];
            const deviceId = (deviceIdMajor << 8) | deviceIdMinor;
            const firmwareIdMajor = payload[2];
            const firmwareIdMinor = payload[3];
            console.log(`Device ${deviceId} found with firmware version v${firmwareIdMajor}.${firmwareIdMinor}`);
            
            /* Check if support cube */
            if(deviceId == 0x01) {
                store.dispatch(changeScanMethod('usb', true));
            }
            
            break;
        }
        /* The scan was successfully started */
        case packets.CMD_SCAN_START: {
            const timeoutId = setTimeout(() => {
                /* The PSoC will timeout automatically, but could implement this */
              }, 15000);
            store.dispatch(changeScanState('usb', true, timeoutId));
            console.log('Scan successfully started');
            break;
        }
        /* The scan was successfully stopped */
        case packets.CMD_SCAN_STOP: {
            store.dispatch(changeScanState('usb', false));
            console.log('Scan successfully stopped');
            break;
        }
        case packet.RSP_DEVICE_FOUND: {

            break;
        }
        default: {
            console.log(`Unknown response: ${cmd}`, payload)
        }
    }
}
/* [] - END OF FILE */
