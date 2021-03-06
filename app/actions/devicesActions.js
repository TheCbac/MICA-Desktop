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
import micaSensorParams from '../utils/mica/micaSensorParams';
import micaGeneratorParams from '../utils/mica/micaGeneratorParams';
import type { idType, deviceSettingsObjType,
  generatorParamType, newDeviceObjType,
  sensorListType, generatorListType,
  deviceRangeParamT, channelsT
} from '../types/paramTypes';
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
  updateSenGenParamActionType,
  setDeviceActiveActionType,
  setSensorChannelsActionT,
  setSensorRangeActionT,
  updateDeviceNameT
} from '../types/actionTypes';
import type { stateType } from '../types/stateTypes';
import type {
  metaDataObjType,
  sensingObjs,
  actuationObjs
} from '../types/metaDataTypes';
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
export const SET_DEVICE_ACTIVE = 'SET_DEVICE_ACTIVE';
export const SET_SENSOR_CHANNELS = 'SET_SENSOR_CHANNELS';
export const SET_SENSOR_RANGE = 'SET_SENSOR_RANGE';
export const UPDATE_DEVICE_NAME = 'UPDATE_DEVICE_NAME';


/* Action creator for when an advertising MICA device is discovered */
export function foundAdvertisingDevice(deviceObj: newDeviceObjType): foundDeviceActionType {
  /* Could use a spread operator - destructure and pass back for clarity */
  const { deviceId, name, rssi, address } = deviceObj;
  return {
    type: FOUND_ADVERTISING_DEVICE,
    payload: {
      deviceId,
      name,
      rssi,
      address
    }
  };
}

/* Clear the advertisement list */
export function clearAdvertisingList(): clearAdvertisingActionType {
  return {
    type: CLEAR_ADVERTISING_LIST,
    payload: {}
  };
}

/* Move peripheral from advertising to connecting */
export function connectingToDevice(deviceId: idType): connectingToDeviceActionType {
  return {
    type: CONNECTING_TO_DEVICE,
    payload: {
      deviceId
    }
  };
}
/* Successfully connected, move from connecting to connected */
export function connectedToDevice(deviceId: idType): connectedToDeviceActionType {
  return {
    type: CONNECTED_TO_DEVICE,
    payload: {
      deviceId
    }
  };
}

/* Cancel a pending connection */
export function cancelConnectToDevice(deviceId: idType): cancelConnectToDeviceActionType {
  return {
    type: CANCEL_CONNECT_TO_DEVICE,
    payload: {
      deviceId
    }
  };
}

/* Disconnect from a connected device */
export function disconnectingFromDevice(
  deviceId: idType
): disconnectingFromDeviceActionType {
  return {
    type: DISCONNECTING_FROM_DEVICE,
    payload: {
      deviceId
    }
  };
}

/* Disconnect from a connected device */
export function disconnectedFromDevice(
  deviceId: idType
): disconnectedFromDeviceActionType {
  return {
    type: DISCONNECTED_FROM_DEVICE,
    payload: {
      deviceId
    }
  };
}

/* Disconnect from a connected device */
export function lostConnectionFromDevice(
  deviceId: idType
): lostConnectionFromDeviceActionType {
  return {
    type: LOST_CONNECTION_FROM_DEVICE,
    payload: {
      deviceId
    }
  };
}

/* Report Metadata */
export function reportMetaData(
  deviceId: idType,
  metaData: metaDataObjType,
): reportMetaDataActionType {
  return {
    type: REPORT_META_DATA,
    payload: {
      deviceId,
      data: metaData,
    }
  };
}
/* Wrapper for reporting metadata - check to see if the metadata is complete */
export function metaDataReadComplete(
  deviceId: idType,
  metadata: metaDataObjType,
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the existing params */
    const existingSettings = getState().devices[deviceId].settings;
    /* Report the metadata */
    dispatch(reportMetaData(deviceId, metadata));
    const modules = Object.keys(metadata);
    for (let i = 0; i < modules.length; i++) {
      const moduleName = modules[i];
      const module = metadata[moduleName];
      if (moduleName === 'sensing') {
        /* Update sensor settings */
        const sensorSettings = constructSensorSettings(module);
        existingSettings.sensors = sensorSettings;
        dispatch(updateSenGenParams(deviceId, existingSettings));
      } else if (moduleName === 'actuation') {
        const generatorSettings = constructGeneratorSettings(module);
        existingSettings.generators = generatorSettings;
        dispatch(updateSenGenParams(deviceId, existingSettings));
      }
    }
  };
}

