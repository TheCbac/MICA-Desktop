// @flow
/* **********************************************************
* File: /test/actions/nobleCallbackActions.js
*
* Brief: Test for Noble Ble callbacks
*
* Author: George Whitfield
* Date: 2017.07.27
*
**********************************************************/
import rewire from 'rewire';
import { spy } from 'sinon';
let actions = rewire('../../app/actions/nobleCallbackActions');

const stateChange = actions.__get__('stateChange');
const scanStart = actions.__get__('scanStart');
const scanStop = actions.__get__('scanStop');
const discover = actions.__get__('discover');

describe('Testing nobleCallbackActions.js', () => {
  it('Does not throw an error', () => {
    const stateChangeSpy = spy(stateChange);
    const scanStartSpy = spy(scanStart);
    const scanStopSpy = spy(scanStop);
    const discoverSpy = spy(discover);
    expect(stateChangeSpy).not.toThrow();
    expect(scanStartSpy).not.toThrow();
    expect(scanStopSpy).not.toThrow();
    expect(discoverSpy).not.toThrow();
  });
  // it('stateChange changes \' enabled\' from false to true', () => {
  //   scanRewire.__Rewire__('Noble', { state: 'poweredOn' });
  //   expect(scanStart().enabled).toBe(true);
  // });
});

// when the noble settings are changed, make sure that the store is doing the right thing..
