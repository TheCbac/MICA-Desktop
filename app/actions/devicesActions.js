/* @flow */
/* **********************************************************
* File: actions/devicesActions.js
*
* Brief: Actions for the scanning devices
*
* Authors: Craig Cheney
*
* 2017.09.08 CC - Update for saving device settings
* 2017.07.10 CC - Document created
*
********************************************************* */
import { getSelectedDevices } from './senGenActions';
import micaSensorParams from '../utils/mica/micaSensorParams';
import type { noblePeripheralType, nobleIdType, deviceSettingsObjType,
  senGenParamType } from '../types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType,
  cancelConnectToDeviceActionType,
  disconnectedFromDeviceActionType,
  disconnectingFromDeviceActionType,
  lostConnectionFromDeviceActionType,
  reportMetaDataActionType,
  updateSenGenParamActionType
} from '../types/actionTypes';
import type { stateType } from '../types/stateTypes';
import type { metaDataObjType, moduleNameType } from '../types/metaDataTypes';
import type { thunkType } from '../types/functionTypes';

export const FOUND_ADVERTISING_DEVICE = 'FOUND_ADVERTISING_DEVICE';
export const CLEAR_ADVERTISING_LIST = 'CLEAR_ADVERTISING_LIST';
export const CONNECTING_TO_DEVICE = 'CONNECTING_TO_DEVICE';
export const CONNECTED_TO_DEVICE = 'CONNECTED_TO_DEVICE';
export const CANCEL_CONNECT_TO_DEVICE = 'CANCEL_CONNECT_TO_DEVICE';
export const DISCONNECTING_FROM_DEVICE = 'DISCONNECTING_FROM_DEVICE';
export const DISCONNECTED_FROM_DEVICE = 'DISCONNECTED_FROM_DEVICE';
export const LOST_CONNECTION_FROM_DEVICE = 'LOST_CONNECTION_FROM_DEVICE';
export const REPORT_META_DATA = 'REPORT_META_DATA';
export const UPDATE_SEN_GEN_PARAMS = 'UPDATE_SEN_GEN_PARAMS';

/* Action creator for when an advertising MICA device is discovered */
export function foundAdvertisingDevice(peripheral: noblePeripheralType): foundDeviceActionType {
  return {
    type: FOUND_ADVERTISING_DEVICE,
    payload: {
      peripheral
    }
  };
}

/* Clear the advertisement list */
export function clearAdvertisingList(): clearAdvertisingActionType {
  return {
    type: CLEAR_ADVERTISING_LIST,
  };
}

