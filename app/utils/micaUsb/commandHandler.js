/* @flow */
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
import { foundAdvertisingDevice } from '../../actions/devicesActions';
import { parseAdvertisementPacket } from '../BLE/bleAdvertisementPackets';
import type {
    packetObj_T
} from './micaParser.types';
import type { newDeviceObjType } from '../../types/paramTypes';
import * as packets from './micaConstants';

/* Handle a command or async data received */
export function handleCmd(packet: packetObj_T) {
    const { module, cmd, payload, flags } = packet;
    switch(cmd) {
        /* A device was found */
        case packets.RSP_DEVICE_FOUND: {
            const {success, error, packet } = parseAdvertisementPacket(payload);
            const {
                rssi,
                peerAddr: address,
                advPacketData: {localName: name},
                deviceId
            } = packet;
            /* Only accept MICA devices */
            if(address.slice(0, 5) === 'CB:AC') {
                const newDeviceObj: newDeviceObjType = {
                    deviceId,
                    address,
                    name,
                    rssi
                } ;
                console.log('Found BLE device');
                console.log(newDeviceObj);
                store.dispatch(foundAdvertisingDevice(newDeviceObj));
            }
            break;
        }
        /* The scan timed out */
        case packets.RSP_SCAN_STOPPED: {
            console.log('Scan timed out');
            store.dispatch(changeScanState('usb', false));
            break;
        }
        default: {
            console.log(`Unknown async command: ${cmd}`, payload)
        }
    }
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
        case packets.CMD_CONNECT: {
            /* Check for errors */
            if(flags ^ packets.FLAG_ACK){
                console.log(`Connect failed with flags ${flags}`);
            } else {
                console.log('Connect successful');
                /* Pick up here */
            }
            break;
        }
        default: {
            console.log(`Unknown response to command: ${cmd}, flags: ${flags}`, payload)
            break;
        }
    }
}
/* [] - END OF FILE */
