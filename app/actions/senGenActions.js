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
import type { stateType } from '../types/stateTypes';
import type { updateSelectedDeviceAction } from '../types/actionTypes';
import log from '../utils/loggingUtils';

export const UPDATE_SELECTED_DEVICES = 'UPDATE_SELECTED_DEVICES';

/* Set the file debug level */
// log.debugLevel = 5;
log.debug('senGenActions.js logging level set to:', log.debugLevel);


/* On Enter hook for the SenGen page - set the active device */
export function getSelectedDevices() {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the list of devices connected */
    const state = getState();
    /* use past values if present @TODO: rebuild this logic */
    const prevSensor = state.devices.selected.sensor;
    const prevGenerator = state.devices.selected.generator;
    let sensor;
    let generator;
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
      if (device.advertisement.localName === prevSensor) {
        sensor = prevSensor;
        findSensor = false;
      }
      if (device.advertisement.localName === prevGenerator) {
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
      const deviceName = device.advertisement.localName;
      /* see if the device has sensors */
      const deviceMeta = metadata[deviceName];
      /* Ensure valid metadata */
      if (!deviceMeta.sensing || !deviceMeta.actuation) {
        log.warn('getSelectedDevices: No metadata was found for device', deviceName);
      } else {
        /* If there are sensors, select as the active sensing device  */
        if (deviceMeta && deviceMeta.sensing.length) {
          /* Push first one to selected, all others to unselected */
          if (findSensor || device.advertisement.localName === sensor) {
            findSensor = false;
            sensor = device.advertisement.localName;
          } else {
            /* Push to unselected */
            unselected.sensors.push(device.advertisement.localName);
          }
        }
        /* Check about the generators */
        if (deviceMeta && deviceMeta.actuation.length) {
          if (findGenerator || device.advertisement.localName === generator) {
            findGenerator = false;
            generator = device.advertisement.localName;
          } else {
            /* Push to unselected */
            unselected.generators.push(device.advertisement.localName);
          }
        }
      }
    }
    /* Dispatch the event */
    dispatch(updateSelectedDevices(sensor, generator, unselected));
  };
}

/* A new active sensor has been selected */
export function setSelectedDevices(
  type: 'sensors' | 'generators',
  name: string
) {
  /* Return a function for redux */
  return (dispatch: () => void, getState: () => stateType): void => {
    const devices = getState().devices;
    const unselected = devices.unselected;
    let sensor = devices.selected.sensor;
    let generator = devices.selected.generator;
    if (type === 'sensors') {
      /* If there was a previously selected sensor */
      if (sensor) {
        /* Move the previous to the unselected */
        unselected.sensors.push(sensor);
      }
      /* Set the unselected */
      sensor = name;
      /* Remove the sensor from the unselected list */
      const index = unselected.sensors.indexOf(name);
      if (index >= 0) {
        unselected.sensors.splice(index, 1);
      }
    } else if (type === 'generators') {
      /* If a previous generator existed */
      if (generator) {
        unselected.generators.push(generator);
      }
      /* Set the unselected */
      generator = name;
      /* Remove the sensor from the unselected list */
      const index = unselected.generators.indexOf(name);
      if (index >= 0) {
        unselected.generators.splice(index, 1);
      }
    }
    dispatch(updateSelectedDevices(sensor, generator, unselected));
  };
}


/* Action creator to update the selected devices in the settings tab */
export function updateSelectedDevices(
  sensor: ?string,
  generator: ?string,
  unselected: {
    sensors: string[],
    generators: string[]
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
