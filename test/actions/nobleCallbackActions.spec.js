// @flow
/* eslint no-underscore-dangle: 0 */

/* **********************************************************
* File: /test/actions/nobleCallbackActions.spec.js
*
* Brief: Test for Noble Ble callbacks
*
* Author: George Whitfield
* Date: 2017.07.27
*
**********************************************************/
import { spy } from 'sinon';
// let actions = rewire('/Users/George/srv_bilab/micaReactElectron/app/actions/nobleCallbackActions');
import { stateChange, scanStart, scanStop, discover } from '../../app/actions/nobleCallbackActions';
import * as scanForDevicesActions from '../../app/actions/ScanForDevicesActions';

describe('Testing nobleCallbackActions.js', () => {
  const stateChangeSpy = spy(stateChange);
  const scanStartSpy = spy(scanStart);
  const scanStopSpy = spy(scanStop);
  const discoverSpy = spy(discover);
  it('Does not throw an error', () => {
    expect(stateChangeSpy).not.toThrow();
    expect(scanStartSpy).not.toThrow();
    expect(scanStopSpy).not.toThrow();
    expect(discoverSpy).not.toThrow();
  });
});
