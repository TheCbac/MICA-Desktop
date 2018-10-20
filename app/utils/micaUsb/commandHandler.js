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
    changeScanState,
    
 } from '../../actions/ScanForDevicesActions';
import {
    foundAdvertisingDevice,
    cancelConnectToDevice,
    connectedToDevice,
    disconnectingFromDevice,
    disconnectedFromDevice,
    lostConnectionFromDevice
} from '../../actions/devicesActions';
import { parseAdvertisementPacket } from '../BLE/bleAdvertisementPackets';
import type {
    packetObj_T
} from './micaParser.types';
import type { newDeviceObjType } from '../../types/paramTypes';
import * as packets from './micaConstants';
import { hexToString } from '../../utils/Developer/TerminalUtils';

/* Handle a response packet */
export function handleResponse(packet: packetObj_T) {
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
                console.log('Found MICA BLE device');
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
        /* A device was successfully connected */
        case packets.RSP_CONNECTED: {
            const deviceId = payload.toString();
            console.log(`Connected to ${deviceId}`);
            store.dispatch(connectedToDevice(deviceId));
            break;
        }
        /* The device successfully disconnected */
        case packets.RSP_DISCONNECTED: {
            const deviceId = payload.toString();
            console.log(`Disconnected from ${deviceId}`);
            store.dispatch(disconnectedFromDevice(deviceId));
            break;
        }
        /* The device connection was lost */
        case packets.RSP_CONNECTION_LOST: {
            const deviceId = payload.toString();
            console.log(`Connection to ${deviceId} was lost`);
            store.dispatch(lostConnectionFromDevice(deviceId));
            break;
        }

        default: {
            console.log(`Unknown async command: ${cmd}`, payload)
        }
    }
}

/* Handle the Ack for to a command */
export function handleAcknowledgement(packet: packetObj_T) {
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
        /* The device was not connected, just the ack to the connect command */
        case packets.CMD_CONNECT: {
            /* Check for errors */
            const errFlag = flags ^ packets.FLAG_ACK;
            if(errFlag){
                console.log(`Connect cmd failed with flags 0x${hexToString(errFlag)}`);
                /* Indicate to user that connection failed */
                const deviceId = payload.toString();
                store.dispatch(cancelConnectToDevice(deviceId));
            } else {
                console.log('Connection initiated');
                /* connectingToDevice is handled optimistically, no need to 
                 * dispatch event 'connectingToDevice'. See ScanForDevicesActions  */
            }
            break;
        }
        /* The cancel pending command was ack'd */
        case packets.CMD_CONNECT_CANCEL: {
            /* Check for errors */
            const errFlag = flags ^ packets.FLAG_ACK;
            if(errFlag){
                console.log(`Cancel connect cmd failed with flags 0x${hexToString(errFlag)}`);
            } else {
                console.log('Cancel connect initiated');
                const deviceId = payload.toString();
                store.dispatch(cancelConnectToDevice(deviceId));
            }
            break;
        }
        /* The disconnect command was ack'd, begin disconnect */
        case packets.CMD_DISCONNECT: {
            /* Check for errors */
            const errFlag = flags ^ packets.FLAG_ACK;
            if(errFlag){
                console.log(`Disconnect cmd failed with flags 0x${hexToString(errFlag)}`);

            } else {
                console.log('Disconnect initiated');
                const deviceId = payload.toString();
                store.dispatch(disconnectingFromDevice(deviceId));
            }
            break;
        }
        /* Write was Ack'd */
        case packets.CMD_CHAR_WRITE: {
            /* Check for errors */
            const errFlag = flags ^ packets.FLAG_ACK;
            if(errFlag){
                console.log(`Write cmd failed with flags 0x${hexToString(errFlag)}`);

            } else {
                const deviceId = payload.slice(0,6).toString();
                const charHandle = payload[6]
                console.log(`Write initiated to device ${deviceId}, and characteristic handle ${charHandle}`);

                // store.dispatch(disconnectingFromDevice(deviceId));

            }
            break;
        }
        default: {
            console.log(`Unknown response to command: ${cmd}, flags: 0x${hexToString(errFlag)}`, payload)
            break;
        }
    }
}
/* [] - END OF FILE */
