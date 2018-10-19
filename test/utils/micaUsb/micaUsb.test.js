/* **********************************************************
* File: src/micaUsb.test.js
*
* Brief: Parser for MICA usb module
* Author: Craig Cheney
* Date: 2018.10.18
*
********************************************************* */
import {
  setPort, removePort, isPortOpen, getPort
} from './micaUsb';

test('No Default port', () => {
  expect(isPortOpen()).toBeFalsy();
  expect(getPort()).toBeNull();
});

test('Set a port', () => {
  expect(isPortOpen()).toBeFalsy();
  expect(getPort()).toBeNull();
  /* Register the port */
  const fakePort = { path: 'COM7', isOpen: true };
  setPort(fakePort);
  expect(isPortOpen()).toBeTruthy();
  expect(getPort()).toBe(fakePort);
});

test('Close Port', () => {
  expect(isPortOpen()).toBeTruthy();
  /* Close the port */
  removePort();
  expect(isPortOpen()).toBeFalsy();
  expect(getPort()).toBeNull();
});


/* [] - END OF FILE */
