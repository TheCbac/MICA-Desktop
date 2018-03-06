/* @flow */
/* **********************************************************
* File: tests/utils/dataStreams/graphBuffer.spec.js
*
* Brief: Provides a storage class for buffering data outputs
*
* Authors: Craig Cheney
*
* 2017.10.01 CC - Updated test suite for multi-device
* 2017.09.28 CC - Document created
*
********************************************************* */
import {
  getDeviceObj,
  resetStartTime,
  getStartTime,
  getLastTime,
  getDataPointDecimated,
  getDataIndex,
  logDataPoints,
  resetDataBuffer,
  getDataLength,
  getLastDataPointsDecimated,
  getDataSeries,
  getFullDataObj,
  getDataObjById
} from '../../../app/utils/dataStreams/graphBuffer';
import { deviceIdFactory } from '../../factories/factories';
import { accDataFactory } from '../../factories/dataFactories';
import type { deviceObjT } from '../../../app/utils/dataStreams/graphBuffer';

/* Global IDs of devices */
const deviceId1 = deviceIdFactory();
const deviceId2 = deviceIdFactory();
const deviceId3 = deviceIdFactory();

/* Test Suite */
describe('graphBuffer.spec.js', () => {
  describe('getDeviceObj', () => {
    it('should create an empty device', () => {
      const deviceId = deviceIdFactory();
      const deviceObj: deviceObjT = getDeviceObj(deviceId);
      expect(deviceObj.data).toEqual([]);
      expect(deviceObj.dataIndex).toBe(0);
      expect(deviceObj.startTime).toBeGreaterThan(0);
      expect(deviceObj.lastTime).toBe(deviceObj.startTime);
    });
  });
  describe('timing events', () => {
    describe('resetStartTime', () => {
      it('should set the start time, and last time', () => {
        const deviceId = deviceIdFactory();
        const resetReturn = resetStartTime(deviceId);
        expect(resetReturn).toEqual(getStartTime(deviceId));
        expect(resetReturn).toEqual(getLastTime(deviceId));
      });
    });
  });
  describe('data events', () => {
    beforeEach(() => {
      resetDataBuffer(deviceId1);
      resetDataBuffer(deviceId2);
      resetStartTime(deviceId1);
      resetStartTime(deviceId2);
    });
    describe('resetDataBuffer', () => {
      it('should reset the buffer length', () => {
        const data = accDataFactory();
        const num = logDataPoints(deviceId1, [data]);
        expect(num).toBe(1);
        expect(getDataLength(deviceId1)).toBe(1);
        expect(getDataIndex(deviceId1)).toBe(0);
        /* Get it back */
        const dataReturned = getDataPointDecimated(deviceId1);
        expect(dataReturned).toEqual(data);
        expect(getDataLength(deviceId1)).toBe(1);
        expect(getDataIndex(deviceId1)).toBe(1);
        resetDataBuffer(deviceId1);
        expect(getDataLength(deviceId1)).toBe(0);
        expect(getDataIndex(deviceId1)).toBe(0);
      });
    });
    describe('logDataPoints', () => {
      it('should store an event', () => {
        const startTime = resetStartTime(deviceId1);
        const time = startTime + 1;
        const data = accDataFactory(['x'], time);
        /* Log the data point */
        const num = logDataPoints(deviceId1, [data]);
        expect(num).toBe(1);
        const lastTime = getLastTime(deviceId1);
        expect(lastTime).toEqual(time);
        expect(lastTime).toEqual(startTime + 1);
        /* Retrieve the point */
        const dataRetrieved = getDataPointDecimated(deviceId1);
        expect(dataRetrieved).toEqual(data);
        expect(getDataIndex(deviceId1)).toEqual(1);
      });
    });
    describe('getDataPointDecimated', () => {
      it('should return a decimated list', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime(deviceId1);
        for (let i = 0; i <= 10; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data)).toEqual(11);
        /* Retrieve the decimated data */
        const decimation = 100 / 30;
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data[0]);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data[3]);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data[7]);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data[10]);
      });
      it('should not increment an index if already beyond the length of the array', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime(deviceId1);
        for (let i = 0; i <= 10; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data)).toEqual(11);
        /* Retrieve the decimated data */
        const decimation = 5;
        expect(getDataIndex(deviceId1)).toBe(0);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data[0]);
        expect(getDataIndex(deviceId1)).toBe(5);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data[5]);
        expect(getDataIndex(deviceId1)).toBe(10);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data[10]);
        expect(getDataIndex(deviceId1)).toBe(15);
        expect(getDataPointDecimated(deviceId1, decimation)).toBe(undefined);
        expect(getDataIndex(deviceId1)).toBe(15);
      });
    });
    describe('getLastDataPointDecimated', () => {
      it('should return the last element with no args', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime(deviceId1);
        for (let i = 0; i < 20; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data)).toEqual(20);
        /* Get the last point */
        const lastData = getLastDataPointsDecimated(deviceId1);
        expect(lastData[0]).toEqual(data[19]);
      });
      it('should return N elements', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime(deviceId1);
        for (let i = 0; i < 20; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data)).toEqual(20);
        /* Get the last point */
        const lastData = getLastDataPointsDecimated(deviceId1, 5);
        expect(lastData.length).toBe(5);
        expect(lastData[0]).toEqual(data[15]);
        expect(lastData[1]).toEqual(data[16]);
        expect(lastData[2]).toEqual(data[17]);
        expect(lastData[3]).toEqual(data[18]);
        expect(lastData[4]).toEqual(data[19]);
      });
      it('should not return more elements than allowed', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime(deviceId1);
        for (let i = 0; i < 20; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data)).toEqual(20);
        /* Get the last point */
        const lastData = getLastDataPointsDecimated(deviceId1, 5, 5);
        expect(lastData.length).toBe(4);
        expect(lastData[0]).toEqual(data[4]);
        expect(lastData[1]).toEqual(data[9]);
        expect(lastData[2]).toEqual(data[14]);
        expect(lastData[3]).toEqual(data[19]);
      });
      it('should handle non-integer decimation', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime(deviceId1);
        for (let i = 0; i < 11; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data)).toEqual(11);
        /* Get the last point */
        const decimation = 10 / 3;
        const lastData = getLastDataPointsDecimated(deviceId1, 4, decimation);
        expect(lastData.length).toBe(4);
        expect(lastData[0]).toEqual(data[0]);
        expect(lastData[1]).toEqual(data[3]);
        expect(lastData[2]).toEqual(data[7]);
        expect(lastData[3]).toEqual(data[10]);
      });
      it('should handle multiple devices', () => {
        /* Create the dummy data */
        const data1 = [];
        const data2 = [];
        const startTime1 = getStartTime(deviceId1);
        const startTime2 = getStartTime(deviceId2);
        for (let i = 0; i <= 10; i++) {
          data1.push(accDataFactory(['x'], startTime1 + i));
          data2.push(accDataFactory(['x'], startTime2 + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data1)).toEqual(11);
        expect(logDataPoints(deviceId2, data2)).toEqual(11);
        /* Retrieve the decimated data */
        const decimation = 100 / 30;
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data1[0]);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data1[3]);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data1[7]);
        expect(getDataPointDecimated(deviceId1, decimation)).toEqual(data1[10]);
        /* Device 2 */
        expect(getDataPointDecimated(deviceId2, decimation)).toEqual(data2[0]);
        expect(getDataPointDecimated(deviceId2, decimation)).toEqual(data2[3]);
        expect(getDataPointDecimated(deviceId2, decimation)).toEqual(data2[7]);
        expect(getDataPointDecimated(deviceId2, decimation)).toEqual(data2[10]);
      });
    });
    describe('getDataSeries', () => {
      it('should return the full data series for a device', () => {
        /* Create the dummy data */
        const data = [];
        const startTime = getStartTime(deviceId1);
        for (let i = 0; i < 11; i++) {
          data.push(accDataFactory(['x'], startTime + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data)).toEqual(11);
        /* Retrieve the data points */
        const dataReturned = getDataSeries(deviceId1);
        expect(dataReturned.length).toBe(data.length);
        /* Check that all of the points match */
        for (let j = 0; j < data.length; j++) {
          expect(dataReturned[j]).toEqual(data[j]);
        }
      });
    });
    describe('getFullDataObj', () => {
      it('should return the entire data object', () => {
        /* Create the dummy data */
        const data1 = [];
        const startTime1 = getStartTime(deviceId1);
        for (let i = 0; i < 11; i++) {
          data1.push(accDataFactory(['x'], startTime1 + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data1)).toEqual(11);
        /* Create the dummy data */
        const data2 = [];
        const startTime2 = getStartTime(deviceId2);
        for (let i = 0; i < 11; i++) {
          data2.push(accDataFactory(['x'], startTime2 + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId2, data2)).toEqual(11);

        /* Retrieve the data object */
        const dataObj = getFullDataObj();
        const dataReturned1 = dataObj[deviceId1].data;
        const dataReturned2 = dataObj[deviceId2].data;
        expect(data1).toEqual(dataReturned1);
        expect(data2).toEqual(dataReturned2);

        // const dataReturned1 = getDataSeries(deviceId1);
        // expect(dataReturned1.length).toBe(data.length);
        // /* Check that all of the points match */
        // for (let j = 0; j < data.length; j++) {
        //   expect(dataReturned1[j]).toEqual(data[j]);
        // }
      });
    });
    describe('getDataObjById', () => {
      it('should return dataObjs for only the ids request', () => {
        /* Create the dummy data */
        const data1 = [];
        const startTime1 = getStartTime(deviceId1);
        for (let i = 0; i < 11; i++) {
          data1.push(accDataFactory(['x'], startTime1 + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId1, data1)).toEqual(11);
        /* Create the dummy data */
        const data2 = [];
        const startTime2 = getStartTime(deviceId2);
        for (let i = 0; i < 11; i++) {
          data2.push(accDataFactory(['x'], startTime2 + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId2, data2)).toEqual(11);
        /* Create the dummy data 3 */
        const data3 = [];
        const startTime3 = getStartTime(deviceId3);
        for (let i = 0; i < 11; i++) {
          data3.push(accDataFactory(['x'], startTime3 + i));
        }
        /* Log the dummy data */
        expect(logDataPoints(deviceId3, data3)).toEqual(11);

        /* Retrieve part of the data */
        const reqIds = [deviceId2, deviceId3];
        const dataById = getDataObjById(reqIds);
        /* Expect to get back keys for those requested */
        expect(Object.keys(dataById)).toEqual(reqIds);
        /* Check that the object match */
        expect(dataById[deviceId2].data).toEqual(data2);
        expect(dataById[deviceId3].data).toEqual(data3);
      });
    });
  });
});
/* [] - END OF FILE */
