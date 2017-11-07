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
import type {
  terminalParsedObjT
} from '../../types/developerTypes';
import SerialCommands from './SerialCommands';
/* Echo the string, except for the name 'echo ' */
async function echo(cmdObj: terminalParsedObjT): Promise<string[]> {
  const echoLen = 'echo '.length;
  return [cmdObj.input.slice(echoLen)];
}

const terminalCommands = {
  serial: SerialCommands,
  echo
};

export default terminalCommands;
/* [] - END OF FILE */
