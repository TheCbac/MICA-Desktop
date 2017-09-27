// @flow
/* **********************************************************
* File: tests/factories/metadataFactories.spec.js
*
* Brief: Unit tests for metadata factories

* Author: Craig Cheney
*
* 2017.09.23 CC - Document Created
*
********************************************************* */
import { moduleNames } from '../../app/utils/mica/micaConstants';
import {
  energyMetaObjFactory,
  actuationMetaObjFactory,
  powerMetaObjFactory,
  sensingMetaObjFactory,
  communicationMetaObjFactory,
  controlMetaObjFactory,
  metadataObjFactory
} from './metadataFactories';

/* Test suite */
describe('metadataFactories.spec.js', () => {
  describe('energyMetaObjFactory', () => {
    it('should return a valid energy object', () => {
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        /* Get the objects */
        const { id, metaObj } = energyMetaObjFactory();
        expect(typeof id).toBe('number');
        expect(Object.keys(metaObj)).toEqual(['type', 'name', 'numCells', 'nomVoltage', 'energyFeatures']);
      }
    });
  });
  describe('actuationMetaObjFactory', () => {
    it('should return a valid actuation object', () => {
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        /* Get the objects */
        const { id, metaObj } = actuationMetaObjFactory();
        expect(typeof id).toBe('number');
        expect(Object.keys(metaObj)).toEqual(['type', 'numChannels', 'channelNames']);
      }
    });
  });
  describe('powerMetaObjFactory', () => {
    it('should return a valid power object', () => {
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        /* Get the objects */
        const { id, metaObj } = powerMetaObjFactory();
        expect(typeof id).toBe('number');
        expect(Object.keys(metaObj)).toEqual(['type', 'name', 'nomVoltage']);
      }
    });
  });
  describe('sensingMetaObjFactory', () => {
    it('should return a valid sensing object', () => {
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        /* Get the objects */
        const { id, metaObj } = sensingMetaObjFactory();
        expect(typeof id).toBe('number');
        expect(Object.keys(metaObj)).toEqual(['type', 'numChannels', 'channelNames',
          'scalingConstant', 'gain', 'units', 'offset'
        ]);
      }
    });
  });
  describe('communicationMetaObjFactory', () => {
    it('should return a valid communication object', () => {
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        /* Get the objects */
        const { id, metaObj } = communicationMetaObjFactory();
        expect(typeof id).toBe('number');
        expect(Object.keys(metaObj)).toEqual(['type', 'numDevices', 'deviceNames']);
      }
    });
  });
  describe('controlMetaObjFactory', () => {
    it('should return a valid control object', () => {
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        /* Get the objects */
        const { id, metaObj } = controlMetaObjFactory();
        expect(typeof id).toBe('number');
        expect(Object.keys(metaObj)).toEqual(['type', 'channelNames']);
      }
    });
  });
  describe('metadataObjFactory', () => {
    /* TODO: make this more robust */
    it('should return a valid metadata object', () => {
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        /* Get the objects */
        const metadataObj = metadataObjFactory();
        const moduleList = Object.keys(metadataObj);
        for (let j = 0; j < moduleList.length; j++) {
          const module = moduleList[j];
          expect(moduleNames.indexOf(module)).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });
});
/* [] - END OF FILE */
