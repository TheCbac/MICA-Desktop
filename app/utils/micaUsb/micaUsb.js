/* @flow */
/* **********************************************************
* File: src/micaUsb.js
*
* Brief: Top level for interacting with MICA USB devices
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */


export type usbPort = {
    path: string,
    isOpen: boolean,
    close: () => void
}

let openPort: ?usbPort = null;

export function setPort(port: usbPort): void {
  openPort = port;
}

export function removePort(): void {
  openPort = null;
}

export function isPortOpen(): boolean {
  return !!(openPort && openPort.isOpen);
}

export function getPort(): ?usbPort {
  return openPort;
}
/* [] - END OF FILE */
