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
import { bleWriteCharacteristic } from '../utils/BLE/bleFunctions';
// import { writeCharacteristic } from '../utils/mica/micaNobleDevices';
import { micaCharUuids } from '../utils/mica/micaConstants';
import { resetDataBuffer, resetStartTime } from '../utils/dataStreams/graphBuffer';
import log from '../utils/loggingUtils';
import { encodeStartPacket, encodeStopPacket } from '../utils/mica/parseDataPacket';
import type { stateType, graphSettingsType } from '../types/stateTypes';
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

/* Gather the active sensor and start collecting data */
export function startCollecting(): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the new state */
    const { devices, scanForDevices } = getState();
    /* find all active devices */
    const deviceIdList = Object.keys(devices);
    /* Keep track of whether a sensor was started */
    let sensorStarted = false;
    /* Iterate over each device */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = devices[deviceId];
      /* Ensure the device is active */
      if (device.active) {
        /* PLACE HOLDER SAMPLE RATE */
        const sampleRate = 100;
        const { sensors } = device.settings;
        const startPacket = encodeStartPacket(sampleRate, sensors);
        // const startPacket = [1, 3, 232, 1, 1, 0];
        console.log('Start packet', startPacket);
        /* Only write if there were active sensors */
        if (startPacket.length) {
          sensorStarted = true;
          const result = bleWriteCharacteristic(
            scanForDevices.method,
            deviceId,
            micaCharUuids.sensorCommands,
            startPacket,
            (dId, charUuid, err) => {
              console.log('writeCharCallback:', dId, charUuid, err);
            },
            true
          );
          console.log('startCollecting: writeResult', result);
          /* Reset the data buffer */
          resetDataBuffer(deviceId);
          /* Reset the start time of the data collection */
          resetStartTime(deviceId);
        }
      }
    }
    /* Ensure that at least one sensor was started */
    if (sensorStarted) {
      /* Indicate that the device is being collected */
      dispatch(toggleCollectionState(true));
    }
  };
}

/* Stop collecting data */
export function stopCollecting(): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* get the new state */
    const { devices, scanForDevices } = getState();
    /* find all active devices */
    const deviceIdList = Object.keys(devices);
    /* Iterate over each device */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = devices[deviceId];
      /* Ensure the device is active */
      if (device.active) {
        /* Create the stop packet */
        const stopPacket = encodeStopPacket(device.settings.sensors);
        /* Write to the characteristic */
        bleWriteCharacteristic(
          scanForDevices.method,
          deviceId,
          micaCharUuids.sensorCommands,
          stopPacket,
          (dId, charUuid, err) => {
            if (err) {
              log.warn('writeCharCallback:', dId, charUuid, err);
            }
          },
          true
        );
      }
    }
    /* Update the object */
    dispatch(toggleCollectionState(false));

    // /* get the new state */
    // const state = getState();
    // const { settings } = state.devices;
    // /* find all active devices */
    // const deviceKeys = Object.keys(settings);
    // /* Iterate over each device */
    // for (let i = 0; i < deviceKeys.length; i++) {
    //   const deviceId = deviceKeys[i];
    //   const device = settings[deviceId];
    //   /* See if the device is active */
    //   if (device.active) {
    //     const stopPacket = encodeStopPacket(device.sensors);
    //     writeCharacteristic(deviceId, micaCharUuids.sensorCommands, stopPacket);
    //   }
    // }
    // /* Update the object */
    // dispatch(toggleCollectionState(false));
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