/* Move peripheral from advertising to connecting */
export function connectingToDevice(peripheralId: nobleIdType): connectingToDeviceActionType {
  return {
    type: CONNECTING_TO_DEVICE,
    payload: {
      peripheralId
    }
  };
}
/* Successfully connected, move from connecting to connected */
export function connectedToDevice(peripheralId: nobleIdType): connectedToDeviceActionType {
  return {
    type: CONNECTED_TO_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Cancel a pending connection */
export function cancelConnectToDevice(peripheralId: nobleIdType): cancelConnectToDeviceActionType {
  return {
    type: CANCEL_CONNECT_TO_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Disconnect from a connected device */
export function disconnectingFromDevice(
  peripheralId: nobleIdType
): disconnectingFromDeviceActionType {
  return {
    type: DISCONNECTING_FROM_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Disconnect from a connected device */
export function disconnectedFromDevice(
  peripheralId: nobleIdType
): disconnectedFromDeviceActionType {
  return {
    type: DISCONNECTED_FROM_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Disconnect from a connected device */
export function lostConnectionFromDevice(
  peripheralId: nobleIdType
): lostConnectionFromDeviceActionType {
  return {
    type: LOST_CONNECTION_FROM_DEVICE,
    payload: {
      peripheralId
    }
  };
}

/* Report Metadata */
export function reportMetaData(
  deviceId: nobleIdType,
  metaData: ?metaDataObjType,
  moduleName: ?moduleNameType
): reportMetaDataActionType {
  return {
    type: REPORT_META_DATA,
    payload: {
      peripheralId: deviceId,
      data: metaData,
      moduleName
    }
  };
}


/* Wrapper for reporting metadata - check to see if the metadata is complete */
export function metaDataReadComplete(
  deviceId: nobleIdType,
  metaData: ?metaDataObjType,
  moduleName: ?moduleNameType
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Report the metadata */
    dispatch(reportMetaData(deviceId, metaData, moduleName));
    /* Get the state  */
    const state = getState();
    /* Get the metadata for a device */
    const deviceMetadata = state.devices.metadata[deviceId];
    /* get the number of metadata reads */
    const numMetadata = Object.keys(deviceMetadata).length;
    /* If all of the modules have been read, update the selected device */
    if (numMetadata === 6) {
      dispatch(getSelectedDevices());
      /* Set the default parameters */
      dispatch(setDefaultSenGenParams(deviceId));
    }
  };
}

/* Read the default sensor parameters from the device */
export function setDefaultSenGenParams(deviceId: nobleIdType): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the current state */
    const devices = getState().devices;
    /* Get the metadata */
    const deviceMetadata = devices.metadata[deviceId];
    /* Ensure data is there */
    if (!deviceMetadata) { return; }
    /* get the sensing metadata */
    const sensingMeta = deviceMetadata.sensing;
    if (!sensingMeta) { return; }
    const sensorObj = {};
    const generatorObj = {};
    for (let i = 0; i < sensingMeta.length; i++) {
      const sensorMeta = sensingMeta[i];
      /* Get the sensor ID */
      const { id, scalingConstant, gain, offset, units } = sensorMeta;
      const sensorName = sensorMeta.type;
      /* Get the sensor params op */
      const sensorParams = micaSensorParams[id];
      /* Set the device channels */
      const channels = sensorParams.channels.default;
      /* Get the dynamic params keys */
      const dynamicParams = sensorParams.dynamicParams;
      const dynamicParamKeys = Object.keys(dynamicParams);
      const dynamicParamsDefault = {};
      /* Iterate through the parameters  */
      for (let j = 0; j < dynamicParamKeys.length; j++) {
        /* Get the parameter */
        const key = dynamicParamKeys[j];
        const { address } = dynamicParams[key];
        const defaultVal = dynamicParams[key].default;
        dynamicParamsDefault[key] = { address, value: defaultVal };
      }
      /* Construct the Sensor parameter object */
      const senParamObj: senGenParamType = {
        name: sensorName,
        active: !i,
        channels,
        scalingConstant,
        gain,
        offset,
        units,
        dynamicParams: dynamicParamsDefault
      };
      /* Push the sensor, set the first sensor active */
      sensorObj[id] = senParamObj;
    }
    /* Return the device settings */
    const deviceSettingsObj = {
      sensors: sensorObj,
      generators: generatorObj
    };
    dispatch(updateSenGenParams(deviceId, deviceSettingsObj));
  };
}


/* Set sensor on a device active or inactive  */
export function setSensorActive(
  deviceId: nobleIdType,
  sensorId: number | string,
  newState: boolean
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the state of the device settings - its assumed but
     * unverified if this provides a copy of the state object  */
    const deviceSettings = getState().devices.deviceSettings[deviceId];
    deviceSettings.sensors[sensorId].active = newState;
    /* Update the object */
    dispatch(updateSenGenParams(deviceId, deviceSettings));
  };
}

/* Update the the state of the channel or dynamic params */
export function setSensorChannels(
  deviceId: nobleIdType,
  sensorId: number | string,
  newChannels: number[]
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the state of the device settings */
    const deviceSettings = getState().devices.deviceSettings[deviceId];
    deviceSettings.sensors[sensorId].channels = newChannels;
    /* Update the store */
    dispatch(updateSenGenParams(deviceId, deviceSettings));
  };
}

/* Change the active parameters */
export function updateSenGenParams(
  deviceId: nobleIdType,
  deviceSettings: deviceSettingsObjType
): updateSenGenParamActionType {
  return {
    type: UPDATE_SEN_GEN_PARAMS,
    payload: {
      deviceId,
      deviceSettings
    }
  };
}

/* [] - END OF FILE */
