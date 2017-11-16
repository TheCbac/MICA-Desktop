/* eslint import/no-mutable-exports: 0 */
/* eslint import/prefer-default-export: 0 */
/* eslint global-require: 0 */
/* **********************************************************
* File: utils/nativeModules.js
*
* Brief: Wraps native modules in a try catch clause to
*   to enable unit testing.
*
* Author: Craig Cheney
* Date: 2017.06.08
*
********************************************************* */

/* Import Noble */
let Noble;
try {
  Noble = require('noble');
} catch (e) {
  /* Testing Environement */
  Noble = {
    state: 'poweredOff',
    on: () => {}
  };
}

/* Serialport */
let Serialport;
try {
  Serialport = require('serialport');
} catch (e) {
  console.log('Serialport not imported correctly');
}
export { Noble, Serialport };

/* [] - END OF FILE */
