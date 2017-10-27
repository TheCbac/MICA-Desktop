/* @flow */
/* **********************************************************
* File: types/developerTypes.js
*
* Brief: Type defs for MICA terminal
*
* Authors: Craig Cheney
*
* 2017.10.27 CC - Document created
*
********************************************************* */

/* Command Object passed to commands  */
export type terminalCmdObjT = {
  name: string,
  input: string,
  args: {},
  flags: {
    [flagName: string]: boolean
  }
};
/* History Object for the terminal */
export type terminalHistoryObjT = {
  value: string,
  isCmd: boolean
};
/* State of the terminal */
export type terminalStateT = {
  commands: string[],
  cursorPosition: number,
  currentLine: string,
  history: terminalHistoryObjT[],
  commandLineNumber: ?number,
  metaKeys: string[]
};

/* [] - END OF FILE */
