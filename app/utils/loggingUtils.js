// @flow
/* **********************************************************
* File: utils/loggingUtils.js
*
* Brief: Contains functions for logging/debugging
*
* Author: Craig Cheney
*
* 2017.08.29 CC - Document created
**********************************************************/

/* Wrapper function for logging  */
function logMsg(...args: mixed[]): void {
  // console.log(new Date().toString(), ...args);
  console.log(...args);
}


const log = {
  /* Which items to print */
  debugLevel: 1,
  /* Silly debug messages */
  silly(...args: mixed[]): void {
    if (this.debugLevel >= 5) {
      logMsg('Silly: ', ...args);
    }
  },
  /* General debugging statements  */
  debug(...args: mixed[]): void {
    if (this.debugLevel >= 4) {
      logMsg('Debug: ', ...args);
    }
  },
  /* Verbose debugging statments */
  verbose(...args: mixed[]): void {
    if (this.debugLevel >= 3) {
      logMsg('Verbose: ', ...args);
    }
  },
  /* Informative deubgging */
  info(...args: mixed[]): void {
    if (this.debugLevel >= 2) {
      logMsg('Info: ', ...args);
    }
  },
  /* Warngings */
  warn(...args: mixed[]): void {
    if (this.debugLevel >= 1) {
      logMsg('Warn: ', ...args);
    }
  },
  /* Errors */
  error(...args: mixed[]): void {
    if (this.debugLevel >= 0) {
      logMsg('Error: ', ...args);
    }
  }
};

export { log as default };

/* [] - END OF FILE */
