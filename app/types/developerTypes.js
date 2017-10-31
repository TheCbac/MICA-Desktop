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
/* Full input of a line */
export type terminalInputT = string;
/* Arguments */
export type terminalArgsT = {};
/* Flags */
export type terminalFlagsT = {
  [flagName: string]: boolean
};

export type terminalParsedObjT = {
  input: terminalInputT,
  args: terminalArgsT,
  flags: terminalFlagsT
};
/* Command Object passed to commands  */
export type terminalCmdObjT = {
  name: string,
  // exec: (
  //   input: terminalInputT,
  //   args: terminalArgsT,
  //   flags: terminalFlagsT
  // ) => Promise<*>,
  exec: Promise<string>,
  cmdObj: terminalParsedObjT
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
