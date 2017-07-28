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
import stateChange from '../../app/actions/nobleCallbackActions';
import { Noble } from '../../app/utils/nativeModules';

describe('Testing nobleCallbackActions.js', () => {
  it('Does not throw an error', () => {
    const stateChangeSpy = spy(stateChange);
    expect(stateChangeSpy).not.toThrow();
  });
});
