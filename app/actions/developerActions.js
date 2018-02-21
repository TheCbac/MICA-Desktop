/* @flow */
/* **********************************************************
* File: actions/developerAction.js
*
* Brief: Actions performed under the development tab
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - Document created
*
********************************************************* */
import { CMD_SET_NAME, micaCharUuids } from '../utils/mica/micaConstants';
import { bleWriteCharacteristic } from '../utils/BLE/bleFunctions';
import { updateDeviceName } from '../actions/devicesActions';
import type { thunkType } from '../types/functionTypes';
import type { stateType } from '../types/stateTypes';
import type { idType } from '../types/paramTypes';

export const SET_NAME = 'SET_NAME';
export const OTA_UPDATE = 'OTA_UPDATE';

/* Gather the active sensor and start collecting data */
export function setDeviceName(deviceId: idType, name: string): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    const { scanForDevices: { method } } = getState();
    /* Create the buffer */
    const setNameArray = [CMD_SET_NAME];
    for (let i = 0; i < name.length; i++) {
      setNameArray.push(name.charCodeAt(i));
    }
    console.log('setNameAction', setNameArray);
    /* Write the command */
    bleWriteCharacteristic(
      method,
      deviceId,
      micaCharUuids.controlCommands,
      setNameArray
    );
    /* Update the local name in the store */
    dispatch(updateDeviceName(deviceId, name));
  };
}

/* Initiate a Over The Air BLE application update */
export function initiateOtaUpdate(deviceId: idType, hexPath: string): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    console.log('initiateOtaUpdate', deviceId, hexPath);
    /* @TODO: pickup here */
  };
}
/* [] - END OF FILE */
