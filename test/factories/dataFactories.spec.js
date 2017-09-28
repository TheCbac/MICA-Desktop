// @flow
/* **********************************************************
* File: tests/factories/dataFactories.spec.js
*
* Brief: Unit tests for factories that create dummy data

* Author: Craig Cheney
*
* 2017.09.28 CC - Document Created
*
********************************************************* */
import { accDataFactory, randomNumber } from './dataFactories';

describe('dataFactories.spec.js', () => {
  describe('accDataFactory', () => {
    it('Should return a valid acc data obj', () => {
      const data = accDataFactory();
      const dataPoint = data.toPoint();
      expect(dataPoint.length).toBe(2);
      expect(dataPoint[1]).toBeGreaterThan(-20);
      expect(dataPoint[1]).toBeLessThan(20);
      const dataJson = data.toJSON();
      expect(Object.keys(dataJson.data)).toContain('x');
    });
    it('Should accept a keys argument', () => {
      const data = accDataFactory(['x', 'y']);
      const dataPoint = data.toPoint();
      expect(dataPoint.length).toBe(3);
      expect(dataPoint[1]).toBeGreaterThan(-20);
      expect(dataPoint[1]).toBeLessThan(20);
      expect(dataPoint[2]).toBeGreaterThan(-20);
      expect(dataPoint[2]).toBeLessThan(20);
      const dataJson = data.toJSON();
      expect(Object.keys(dataJson.data)).toContain('x');
      expect(Object.keys(dataJson.data)).toContain('y');
    });
    it('Should accept a time argument', () => {
      const time = new Date().getTime();
      const data = accDataFactory(undefined, time);
      const dataPoint = data.toPoint();
      expect(dataPoint.length).toBe(2);
      expect(dataPoint[0]).toEqual(time);
      expect(dataPoint[1]).toBeGreaterThan(-20);
      expect(dataPoint[1]).toBeLessThan(20);
      const dataJson = data.toJSON();
      expect(Object.keys(dataJson.data)).toContain('x');
    });
    it('should accept both key and time arguments', () => {
      const time = new Date().getTime();
      const data = accDataFactory(['x', 'y', 'z'], time);
      const dataPoint = data.toPoint();
      expect(dataPoint.length).toBe(4);
      expect(dataPoint[0]).toEqual(time);
      expect(dataPoint[1]).toBeGreaterThan(-20);
      expect(dataPoint[1]).toBeLessThan(20);
      expect(dataPoint[2]).toBeGreaterThan(-20);
      expect(dataPoint[2]).toBeLessThan(20);
      expect(dataPoint[3]).toBeGreaterThan(-20);
      expect(dataPoint[3]).toBeLessThan(20);
      const dataJson = data.toJSON();
      expect(Object.keys(dataJson.data)).toContain('x');
      expect(Object.keys(dataJson.data)).toContain('y');
      expect(Object.keys(dataJson.data)).toContain('z');
    });
  });
  describe('randomNumber', () => {
    it('should return a number between [-i, i]', () => {
      /* Run test 10 times */
      for (let i = 1; i < 10; i++) {
        const rand = randomNumber(-i, i);
        expect(rand).toBeGreaterThan(-i);
        expect(rand).toBeLessThan(i);
      }
    });
  });
});

/* [] - END OF FILE */
