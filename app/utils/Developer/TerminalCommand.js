/* @flow */
/* **********************************************************
* File: utils/Developer/TerminalCommands.js
*
* Brief: Commands that can be executed in the mica terminal
*
* Authors: Craig Cheney
*
* 2017.10.27 CC - Document created
*
********************************************************* */
import serialPort from 'serialport';
import type {
  terminalInputT, terminalArgsT, terminalFlagsT
} from '../../types/developerTypes';

/* Echo the current string */
// function echo(
//   input: terminalInputT,
//   args: terminalArgsT,
//   flags: terminalFlagsT
// ): Promise<*> {
//   return Promise.resolve(input);
// }
async function echo(): Promise<string> {
  return 'test';
}

/* Get the serial ports currently connected */
async function getSerialPorts() {
  const serialList = await serialPort.list();
  console.log(serialList);
  return serialList;
}

const terminalCommands = {
  getSerialPorts,
  echo
};

export default terminalCommands;
/* [] - END OF FILE */
