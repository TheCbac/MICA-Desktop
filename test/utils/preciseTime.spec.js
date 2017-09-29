// @flow
/* **********************************************************
* File: test/utils/preciseTime.spec.js
*
* Brief: Test the parsing functionality for arriving packets
*
* Authors: Craig Cheney
*
* 2017.09.20 CC - Document created
*
********************************************************* */
import PreciseTime from '../../app/utils/preciseTime';

/* Test suite */
describe('preciseTime.spec.js', () => {
  it('should create a new object', () => {
    const time = new PreciseTime();
    expect(time.getTime()).toBeGreaterThan(0);
  });
  it('should create a similar object to Date', () => {
    const t = new Date();
    const precise = new PreciseTime(t);
    expect(t.getTime()).toEqual(precise.getTime());
  });
  it('should add microseconds correctly', () => {
    const t = new PreciseTime();
    const milli = t.getMilliseconds();
    expect(t.getMicroseconds()).toBe(0);
    t.addMicroseconds(300);
    expect(t.getMicroseconds()).toBe(300);
    expect(t.getMilliseconds()).toEqual(milli);
    t.addMicroseconds(900);
    expect(t.getMicroseconds()).toBe(200);
    expect(t.getMilliseconds()).toEqual(milli + 1);
  });
  it('should return the full date', () => {
    const initValue = 1505965396982;
    const t = new PreciseTime(initValue);
    expect(t.getTime()).toEqual(initValue);
    t.addMicroseconds(100);
    expect(t.getTime()).toEqual(initValue);
    expect(t.getPreciseTime()).toEqual(initValue + 0.1);
    t.addMicroseconds(1200);
    expect(t.getPreciseTime()).toEqual(initValue + 1.3);
  });
});

/* [] - END OF FILE */
