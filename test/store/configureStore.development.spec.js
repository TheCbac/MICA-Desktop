// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/store/configureStore.development.spec.js
*
* Brief: Test for configureStore file
*
* Author: George Whitfield
* Date: 2017.08.07
*
**********************************************************/
import React from 'react';
import sinon from 'sinon';
import __RewireAPI__ from '../../app/store/configureStore';

/*
const testData = {
  thunk: 1234456,
  createLogger: (param1: Object) => {
    const array = [];
    array.push(param1);
    return array; },
  routerMiddleware: (params) => { return params + 10; },
  hashHistory: 30,
  scanActions: {
    scan1: () => {},
    scan2: () => {},
    scan3: () => {} },
  push: () => {}
};

// const configureStoreRewire = __RewireAPI__.__get__('configureStore');

describe('Configure Store', () => {
  // setup spy
  const spy = sinon.spy(configureStore);
  beforeAll(() => {
    // set up fake data in configureStore.
    __RewireAPI__.__set__({
      thunk: testData.thunk,
      createLogger: testData.createLogger,
      routerMiddleware: testData.routerMiddleware,
      hashHistory: testData.hashHistory,
      scanActions: testData.scanActions,
      push: testData.push
    });
    configureStore();
    const createLoggerSpy = spy(testData.createLogger({ level: 'info', collapsed: true }));

  });
 /* it('Sets up middlewares', () => {
    const middlewares = __RewireAPI__.__get__('middleware');
    expect(middlewares[0]).toBe(testData.thunk);
    expect(middlewares[1]).toBe(testData.createLogger);
    expect(middlewares[2]).toBe(testData.routerMiddleware(testData.hashHistory));
  });
  it('Creates action creaters variable', () => {
    const actionsCreators = __RewireAPI__.__get__('actionCreators');
    expect(actionsCreators).toBe(testData.scanActions, testData.push);
  });
  
});
*/
