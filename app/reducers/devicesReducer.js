// @flow
/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* **********************************************************
* File: reducers/devicesReducer.js
*
* Brief: Reducer for interactive with devices
*
* Author: Craig Cheney
* Date: 2017.07.10
*
********************************************************* */
import update from 'immutability-helper';
import createReducer from './createReducer';
import type {
  devicesStateType,
  devicesStateObjType
} from '../types/stateTypes';
import type {
  clearAdvertisingActionType,
  foundDeviceActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType,
  cancelConnectToDeviceActionType,
  disconnectingFromDeviceActionType,
  disconnectedFromDeviceActionType,
  lostConnectionFromDeviceActionType,
  reportMetaDataActionType,
  updateSenGenParamActionType
} from '../types/actionTypes';
import { getPeripheralFromList } from '../utils/deviceUtils';


/* Default state of the devicesReducer */
export const defaultState: devicesStateType = { };

/* Handlers to create reducers  */
const deviceHandlers = {
  /* Clear the advertising list - Must be a more succinct way of writing this */
  CLEAR_ADVERTISING_LIST(
    state: devicesStateType,
    action: clearAdvertisingActionType
  ): devicesStateType {
    /* Find all of the devices */
    const deviceList = Object.keys(state);
    /* make a copy of the state */
    let updatedState = update(state, {});
    /* Iterate over each object */
    for (let i = 0; i < deviceList.length; i++) {
      const id = deviceList[i];
      const device = state[id];
      /* Check if it is advertising */
      if (device.state === 'advertising') {
        updatedState = update(updatedState,
          { [id]: { state: { $set: 'disconnected' } } }
        );
      }
    }
    return updatedState;
  },
  /* An advertising device was found */
  FOUND_ADVERTISING_DEVICE(
    state: devicesStateType,
    action: foundDeviceActionType,
  ): devicesStateType {
    const { deviceId, address, name, rssi } = action.payload;
    /* See if the device is already in the list */
    const deviceList = Object.keys(state);
    if (deviceList.indexOf(deviceId) >= 0) {
      /* Set the disconnected device to advertising */
      return update(state, { [deviceId]: {
        state: { $set: 'advertising' },
        address: { $set: address },
        name: { $set: name },
        rssi: { $set: rssi },
      } });
    }
    /* No existing device was found, add a new one to the list */
    const newDevice: devicesStateObjType = {
      state: 'advertising',
      address,
      name,
      rssi,
      metadata: {
        energy: {},
        actuation: {},
        power: {},
        sensing: {},
        communication: {},
        control: {}
      },
      settings: {
        active: false,
        sensors: {},
        generators: {}
      }
    };
    return update(state, { $merge: { [deviceId]: newDevice } });
  },
  /* Attempting to connect to a device: set from advertising to connecting */
  CONNECTING_TO_DEVICE(
    state: devicesStateType,
    action: connectingToDeviceActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Control state flow */
    if (state[id].state !== 'advertising') {
      return state;
    }
    return update(state, { [id]: { state: { $set: 'connecting' } } });
  },
  /* Connection successful, move from connecting list to connected */
  CONNECTED_TO_DEVICE(
    state: devicesStateType,
    action: connectedToDeviceActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Control state flow */
    if (state[id].state !== 'connecting') {
      return state;
    }
    return update(state, { [id]: {
      state: { $set: 'connected' },
      settings: { active: { $set: true } }
    } });
  },
  /* Cancel a pending connection */
  CANCEL_CONNECT_TO_DEVICE(
    state: devicesStateType,
    action: cancelConnectToDeviceActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Control state flow */
    if (state[id].state !== 'connecting') {
      return state;
    }
    return update(state, { [id]: { state: { $set: 'advertising' } } });
  },
  /* Attempting to disconnect from a device: move from connected to disconnected */
  DISCONNECTING_FROM_DEVICE(
    state: devicesStateType,
    action: disconnectingFromDeviceActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Control state flow */
    if (state[id].state !== 'connected') {
      return state;
    }
    return update(state, { [id]: {
      state: { $set: 'disconnecting' },
      settings: { active: { $set: false } }
    } });
  },
  /* Disconnection successful, remove from disconnecting list */
  DISCONNECTED_FROM_DEVICE(
    state: devicesStateType,
    action: disconnectedFromDeviceActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Control state flow */
    if (state[id].state !== 'disconnecting') {
      return state;
    }
    return update(state, { [id]: { state: { $set: 'advertising' } } });
  },
  /* Device was abruptly lost, remove from connected list */
  LOST_CONNECTION_FROM_DEVICE(
    state: devicesStateType,
    action: lostConnectionFromDeviceActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Control state flow */
    if (state[id].state !== 'connected') {
      return state;
    }
    return update(state, { [id]: {
      state: { $set: 'advertising' },
      settings: { active: { $set: false } }
    } });
  },
  /* Metadata was read in successfully */
  REPORT_META_DATA(
    state: devicesStateType,
    action: reportMetaDataActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Get the list of keys */
    const moduleList = Object.keys(action.payload.data);
    /* Create a copy of the state */
    let updatedState = update(state, {});
    /* Iterate through all of the modules */
    for (let i = 0; i < moduleList.length; i++) {
      const module = moduleList[i];
      updatedState = update(updatedState, { [id]: {
        metadata:
          { [module]: { $set: action.payload.data[module] } }
      } });
    }
    return updatedState;
    /* Update the stored Metadata object.  */
    // return update(state, { [id]: { metadata: { $set: action.payload.data } } });
  },
  /* Update the active settings for a device */
  UPDATE_SEN_GEN_PARAMS(
    state: devicesStateType,
    action: updateSenGenParamActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Set the new values */
    return update(state, {
      [id]: {
        settings: { $set: action.payload.deviceSettings }
      }
    });
  }
};

export default createReducer(defaultState, deviceHandlers);

/* [] - END OF FILE */
