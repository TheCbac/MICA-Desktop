// @flow
/* **********************************************************
* File: tests/factories/factories.spec.js
*
* Brief: Unit tests for factories

* Author: Craig Cheney
*
* 2017.09.22 CC - Document Created
*
********************************************************* */
import {
  deviceIdFactory,
  moduleNameFactory,
} from './factories';

/* Test suite */
describe('Factories.spec.js', () => {
  describe('deviceIdFactory', () => {
    it('should return a 128 bit uuid', () => {
      /* Run test 5 times */
      for (let i = 0; i < 5; i++) {
        const id = deviceIdFactory();
        expect(typeof id).toEqual('string');
        expect(id.length).toEqual(32);
      }
    });
  });
  describe('moduleNameFactory', () => {
    it('should return a name of a module', () => {
      const modulesNames = ['energy', 'actuation', 'power', 'sensing', 'communication', 'control'];
      /* run test 5 times */
      for (let i = 0; i < 5; i++) {
        const name = moduleNameFactory();
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
        expect(modulesNames.indexOf(name)).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
/* [] - END OF FILE */
