// @flow
/* **********************************************************
* File: actions/senGenAction.js
*
* Brief: Actions for the Sensor and Generator settings
*
* Author: Craig Cheney
* Date: 2017.08.30
*
**********************************************************/
import type { stateType } from '../types/stateTypes';
import type { setSelectedDeviceAction } from '../types/actionTypes';
import store from '../index';
import log from '../utils/loggingUtils';

export const SET_SELECTED_DEVICES = 'SET_SELECTED_DEVICES';

/* Set the file debug level */
log.debugLevel = 5;
log.debug('senGenActions.js logging level set to:', log.debugLevel);


/* On Enter hook for the SenGen page - set the active device */
export function getSelectedDevices() {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the list of devices connected */
    const state = getState();
    /* use past values if present */
    // let sensor = state.devices.selected.sensor;
    // let generator = state.devices.selected.generator;
    let sensor;
    let generator;
    /* Flags indicating finding is necessary */
    let findSensor = true;
    let findGenerator = true;
    /* See if further work is needed*/
    if (!sensor || !generator) {
      const devices = state.devices;
      const connectedDevices = devices.connected;
      const metadata = devices.metadata;
      /* iterate over device list and cross check against metadata */
      for (let i = 0; i < connectedDevices.length; i += 1) {
        /* Get the device id */
        const device = connectedDevices[i];
        const deviceId = device.id;
        /* see if the device has sensors */
        const deviceMeta = metadata[deviceId];
        /* Ensure valid metadata */
        if (!deviceMeta.sensing || !deviceMeta.actuation) {
          log.warn('getSelectedDevices: No metadata was found for device', deviceId);
        } else {
          /* If there are sensors, select as the active sensing device  */
          if (findSensor && deviceMeta && deviceMeta.sensing.length) {
            findSensor = false;
            sensor = device.advertisement.localName;
          }
          /* Check about the generators */
          if (findGenerator && deviceMeta && deviceMeta.actuation.length) {
            findGenerator = false;
            generator = device.advertisement.localName;
          }
          /* See if done */
          if (!findSensor && !findGenerator) { break; }
        }
      }
    }
    /* Dispatch the event */
    dispatch(setSelectedDevices(sensor, generator));
  };
}


/* Action creator to update the selected devices in the settings tab */
export function setSelectedDevices(sensor: ?string, generator: ?string): setSelectedDeviceAction {
  return {
    type: SET_SELECTED_DEVICES,
    payload: {
      sensor, generator
    }
  };
}

/* [] - END OF FILE */
