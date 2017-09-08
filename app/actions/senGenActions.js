// @flow
/* **********************************************************
* File: actions/senGenAction.js
*
* Brief: Actions for the Sensor and Generator settings
*
* Author: Craig Cheney
* Date: 2017.08.30
*
********************************************************* */
import type { stateType, selectType } from '../types/stateTypes';
import type { updateSelectedDeviceAction } from '../types/actionTypes';
import log from '../utils/loggingUtils';

export const UPDATE_SELECTED_DEVICES = 'UPDATE_SELECTED_DEVICES';

/* Set the file debug level */
// log.debugLevel = 5;
log.debug('senGenActions.js logging level set to:', log.debugLevel);


/* On constructor for the SenGen page - set the active device */
export function getSelectedDevices() {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the list of devices connected */
    const state = getState();
    /* use past values if present @TODO: rebuild this logic */
    const prevSensor = state.devices.selected.sensor;
    const prevGenerator = state.devices.selected.generator;
    let sensor = {
      id: undefined,
      name: undefined
    };
    let generator = {
      id: undefined,
      name: undefined
    };
    const unselected = {
      sensors: [],
      generators: []
    };
    /* Flags indicating finding is necessary */
    let findSensor = true;
    let findGenerator = true;
    /* See if previous selection is valid */
    for (let index = 0; index < state.devices.connected.length; index += 1) {
      const device = state.devices.connected[index];
      if (device.id === prevSensor.id) {
        sensor = prevSensor;
        findSensor = false;
      }
      if (device.id === prevGenerator.id) {
        generator = prevGenerator;
        findGenerator = false;
      }
    }
    /* See if further work is needed */
    const devices = state.devices;
    const connectedDevices = devices.connected;
    const metadata = devices.metadata;
    /* iterate over device list and cross check against metadata */
    for (let i = 0; i < connectedDevices.length; i += 1) {
      /* Get the device id */
      const device = connectedDevices[i];
      /* see if the device has sensors */
      const deviceMeta = metadata[device.id];
      /* Ensure valid metadata */
      if (!deviceMeta || !deviceMeta.sensing || !deviceMeta.actuation) {
        log.warn('getSelectedDevices: No metadata was found for device', device.id);
      } else {
        /* If there are sensors, select as the active sensing device  */
        // if (deviceMeta && deviceMeta.sensing.length) {
        /* Push first one to selected, all others to unselected */
        const selectObj = {
          name: device.advertisement.localName,
          id: device.id
        };
        if (findSensor || device.id === sensor.id) {
          findSensor = false;
          sensor = selectObj;
        } else {
          /* Push to unselected */
          unselected.sensors.push(selectObj);
        }
        /* Check about the generators */
        // if (deviceMeta && deviceMeta.actuation.length) {
        if (findGenerator || device.id === generator.id) {
          findGenerator = false;
          generator = selectObj;
        } else {
          /* Push to unselected */
          unselected.generators.push(selectObj);
        }
        // }
      }
    }
    /* Dispatch the event */
    dispatch(updateSelectedDevices(sensor, generator, unselected));
  };
}

/* A new active sensor has been selected */
export function setSelectedDevices(
  type: 'sensors' | 'generators',
  newDevice: selectType
) {
  /* Return a function for redux */
  return (dispatch: () => void, getState: () => stateType): void => {
    const devices = getState().devices;
    const unselected = devices.unselected;
    let sensor = devices.selected.sensor;
    let generator = devices.selected.generator;
    if (type === 'sensors') {
      /* If there was a previously selected sensor */
      if (sensor.id) {
        /* Move the previous to the unselected */
        unselected.sensors.push(sensor);
      }
      /* Set the unselected */
      sensor = newDevice;
      /* Find the old sensor */
      const index = unselected.sensors.findIndex(obj => obj.id === newDevice.id);
      /* Remove the sensor from the unselected list */
      if (index >= 0) {
        unselected.sensors.splice(index, 1);
      }
    } else if (type === 'generators') {
      /* If a previous generator existed */
      if (generator) {
        unselected.generators.push(generator);
      }
      /* Set the unselected */
      generator = newDevice;
      /* Remove the sensor from the unselected list */
      const index = unselected.generators.findIndex(obj => obj.id === newDevice.id);
      if (index >= 0) {
        unselected.generators.splice(index, 1);
      }
    }
    dispatch(updateSelectedDevices(sensor, generator, unselected));
  };
}


/* Action creator to update the selected devices in the settings tab */
export function updateSelectedDevices(
  sensor: selectType,
  generator: selectType,
  unselected: {
    sensors: selectType[],
    generators: selectType[]
  }
): updateSelectedDeviceAction {
  return {
    type: UPDATE_SELECTED_DEVICES,
    payload: {
      sensor,
      generator,
      unselected
    }
  };
}

/* [] - END OF FILE */
