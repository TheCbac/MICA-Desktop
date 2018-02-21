// @flow
/* **********************************************************
* File: test/components/GraphStyle.spec.js
*
* Brief: Testing of the styles
*
* Author: Craig Cheney
*
* 2018.02.21 CC - Document created
*
********************************************************* */
import { getChannelColor } from '../../app/components/CollectData/GraphStyle';

describe('GraphStyle', () => {
  describe('getChannelColor', () => {
    it('Should return accelerometer colors', () => {
      expect(getChannelColor('accelerometer', 'x', 0)).toBe('#e41a1c');
      expect(getChannelColor('accelerometer', 'Y', 1)).toBe('#377eb8');
      expect(getChannelColor('Accelerometer', 'z', 2)).toBe('#4daf4a');
    });
    it('Should return gyroscope colors', () => {
      expect(getChannelColor('Gyroscope', 'x', 3)).toBe('#984ea3');
      expect(getChannelColor('Gyroscope', 'Y', 4)).toBe('#ff7f00');
      expect(getChannelColor('Gyroscope', 'z', 5)).toBe('#ffff33');
    });
    it('Should return random colors', () => {
      expect(getChannelColor('Current', 'x', 3)).toBe('#a65628');
      expect(getChannelColor('Magnets', 'qq', 4)).toBe('#f781bf');
      expect(getChannelColor('Test', 'test', 5)).toBe('#999999');
      expect(getChannelColor('Accelerometer', 'wrong', 5)).toBe('#999999');
    });
  });
});

/* [] - END OF FILE */
