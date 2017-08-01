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

import { spy } from 'sinon';
import { stateChange, scanStart, scanStop, discover } from '../../app/actions/nobleCallbackActions';
import scanRewire, * as actions from '../../app/actions/nobleCallbackActions';


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

