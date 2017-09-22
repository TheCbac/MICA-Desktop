// @flow
/* eslint no-bitwise: 0 */
/* **********************************************************
* File: actions/collectionActions.js
*
* Brief: Actions that span the entire app
*
* Authors: Craig Cheney
*
* 2017.09.19 CC - Document created
*
********************************************************* */
import type {
  toggleCollectionStateActionType,
  updateGraphSettingsActionType
} from '../types/collectionActionTypes';
import { writeCharacteristic } from '../utils/mica/micaNobleDevices';
import { micaServiceUuid, micaCharUuids } from '../utils/mica/micaConstants';
import type { stateType, graphSettingsType } from '../types/stateTypes';
import { encodeStartPacket } from '../utils/mica/parseDataPacket';
import type { thunkType } from '../types/functionTypes';


export const TOGGLE_COLLECTION_STATE = 'TOGGLE_COLLECTION_STATE';
export const UPDATE_GRAPH_SETTINGS = 'UPDATE_GRAPH_SETTINGS';

/* Set the state whether or not the app is collecting data */
export function toggleCollectionState(newState: boolean): toggleCollectionStateActionType {
  return {
    type: TOGGLE_COLLECTION_STATE,
    payload: {
      newState
    }
  };
}

/* Start collecting data */
export function startCollecting(): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the new state */
    const state = getState();
    const { deviceSettings } = state.devices;
    /* find all active devices */
    const deviceKeys = Object.keys(deviceSettings);
    /* Iterate over each device */
    for (let i = 0; i < deviceKeys.length; i++) {
      const deviceId = deviceKeys[i];
      const device = deviceSettings[deviceId];
      /* See if the device is active */
      if (device.active) {
        /* Find all of the active sensors in the device */
        const sensorIds = Object.keys(device.sensors);
        const activeSensorList = [];
        for (let j = 0; j < sensorIds.length; j++) {
          const sensorId = sensorIds[j];
          const sensor = device.sensor[sensorId];
          /* See if the sensor is active */
          if (sensor.active) { activeSensorList.push(sensor); }
        }
        /* Only generate a start packet for a device that has active sensors */
        if (activeSensorList.length) {
          /* PLACE HOLDER SAMPLE RATE */
          const sampleRate = 100;
          const startPacket = encodeStartPacket(sampleRate, activeSensorList);
        }
      }
    }
    /* Write to the device */
    const device = state.devices.connected[0];
    const startCommand = [0x01, 0x03, 0xE8, 0x01, 0x01, 0x00];
    // sensingCommand.write(startCommand);
    writeCharacteristic(device.id, micaCharUuids.sensorCommands, startCommand);
    /* Update the object */
    dispatch(toggleCollectionState(true));
  };
}

/* Stop collecting data */
export function stopCollecting(): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the new state */
    const state = getState();
    /* Write to the device */
    const device = state.devices.connected[0];
    const { sensorCommands } = micaCharUuids;
    const stopCommand = [0x00, 0x01];
    writeCharacteristic(device.id, sensorCommands, stopCommand);
    /* Update the object */
    dispatch(toggleCollectionState(false));
  };
}

/* Update the graph settings */
export function updateGraphSettings(
  graphSettings: graphSettingsType
): updateGraphSettingsActionType {
  return {
    type: UPDATE_GRAPH_SETTINGS,
    payload: { ...graphSettings }
  };
}

/* [] - END OF FILE */
