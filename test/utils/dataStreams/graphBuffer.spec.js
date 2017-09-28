/* @flow */
/* **********************************************************
* File: tests/utils/dataStreams/graphBuffer.spec.js
*
* Brief: Provides a storage class for buffering data outputs
*
* Authors: Craig Cheney
*
* 2017.09.28 CC - Document created
*
********************************************************* */
import {
  resetStartTime,
  getStartTime,
  getLastTime,
  getDataPointDecimated,
  getDataIndex,
  logDataPoints,
  resetBuffer,
  getDataLength,
  getLastDataPointsDecimated
} from '../../../app/utils/dataStreams/graphBuffer';
import { accDataFactory } from '../../factories/dataFactories';

describe('graphBuffer.spec.js', () => {
  describe('timing events', () => {
    describe('resetStartTime', () => {
      it('should set the start time, and last time', () => {
        const resetReturn = resetStartTime();
        expect(resetReturn).toEqual(getStartTime());
        expect(resetReturn).toEqual(getLastTime());
      });
    });
  });
  describe('data events', () => {
    beforeEach(() => {
      resetBuffer();
      resetStartTime();
    });
    describe('resetBuffer', () => {
      it('should reset the buffer length', () => {
        const data = accDataFactory();
        const num = logDataPoints([data]);
        expect(num).toBe(1);
        expect(getDataLength()).toBe(1);
        expect(getDataIndex()).toBe(0);
        /* Get it back */
        const dataReturned = getDataPointDecimated();
        expect(dataReturned).toEqual(data);
        expect(getDataLength()).toBe(1);
        expect(getDataIndex()).toBe(1);
        resetBuffer();
        expect(getDataLength()).toBe(0);
        expect(getDataIndex()).toBe(0);
      });
    });
    describe('logDataPoints', () => {
      it('should store an event', () => {
        const startTime = resetStartTime();
        const time = startTime + 1;
        const data = accDataFactory(['x'], time);
        /* Log the data point */
        const num = logDataPoints([data]);
        expect(num).toBe(1);
        const lastTime = getLastTime();
        expect(lastTime).toEqual(time);
        expect(lastTime).toEqual(startTime + 1);
        /* Retrieve the point */
        const dataRetrieved = getDataPointDecimated();
        expect(dataRetrieved).toEqual(data);
        expect(getDataIndex()).toEqual(1);
      });
    });
    describe('getDataPointDecimated', () => {
      it('should return a decimated list', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime();
        for (let i = 0; i <= 10; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(data)).toEqual(11);
        /* Retrieve the decimated data */
        const decimation = 100 / 30;
        expect(getDataPointDecimated(decimation)).toEqual(data[0]);
        expect(getDataPointDecimated(decimation)).toEqual(data[3]);
        expect(getDataPointDecimated(decimation)).toEqual(data[7]);
        expect(getDataPointDecimated(decimation)).toEqual(data[10]);
      });
      it('should not increment an index if already beyond the length of the array', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime();
        for (let i = 0; i <= 10; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(data)).toEqual(11);
        /* Retrieve the decimated data */
        const decimation = 5;
        expect(getDataIndex()).toBe(0);
        expect(getDataPointDecimated(decimation)).toEqual(data[0]);
        expect(getDataIndex()).toBe(5);
        expect(getDataPointDecimated(decimation)).toEqual(data[5]);
        expect(getDataIndex()).toBe(10);
        expect(getDataPointDecimated(decimation)).toEqual(data[10]);
        expect(getDataIndex()).toBe(15);
        expect(getDataPointDecimated(decimation)).toBe(undefined);
        expect(getDataIndex()).toBe(15);
      });
    });
    describe('getLastDataPointDecimated', () => {
      it('should return the last element with no args', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime();
        for (let i = 0; i < 20; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(data)).toEqual(20);
        /* Get the last point */
        const lastData = getLastDataPointsDecimated();
        expect(lastData[0]).toEqual(data[19]);
      });
      it('should return N elements', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime();
        for (let i = 0; i < 20; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(data)).toEqual(20);
        /* Get the last point */
        const lastData = getLastDataPointsDecimated(5);
        expect(lastData.length).toBe(5);
        expect(lastData[0]).toEqual(data[15]);
        expect(lastData[1]).toEqual(data[16]);
        expect(lastData[2]).toEqual(data[17]);
        expect(lastData[3]).toEqual(data[18]);
        expect(lastData[4]).toEqual(data[19]);
      });
      it('should return N decimated elements', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime();
        for (let i = 0; i < 20; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(data)).toEqual(20);
        /* Get the last point */
        const lastData = getLastDataPointsDecimated(5, 3);
        expect(lastData.length).toBe(5);
        expect(lastData[0]).toEqual(data[7]);
        expect(lastData[1]).toEqual(data[10]);
        expect(lastData[2]).toEqual(data[13]);
        expect(lastData[3]).toEqual(data[16]);
        expect(lastData[4]).toEqual(data[19]);
      });
      it('should not return more elements than allowed', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime();
        for (let i = 0; i < 20; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(data)).toEqual(20);
        /* Get the last point */
        const lastData = getLastDataPointsDecimated(5, 5);
        expect(lastData.length).toBe(4);
        expect(lastData[0]).toEqual(data[4]);
        expect(lastData[1]).toEqual(data[9]);
        expect(lastData[2]).toEqual(data[14]);
        expect(lastData[3]).toEqual(data[19]);
      });
      it('should handle non-integer decimation', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime();
        for (let i = 0; i < 11; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(data)).toEqual(11);
        /* Get the last point */
        const decimation = 10 / 3;
        const lastData = getLastDataPointsDecimated(4, decimation);
        expect(lastData.length).toBe(4);
        expect(lastData[0]).toEqual(data[0]);
        expect(lastData[1]).toEqual(data[3]);
        expect(lastData[2]).toEqual(data[7]);
        expect(lastData[3]).toEqual(data[10]);
      });
    });
  });
});

/* [] - END OF FILE */