/* Extract the default sensor settings */
function constructSensorSettings(sensingMeta: sensingObjs): sensorListType {
  const sensorSettings = {};
  const sensorIdList = Object.keys(sensingMeta);
  /* Iterate through each sensor reported */
  for (let i = 0; i < sensorIdList.length; i++) {
    const sensorId = sensorIdList[i];
    /* Extract the reported settings */
    const { type: name, scalingConstant, gain, units } = sensingMeta[parseInt(sensorId, 10)];
    /* Look up the dynamic params */
    const sensorParams = micaSensorParams[sensorId];
    const channels = sensorParams.channels.default;
    const dynamicParams = sensorParams.dynamicParams;
    const dynamicParamKeys = Object.keys(dynamicParams);
    const dynamicParamsDefault = {};
    /* Iterate through the dynamic params */
    for (let j = 0; j < dynamicParamKeys.length; j++) {
      /* Get the parameter */
      const key = dynamicParamKeys[j];
      const { address } = dynamicParams[key];
      const defaultVal = dynamicParams[key].default;
      dynamicParamsDefault[key] = { address, value: defaultVal };
    }
    /* Add the settings */
    sensorSettings[sensorId] = {
      name,
      active: !i, /* Set first sensor active by default */
      channels,
      scalingConstant,
      gain,
      units,
      sampleRate: 100,
      dynamicParams: dynamicParamsDefault
    };
  }
  return sensorSettings;
}

/* Get the sensing devices settings from the metadata */
function constructGeneratorSettings(actuationMeta: actuationObjs): generatorListType {
  const generatorObj = {};
  const generatorIdList = Object.keys(actuationMeta);
  for (let i = 0; i < generatorIdList.length; i++) {
    const actuationId = generatorIdList[i];
    /* Get the sensor ID */
    const { type: name } = actuationMeta[parseInt(actuationId, 10)];
    /* Get the sensor params op */
    const actuatorParams = micaGeneratorParams[actuationId];
    /* Set the device channels */
    const channels = actuatorParams.channels.default;
    /* Get the dynamic params keys */
    const dynamicParams = actuatorParams.dynamicParams;
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
    const senParamObj: generatorParamType = {
      name,
      channels,
      active: !i, /* Set first device active by default */
      dynamicParams: dynamicParamsDefault
    };
    /* Push the sensor, set the first sensor active */
    generatorObj[actuationId] = senParamObj;
  }
  return generatorObj;
}

/* Set the device active or not  */
export function setDeviceActive(
  deviceId: idType,
  newState: boolean
): setDeviceActiveActionType {
  /* Return a function for redux thunk */
  return {
    type: SET_DEVICE_ACTIVE,
    payload: {
      deviceId,
      newState
    }
  };
}

/* Set sensor on a device active or inactive  */
export function setSensorActive(
  deviceId: idType,
  sensorId: idType,
  newState: boolean
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the state of the device settings - its assumed but
     * unverified if this provides a copy of the state object  */
    const { settings } = getState().devices[deviceId];
    settings.sensors[parseInt(sensorId, 10)].active = newState;
    /* Update the object */
    dispatch(updateSenGenParams(deviceId, settings));
  };
}

/* Set the Generator instrument active or inactive */
export function setGeneratorActive(
  deviceId: idType,
  generatorId: number | string,
  newState: boolean
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the state of the device settings  */
    const deviceSettings = getState().devices.deviceSettings[deviceId];
    deviceSettings.generators[generatorId].active = newState;
    /* Update the object */
    dispatch(updateSenGenParams(deviceId, deviceSettings));
  };
}

/* Update the the state of the channel for a sensor */
export function setSensorChannels(
  deviceId: idType,
  sensorId: idType,
  channels: number[]
): setSensorChannelsActionT {
  return {
    type: SET_SENSOR_CHANNELS,
    payload: {
      deviceId,
      sensorId,
      channels
    }
  };
}

/* Update the the state of the channel for a sensor */
export function setSensorRange(
  deviceId: idType,
  sensorId: idType,
  range: number
): setSensorRangeActionT {
  /* Look up the gain mapping function from the param library */
  const rangeParams: deviceRangeParamT = micaSensorParams[sensorId].dynamicParams.range;
  const gain = rangeParams.gain(range);
  return {
    type: SET_SENSOR_RANGE,
    payload: {
      deviceId,
      sensorId,
      range,
      gain
    }
  };
}


/* Update the dynamic parameters in the store */
export function setSensorParams(
  deviceId: idType,
  sensorId: idType,
  paramName: string,
  paramValue: number
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    if (paramName === 'range') {
      dispatch(setSensorRange(deviceId, sensorId, paramValue));
    } else {
      /* Get the state of the device settings */
      const { settings } = getState().devices[deviceId];
      settings.sensors[parseInt(sensorId, 10)].dynamicParams[paramName].value = paramValue;
      /* Update the store */
      dispatch(updateSenGenParams(deviceId, settings));
    }
  };
}

/* Change the active parameters */
export function updateSenGenParams(
  deviceId: idType,
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

/* Set the local name of the device */
export function updateDeviceName(deviceId: idType, name: string): updateDeviceNameT {
  return {
    type: UPDATE_DEVICE_NAME,
    payload: {
      deviceId,
      name
    }
  };
}

/* [] - END OF FILE */
