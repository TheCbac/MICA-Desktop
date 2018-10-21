/* @flow */
/* **********************************************************
* File: src/micaParser.types.js
*
* Brief: Types for mica Packets
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */

export type moduleName_T = 'energy' | 'actuation' | 'sensing' | 'control' | 'unknown';
export type packetData_T = number[] | Buffer;

export type packet_T = {
    module: moduleName_T,
    cmd: number,
    payload: number[],
    flags: number
};

export type bufferStateSend_T = 'wait' | 'ready' | 'queueing' | 'complete';
export type bufferStateReceive_T = 'wait' | 'header' | 'payload' | 'footer' | 'complete';

export type rxBufferObj_T = {
    buffer: number[],
    state: bufferStateReceive_T,
    payloadLen: number
}

export type txBufferObj_T = {
    buffer: number[],
    state: bufferStateSend_T,
    payloadLen: number
}

export type packetObj_T = {
    module: moduleName_T,
    cmd: number,
    payload: number[],
    flags: number,

}

export type bufferResponse_T = {
    complete: boolean,
    err: string,
    success: boolean
}

export type constructResponse_T = {
    err: string,
    success: boolean,
    packet: ?number[]
}

export type parsePacketResponse_T = {
    err: string,
    success: boolean,
    packet: ?packetObj_T
}
/* [] - END OF FILE */
