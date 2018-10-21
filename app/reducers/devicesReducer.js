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
  updateSenGenParamActionType,
  setDeviceActiveActionType,
  setSensorChannelsActionT,
  setSensorRangeActionT,
  updateZeroActionType,
  updateDeviceNameT
} from '../types/actionTypes';


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
          { [id]: { state: { $set: 'disconnected' } } });
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
      active: false,
      metadata: {
        energy: {},
        actuation: {},
        power: {},
        sensing: {},
        communication: {},
        control: {}
      },
      settings: {
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
      active: { $set: true }
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
      active: { $set: false }
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
    return update(state, { [id]: {
      state: { $set: 'advertising' },
      active: { $set: false }
    } });
  },
  /* Device was abruptly lost, remove from connected list, no matter the state */
  LOST_CONNECTION_FROM_DEVICE(
    state: devicesStateType,
    action: lostConnectionFromDeviceActionType
  ): devicesStateType {
    const id = action.payload.deviceId;
    /* Control state flow */
    // if (state[id].state !== 'connected') {
    //   return state;
    // }
    return update(state, { [id]: {
      state: { $set: 'advertising' },
      active: { $set: false }
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
  },
  /* Select which channels are active */
  SET_SENSOR_CHANNELS(
    state: devicesStateType,
    action: setSensorChannelsActionT
  ): devicesStateType {
    const { deviceId, sensorId, channels } = action.payload;
    /* Make a copy of the state */
    let updatedState = update(state, {});
    /* Get the IDs of all the channels in the sensors */
    const channelIds = Object.keys(
      state[deviceId].settings.sensors[parseInt(sensorId, 10)].channels
    );
    console.log('SET_SENSOR', channelIds);
    /* Iterate though all of the channels */
    for (let i = 0; i < channelIds.length; i++) {
      const channelId = parseInt(channelIds[i], 10);
      /* See if that channel is supposed to be active */
      const channelState: boolean = channels.indexOf(channelId) >= 0;
      /* Set all the channels active or not */
      updatedState = update(updatedState, {
        [deviceId]: {
          settings: {
            sensors: { [sensorId]: { channels: { [channelId]: { active: { $set: channelState } } } } }
          }
        }
      });
    }
    return updatedState;
  },
  /* Select the range (and gain) of the device */
  SET_SENSOR_RANGE(
    state: devicesStateType,
    action: setSensorRangeActionT
  ): devicesStateType {
    const { deviceId, sensorId, range, gain } = action.payload;
    /* Set the new values */
    return update(state, {
      [deviceId]: {
        settings: { sensors: { [sensorId]: {
          gain: { $set: gain },
          dynamicParams: { range: { value: { $set: range } } }
        } } },
      }
    });
  },
  /* Set a device active or not */
  SET_DEVICE_ACTIVE(
    state: devicesStateType,
    action: setDeviceActiveActionType
  ): devicesStateType {
    /* Extract parameters */
    const { deviceId, newState } = action.payload;
    /* Set the device to the new state */
    return update(state, {
      [deviceId]: {
        active: { $set: newState }
      }
    });
  },
  UPDATE_ZERO(
    state: devicesStateType,
    action: updateZeroActionType
  ): devicesStateType {
    /* Extract parameters */
    const { deviceId, sensorId, newZero } = action.payload;
    console.log('reduceUpdateZero', newZero);
    let updatedState = update(state, {});
    const channelIds = Object.keys(newZero);
    for (let i = 0; i < channelIds.length; i++) {
      const channelId = channelIds[i];
      const val = newZero[parseInt(channelId, 10)];
      updatedState = update(updatedState, {
        [deviceId]: {
          settings: {
            sensors: {
              [sensorId]: {
                channels: {
                  [channelId]: {
                    offset: { $set: val }
                  }
                }
              }
            }
          }
        }
      });
    }
    return updatedState;
  },
  /* Update the local name of the device */
  UPDATE_DEVICE_NAME(
    state: devicesStateType,
    action: updateDeviceNameT
  ): devicesStateType {
    /* Extract parameters */
    const { deviceId, name } = action.payload;
    return update(state, {
      [deviceId]: {
        name: {
          $set: name
        }
      }
    });
  }
};

export default createReducer(defaultState, deviceHandlers);

/* [] - END OF FILE */
