/* @flow */
/* **********************************************************
* File: utils/preciseTime.js
*
* Brief: Class that allows for dates to be stored down to
*   the microsecond
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
export default class PreciseTime extends Date {
  /* Type def */
  microseconds: number;
  /* Constructor */
  constructor(...args: *) {
    super(...args);
    this.microseconds = 0;
    /* Change the prototype */
    // Object.setPrototypeOf(this, PreciseTime.prototype);
  }
  /* Add microseconds to the date */
  addMicroseconds(uSec: number): number {
    /* Calculate the number of microseconds */
    const micro = uSec + this.microseconds;
    /* increment the date by add milliseconds */
    this.setTime(this.getTime() + Math.floor(micro / 1000));
    /* Set the new microseconds */
    this.microseconds = (micro % 1000);
    /* Return the new microseconds */
    return this.microseconds;
  }
  /* Get the current number of microseconds */
  getMicroseconds(): number {
    return this.microseconds;
  }
  /* Get the precise time stamp */
  getPreciseTime(): number {
    // return Number(`${this.getTime()}.${this.microseconds}`);
    return Number(`${this.getTime()}.${this.microseconds}`);
  }
}
/* [] - END OF FILE */
