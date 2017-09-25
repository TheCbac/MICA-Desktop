// @flow
/* **********************************************************
* File: test/reducers/devicesReducer.spec.js
*
* Brief: testing deviceReducer.js
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.09.22 CC - Refactored for new state
* 2017.09.03 CC - Updated for correct flow usage
* 2017.07.25 GW - Document created
*
********************************************************* */
import devicesReducer from '../../app/reducers/devicesReducer';
import { deviceIdFactory } from '../factories/factories';
import {
  foundDeviceActionFactory,
  clearAdvertisingListFactory,
  connectingToDeviceActionFactory,
  connectedToDeviceActionFactory,
  cancelConnectToDeviceActionFactory,
  disconnectingFromDeviceActionFactory,
  disconnectedFromDeviceActionFactory,
  lostConnectionFromDeviceActionFactory,
  reportMetadataFactory
 } from '../factories/actionFactories';
import type { devicesStateType, devicesStateObjType } from '../../app/types/stateTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType,
  cancelConnectToDeviceActionType,
  disconnectingFromDeviceActionType,
  disconnectedFromDeviceActionType,
  lostConnectionFromDeviceActionType
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
      const newState: devicesStateType = devicesReducer(defaultState, action);
      expect(Object.keys(defaultState).length).toBe(0);
      const deviceIdList = Object.keys(newState);
      expect(deviceIdList.length).toBe(1);
      /* Everything should be advertising */
      const id = deviceIdList[0];
      const device = newState[id];
      expect(device.state).toBe('advertising');
      expect(typeof device.name).toBe('string');
      expect(typeof device.rssi).toBe('number');
      expect(typeof device.address).toBe('string');
      /* Add second device */
      const newState1: devicesStateType = devicesReducer(newState, action1);
      expect(Object.keys(newState).length).toBe(1);
      expect(Object.keys(newState1).length).toBe(2);
      /* Everything should be advertising */
      const values1: devicesStateObjType[] = Object.values(newState1);
      for (let i = 0; i < values1.length; i++) {
        expect(values1[i].state).toBe('advertising');
      }
      /* Make sure the keys are correctly included */
      const idList = Object.keys(newState1);
      expect(idList.indexOf(action.payload.deviceId)).toBeGreaterThanOrEqual(0);
      expect(idList.indexOf(action1.payload.deviceId)).toBeGreaterThanOrEqual(0);
    });
    it('Should change a disconnected device to an advertising device', () => {
      const id = deviceIdFactory();
      /* default state */
      const state1: devicesStateType = { [id]: {
        state: 'disconnected',
        metadata: {},
        settings: {}
      } };
      const action = foundDeviceActionFactory(id);
      /* Run the devicesReducer */
      const state2: devicesStateType = devicesReducer(state1, action);
      expect(Object.keys(state2).length).toBe(1);
      expect(state2[id].state).toBe('advertising');
    });
  });
  describe('CLEAR_ADVERTISING_DEVICE', () => {
    it('should clear the list of devices', () => {
      /* Create the actions */
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const clearAction: clearAdvertisingActionType = clearAdvertisingListFactory();
      /* Call the devicesReducer */
      const newState: devicesStateType = devicesReducer(defaultState, addAction);
      expect(Object.values(defaultState).indexOf('advertising')).toBe(-1);
      expect(newState[id].state).toBe('advertising');
      /* Clear the list */
      const newState1: devicesStateType = devicesReducer(newState, clearAction);
      expect(Object.keys(newState1).length).toBe(1);
      expect(newState1[id].state).toBe('disconnected');
    });
  });
  describe('CONNECTING_TO_DEVICE', () => {
    it('should change the device state to connecting', () => {
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const addState: devicesStateType = devicesReducer(defaultState, addAction);
      /* Connect to the device */
      const connectingAction: connectingToDeviceActionType = connectingToDeviceActionFactory(id);
      const connectingState = devicesReducer(addState, connectingAction);
      expect(connectingState[id].state).toBe('connecting');
    });
  });
  describe('CONNECTED_TO_DEVICE', () => {
    it('should change a device state from connecting to connected', () => {
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const addState: devicesStateType = devicesReducer(defaultState, addAction);
      /* Connect to the device */
      const connectingAction: connectingToDeviceActionType = connectingToDeviceActionFactory(id);
      const connectingState = devicesReducer(addState, connectingAction);
      expect(connectingState[id].state).toBe('connecting');
      /* Connect to the device */
      const connectedAction: connectedToDeviceActionType = connectedToDeviceActionFactory(id);
      const connectedState = devicesReducer(connectingState, connectedAction);
      expect(connectedState[id].state).toBe('connected');
      expect(connectedState[id].settings.active).toBe(true);
    });
  });
  describe('CANCEL_CONNECT_TO_DEVICE', () => {
    it('should change a device state from connecting to advertising', () => {
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const addState: devicesStateType = devicesReducer(defaultState, addAction);
      /* Connect to the device */
      const connectingAction: connectingToDeviceActionType = connectingToDeviceActionFactory(id);
      const connectingState = devicesReducer(addState, connectingAction);
      expect(connectingState[id].state).toBe('connecting');
      /* Cancel connect to the device */
      const cancelAction: cancelConnectToDeviceActionType = cancelConnectToDeviceActionFactory(id);
      const cancelConnectState = devicesReducer(connectingState, cancelAction);
      expect(cancelConnectState[id].state).toBe('advertising');
    });
  });
  describe('DISCONNECTING_FROM_DEVICE', () => {
    it('should change a device state from connected to disconnecting', () => {
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const addState: devicesStateType = devicesReducer(defaultState, addAction);
      /* Connect to the device */
      const connectingAction: connectingToDeviceActionType = connectingToDeviceActionFactory(id);
      const connectingState = devicesReducer(addState, connectingAction);
      expect(connectingState[id].state).toBe('connecting');
      /* Connect to the device */
      const connectedAction: connectedToDeviceActionType = connectedToDeviceActionFactory(id);
      const connectedState = devicesReducer(connectingState, connectedAction);
      expect(connectedState[id].state).toBe('connected');
      expect(connectedState[id].settings.active).toBe(true);
      /* Connect to the device */
      const disconnectingAction: disconnectingFromDeviceActionType =
        disconnectingFromDeviceActionFactory(id);
      const disconnectingState = devicesReducer(connectedState, disconnectingAction);
      expect(disconnectingState[id].state).toBe('disconnecting');
      expect(disconnectingState[id].settings.active).toBe(false);
    });
  });
  describe('DISCONNECTED_FROM_DEVICE', () => {
    it('should change a device state from disconnecting to advertising', () => {
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const addState: devicesStateType = devicesReducer(defaultState, addAction);
      /* Connect to the device */
      const connectingAction: connectingToDeviceActionType = connectingToDeviceActionFactory(id);
      const connectingState = devicesReducer(addState, connectingAction);
      expect(connectingState[id].state).toBe('connecting');
      /* Connect to the device */
      const connectedAction: connectedToDeviceActionType = connectedToDeviceActionFactory(id);
      const connectedState = devicesReducer(connectingState, connectedAction);
      expect(connectedState[id].state).toBe('connected');
      expect(connectedState[id].settings.active).toBe(true);
      /* Connect to the device */
      const disconnectingAction: disconnectingFromDeviceActionType =
        disconnectingFromDeviceActionFactory(id);
      const disconnectingState = devicesReducer(connectedState, disconnectingAction);
      expect(disconnectingState[id].state).toBe('disconnecting');
      expect(disconnectingState[id].settings.active).toBe(false);
      /* Connect to the device */
      const disconnectedAction: disconnectedFromDeviceActionType =
      disconnectedFromDeviceActionFactory(id);
      const disconnectedState = devicesReducer(disconnectingState, disconnectedAction);
      expect(disconnectedState[id].state).toBe('advertising');
      expect(disconnectedState[id].settings.active).toBe(false);
    });
  });
  describe('LOST_CONNECTION_FROM_DEVICE', () => {
    it('should change a device state from connected to advertising', () => {
      const id = deviceIdFactory();
      const addAction: foundDeviceActionType = foundDeviceActionFactory(id);
      const addState: devicesStateType = devicesReducer(defaultState, addAction);
      /* Connect to the device */
      const connectingAction: connectingToDeviceActionType = connectingToDeviceActionFactory(id);
      const connectingState = devicesReducer(addState, connectingAction);
      expect(connectingState[id].state).toBe('connecting');
      /* Connect to the device */
      const connectedAction: connectedToDeviceActionType = connectedToDeviceActionFactory(id);
      const connectedState = devicesReducer(connectingState, connectedAction);
      expect(connectedState[id].state).toBe('connected');
      expect(connectedState[id].settings.active).toBe(true);
      /* Connect to the device */
      const lostConnectionAction: lostConnectionFromDeviceActionType =
      lostConnectionFromDeviceActionFactory(id);
      const lostConnectionState = devicesReducer(connectedState, lostConnectionAction);
      expect(lostConnectionState[id].state).toBe('advertising');
      expect(lostConnectionState[id].settings.active).toBe(false);
    });
  });
  /* Metadata */
  describe('REPORT_META_DATA', () => {
    it('should accept metadata object with one module', () => {
      const deviceId = deviceIdFactory();
      /* Add a device */
      const foundAction: foundDeviceActionType = foundDeviceActionFactory(deviceId);
      const foundState: devicesStateType = devicesReducer(defaultState, foundAction);
      /* Report metadata */
      const metadataAction = reportMetadataFactory(deviceId);
      const metadataState: devicesStateType = devicesReducer(foundState, metadataAction);
      /* iterate through all of the modules contained in the metadata */
      const moduleList = Object.keys(metadataAction.payload.data);
      for (let i = 0; i < moduleList.length; i++) {
        const module = moduleList[i];
        expect(metadataState[deviceId].metadata[module])
          .toEqual(metadataAction.payload.data[module]);
      }
    });
  });
});

/* [] - END OF FILE */
