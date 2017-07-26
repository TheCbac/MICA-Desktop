// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }]*/
/* **********************************************************
* File: reducers/devicesReducer.js
*
* Brief: Reducer for interactive with devices
*
* Author: George Whitfield
* Date: 2017.07.25
*
**********************************************************/
import deviceHandlers from '../../app/reducers/devicesReducer';
import createReducer from '../../app/reducers/devicesReducer';
import type {
  devicesStateType
} from '../../app/types/stateTypes';

let testDevicesStateType = {
  advertising: [2, 3, 4],
  connected: [5, 3, 5]
}

describe('Testing deivceHandlers', () => {
  it('Should not reassign orinal data', () => {
    const myMock = jest.fn();
    /* Listing out the logic for the test
        1) define a new Clear_advertising_list
        2) pass in example data
        3) confirm whether or not the original data was changed
    */

  });
});
