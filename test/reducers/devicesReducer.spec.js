// @flow
/* **********************************************************
* File: test/reducers/devicesReducer.spec.js
*
* Brief: testing deviceReducer.js
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.09.03 CC - Updated for correct flow usage
* 2017.07.25 GW - Document created
*
********************************************************* */
import devicesReducer from '../../app/reducers/devicesReducer';
import {
  FOUND_ADVERTISING_DEVICE,
  CLEAR_ADVERTISING_LIST
} from '../../app/actions/devicesActions';
import { micaServiceUuid } from '../../app/utils/mica/micaConstants';
import {
  deviceIdFactory,
  foundDeviceActionFactory,
  clearAdvertisingListFactory
 } from '../factories/factories';
import type { devicesStateType } from '../../app/types/stateTypes';
import type { idType } from '../../app/types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
} from '../../app/types/actionTypes';

/* Default state for the reducer */
const defaultState: devicesStateType = { };

/* Test Suite */
describe('devicesReducer.spec.js', () => {
  describe('FOUND_ADVERTISING_DEVICE', () => {
    it('Should add in a new device to an empty list', () => {
      /* Create the action */
      const action: foundDeviceActionType = foundDeviceActionFactory();
      const action1: foundDeviceActionType = foundDeviceActionFactory();
      /* Call the reducer - ensure it is an object, issue with createReducer type */
      const newState = devicesReducer(defaultState, action);
      expect(Object.keys(defaultState).length).toBe(0);
      expect(Object.keys(newState).length).toBe(1);
      /* Everything should be advertising */
      let values = Object.values(newState);
      for (let i = 0; i < values.length; i++) {
        expect(values[i]).toBe('advertising');
      }
      /* Add second device */
      const newState1 = devicesReducer(newState, action1);
      expect(Object.keys(newState).length).toBe(1);
      expect(Object.keys(newState1).length).toBe(2);
      /* Everything should be advertising */
      values = Object.values(newState1);
      for (let i = 0; i < values.length; i++) {
        expect(values[i]).toBe('advertising');
      }
      /* Make sure the keys are correctly included */
      const idList = Object.keys(newState1);
      expect(idList.indexOf(action.payload.deviceId)).toBeGreaterThanOrEqual(0);
      expect(idList.indexOf(action1.payload.deviceId)).toBeGreaterThanOrEqual(0);
    });
    it('Should change a disconnected device to an advertising device', () => {
      const id = deviceIdFactory();
      /* default state */
      const state1 = { [id]: 'disconnected' };
      const action = foundDeviceActionFactory(id);
      /* Run the devicesReducer */
      const state2 = devicesReducer(state1, action);
      expect(Object.keys(state2).length).toBe(1);
      expect(state2[id]).toBe('advertising');
    });
  });
  describe('CLEAR_ADVERTISING_DEVICE', () => {
    it('should clear the list of devices', () => {
      /* Create the actions */
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const clearAction: clearAdvertisingActionType = clearAdvertisingListFactory();
      /* Call the devicesReducer */
      const newState = devicesReducer(defaultState, addAction);
      expect(Object.values(defaultState).indexOf('advertising')).toBe(-1);
      expect(newState[id]).toBe('advertising');
      /* Clear the list */
      const newState1 = devicesReducer(newState, clearAction);
      expect(Object.keys(newState1).length).toBe(1);
      expect(newState1[id]).toBe('disconnected');
    });
  });
});

/* [] - END OF FILE */
