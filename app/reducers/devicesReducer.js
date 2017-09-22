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
  devicesStateType
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
  updateSelectedDeviceAction,
  updateSenGenParamActionType
} from '../types/actionTypes';
import { getPeripheralFromList } from '../utils/deviceUtils';


/* Default state of the devicesReducer */
export const defaultState: devicesStateType = { };

/* Handlers to create reducers  */
const deviceHandlers = {
  /* Clear the advertising list */
  CLEAR_ADVERTISING_LIST(
    state: devicesStateType,
    action: clearAdvertisingActionType
  ): devicesStateType {
    /* Find all of the devices that are advertising */
    const advList = [];
    const deviceList = Object.keys(state);
    for (let i = 0; i < deviceList.length; i++) {
      const id = deviceList[i];
      if (state[id] === 'advertising') {
        advList.push(id);
      }
    }
    /* Remove all objects who are advertising */
    const removeAdvState = update(state, { $unset: advList });
    /* Create an object to push back in */
    const disconnectObj = {};
    for (let j = 0; j < advList.length; j++) {
      disconnectObj[advList[j]] = 'disconnected';
    }

    return update(removeAdvState, { $merge: disconnectObj });
    // /* Set all advertising devices to disconnected */
    // return update(state, { $apply:
    //   // eslint-disable-next-line arrow-body-style
    //   // (val) => { return (val === 'advertising') ? 'disconnected' : val; }
    //   (state) => { return (val === 'advertising') ? 'disconnected' : val; }

    // });
  },
  /* An advertising device was found */
  FOUND_ADVERTISING_DEVICE(
    state: devicesStateType,
    action: foundDeviceActionType,
  ): devicesStateType {
    const deviceId = action.payload.deviceId;
    /* See if the device is already in the list */
    const deviceList = Object.keys(state);
    if (deviceList.indexOf(deviceId) >= 0) {
      /* Set the disconnected device to advertising */
      return update(state, { [deviceId]: { $set: 'advertising' } });
    }
    /* No existing device was found, add a new one to the list */
    return update(state, { $merge: { [deviceId]: 'advertising' } });
  },
  /* Attempting to connect to a device: move from advertising to connecting */
  CONNECTING_TO_DEVICE(
    state: devicesStateType,
    action: connectingToDeviceActionType
  ): devicesStateType {
    /* Get the peripheral and index from the advertising list */
    const { peripheral, index } = getPeripheralFromList(
      state.advertising, action.payload.peripheralId
    );
    if (!peripheral) { return state; }
    /* Add the peripheral to the connecting list */
    /* Remove the peripheral from the advertising list */
    return update(state, {
      connecting: { $push: [peripheral] },
      advertising: { $splice: [[index, 1]] }
    });
  },
  /* Connection successful, move from connecting list to connected */
  CONNECTED_TO_DEVICE(
    state: devicesStateType,
    action: connectedToDeviceActionType
  ): devicesStateType {
    /* Get the peripheral and index from the connecting list */
    const { peripheral, index } = getPeripheralFromList(
      state.connecting, action.payload.peripheralId
    );
    if (!peripheral) { return state; }
    /* Add to connected, remove from connecting */
    const state1 = update(state, {
      connected: { $push: [peripheral] },
      connecting: { $splice: [[index, 1]] }
    });
    /* Create a metadata object for the device - Overrides previous */
    const metaObj = { };
    metaObj[action.payload.peripheralId] = {};
    return update(state1, { metadata: { $merge: metaObj } });
    /* Create the default sensor and generator settings */

    // return update(state2, { deviceSettings: { $push:}})
  },
  /* Cancel a pending connection */
  CANCEL_CONNECT_TO_DEVICE(
    state: devicesStateType,
    action: cancelConnectToDeviceActionType
  ): devicesStateType {
    /* Get the peripheral and index from the connecting list */
    const { peripheral, index } = getPeripheralFromList(
      state.connecting, action.payload.peripheralId
    );
    if (!peripheral) { return state; }
    /* Add to advertising, remove from connecting */
    return update(state, {
      advertising: { $push: [peripheral] },
      connecting: { $splice: [[index, 1]] }
    });
  },
  /* Attempting to disconnect from a device: move from connected to disconnected */
  DISCONNECTING_FROM_DEVICE(
    state: devicesStateType,
    action: disconnectingFromDeviceActionType
  ): devicesStateType {
    /* Get the peripheral and index from the advertising list */
    const { peripheral, index } = getPeripheralFromList(
      state.connected, action.payload.peripheralId
    );
    if (!peripheral) { return state; }
    /* Add the peripheral to the disconnecting list */
    /* Remove the peripheral from the connected list */
    return update(state, {
      disconnecting: { $push: [peripheral] },
      connected: { $splice: [[index, 1]] }
    });
  },
  /* Disconnection successful, remove from disconnecting list */
  DISCONNECTED_FROM_DEVICE(
    state: devicesStateType,
    action: disconnectedFromDeviceActionType
  ): devicesStateType {
    const deviceId = action.payload.peripheralId;
    /* Get the peripheral and index from the disconnecting list */
    const { peripheral, index } = getPeripheralFromList(
      state.disconnecting, deviceId
    );
    /* Device was */
    if (!peripheral) { return state; }
    /* Remove the peripheral from the disconnecting list */
    return update(state, {
      advertising: { $push: [peripheral] },
      disconnecting: { $splice: [[index, 1]] },
      deviceSettings: { [deviceId]: { active: { $set: false } } }
    });
  },
  /* Device was abruptly lost, remove from connected list */
  LOST_CONNECTION_FROM_DEVICE(
    state: devicesStateType,
    action: lostConnectionFromDeviceActionType
  ): devicesStateType {
    const deviceId = action.payload.peripheralId;
    /* Get the peripheral and index from the connected list */
    const { peripheral, index } = getPeripheralFromList(
      state.connected, deviceId
    );
    /* Device was */
    if (!peripheral) { return state; }
    /* Remove the peripheral from the connected list */
    return update(state, {
      advertising: { $push: [peripheral] },
      connected: { $splice: [[index, 1]] },
      deviceSettings: { [deviceId]: { active: { $set: false } } }
    });
  },
  /* Metadata was read in successfully */
  REPORT_META_DATA(
    state: devicesStateType,
    action: reportMetaDataActionType
  ): devicesStateType {
    const deviceId = action.payload.peripheralId;
    /* Get the peripheral and index from the connected list */
    const { peripheral } = getPeripheralFromList(state.connected, deviceId);
    /* Ensure the peripheral was found */
    if (!peripheral) { return state; }
    /* Find the module name @TODO: this should be changed the metaObjType */
    let metadata = action.payload.data;
    /* If there are no devices in a module, populate as empty array */
    if (metadata == null) {
      metadata = [];
    }
    const moduleName = action.payload.moduleName;
    /* Ensure valid data was reported */
    if (!moduleName) { return state; }
    /* Create an obj who has a key of the module in question */
    const deviceMetaObj = { };
    deviceMetaObj[moduleName] = metadata;
    /* Update the stored Metadata object.  */
    return update(state, { metadata: { [deviceId]: { $merge: deviceMetaObj } } });
  },
  /* Get the devices that have been selected */
  UPDATE_SELECTED_DEVICES(
    state: devicesStateType,
    action: updateSelectedDeviceAction
  ): devicesStateType {
    /* Set the values directly */
    return update(state, {
      selected: { $set: {
        sensor: action.payload.sensor,
        generator: action.payload.generator
      } },
      unselected: { $set: action.payload.unselected }
    });
  },
  /* Update the active settings for a device */
  UPDATE_SEN_GEN_PARAMS(
    state: devicesStateType,
    action: updateSenGenParamActionType
  ): devicesStateType {
    /* set the new values */
    return update(state, {
      deviceSettings: {
        [action.payload.deviceId]: {
          $set: action.payload.deviceSettings
        }
      }
    });
  }
};

export default createReducer(defaultState, deviceHandlers);

/* [] - END OF FILE */
