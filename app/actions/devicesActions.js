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
import micaGeneratorParams from '../utils/mica/micaGeneratorParams';
import type { idType, deviceSettingsObjType,
  sensorParamType, generatorParamType, newDeviceObjType,
  sensorListType, actuationObjs, generatorListType
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
  updateSenGenParamActionType
} from '../types/actionTypes';
import type { stateType } from '../types/stateTypes';
import type {
  metaDataObjType,
  moduleNameType,
  sensingMetaObj,
  actuationMetaObj,
  sensingObjs
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
    const { type: name, scalingConstant, gain, offset, units } = sensingMeta[sensorId];
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
      offset,
      units,
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
    const { type: name } = actuationMeta[actuationId];
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


// /* Get the sensing devices settings from the metadata */
// function constructGeneratorSettings(actuationMeta: actuationMetaObj[]): {
//   [sensorId: number | string]: generatorParamType
// } {
//   const sensorObj = {};
//   for (let i = 0; i < actuationMeta.length; i++) {
//     const actuatorMeta = actuationMeta[i];
//     /* Get the sensor ID */
//     const { id, type } = actuatorMeta;
//     /* Get the sensor params op */
//     const actuatorParams = micaGeneratorParams[id];
//     /* Set the device channels */
//     const channels = actuatorParams.channels.default;
//     /* Get the dynamic params keys */
//     const dynamicParams = actuatorParams.dynamicParams;
//     const dynamicParamKeys = Object.keys(dynamicParams);
//     const dynamicParamsDefault = {};
//     /* Iterate through the parameters  */
//     for (let j = 0; j < dynamicParamKeys.length; j++) {
//       /* Get the parameter */
//       const key = dynamicParamKeys[j];
//       const { address } = dynamicParams[key];
//       const defaultVal = dynamicParams[key].default;
//       dynamicParamsDefault[key] = { address, value: defaultVal };
//     }
//     /* Construct the Sensor parameter object */
//     const senParamObj: generatorParamType = {
//       name: type,
//       channels,
//       active: !i, /* Set first device active by default */
//       dynamicParams: dynamicParamsDefault
//     };
//     /* Push the sensor, set the first sensor active */
//     sensorObj[id] = senParamObj;
//   }
//   return sensorObj;
// }


// /* Get the sensing devices settings from the metadata */
// function constructSensingSettings(sensingMeta: sensingMetaObj[]): {
//   [sensorId: number | string]: sensorParamType
// } {
//   const sensorObj = {};
//   for (let i = 0; i < sensingMeta.length; i++) {
//     const sensorMeta = sensingMeta[i];
//     /* Get the sensor ID */
//     const { id, scalingConstant, gain, offset, units } = sensorMeta;
//     const sensorName = sensorMeta.type;
//     /* Get the sensor params op */
//     const sensorParams = micaSensorParams[id];
//     /* Set the device channels */
//     const channels = sensorParams.channels.default;
//     /* Get the dynamic params keys */
//     const dynamicParams = sensorParams.dynamicParams;
//     const dynamicParamKeys = Object.keys(dynamicParams);
//     const dynamicParamsDefault = {};
//     /* Iterate through the parameters  */
//     for (let j = 0; j < dynamicParamKeys.length; j++) {
//       /* Get the parameter */
//       const key = dynamicParamKeys[j];
//       const { address } = dynamicParams[key];
//       const defaultVal = dynamicParams[key].default;
//       dynamicParamsDefault[key] = { address, value: defaultVal };
//     }
//     /* Construct the Sensor parameter object */
//     const senParamObj: sensorParamType = {
//       name: sensorName,
//       active: !i, /* Set first device active by default */
//       channels,
//       scalingConstant,
//       gain,
//       offset,
//       units,
//       dynamicParams: dynamicParamsDefault
//     };
//     /* Push the sensor, set the first sensor active */
//     sensorObj[id] = senParamObj;
//   }
//   return sensorObj;
// }


// export function reportMetaData(
//   deviceId: idType,
//   metaData: ?metaDataObjType,
//   moduleName: ?moduleNameType
// ): reportMetaDataActionType {
//   return {
//     type: REPORT_META_DATA,
//     payload: {
//       deviceId,
//       data: metaData,
//       moduleName
//     }
//   };
// }

// /* Wrapper for reporting metadata - check to see if the metadata is complete */
// export function metaDataReadComplete(
//   deviceId: idType,
//   metaData: ?metaDataObjType,
//   moduleName: ?moduleNameType
// ): thunkType {
//   /* Return a function for redux thunk */
//   return (dispatch: () => void, getState: () => stateType): void => {
//     /* Report the metadata */
//     dispatch(reportMetaData(deviceId, metaData, moduleName));
//     /* Get the state  */
//     const state = getState();
//     /* Get the metadata for a device */
//     const deviceMetadata = state.devices.metadata[deviceId];
//     /* get the number of metadata reads */
//     const numMetadata = Object.keys(deviceMetadata).length;
//     /* If all of the modules have been read, update the selected device */
//     if (numMetadata === 6) {
//       dispatch(getSelectedDevices());
//       /* Set the default parameters */
//       dispatch(setDefaultSenGenParams(deviceId));
//     }
//   };
// }

// /* Read the default sensor parameters from the device */
// export function setDefaultSenGenParams(deviceId: idType): thunkType {
//   /* Return a function for redux thunk */
//   return (dispatch: () => void, getState: () => stateType): void => {
//     /* Get the current state */
//     const devices = getState().devices;
//     /* Get the metadata */
//     const deviceMetadata = devices.metadata[deviceId];
//     /* Ensure data is there */
//     if (!deviceMetadata) { return; }
//     /* get the sensing and actuation metadata */
//     const sensingMeta = deviceMetadata.sensing;
//     const actuationMeta = deviceMetadata.actuation;
//     if (!sensingMeta || !actuationMeta) { return; }
//     /* -- Begin constructing the return objects -- */
//     const sensorObj = constructSensingSettings(sensingMeta);
//     const generatorObj = constructGeneratorSettings(actuationMeta);
//     /* Return the device settings */
//     const deviceSettingsObj = {
//       active: true,
//       sensors: sensorObj,
//       generators: generatorObj
//     };
//     dispatch(updateSenGenParams(deviceId, deviceSettingsObj));
//   };
// }


/* Set sensor on a device active or inactive  */
export function setSensorActive(
  deviceId: idType,
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

/* Update the dynamic parameters in the store */
export function setSensorParams(
  deviceId: idType,
  sensorId: number | string,
  paramName: string,
  paramValue: number
): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: () => void, getState: () => stateType): void => {
    /* Get the state of the device settings */
    const deviceSettings = getState().devices.deviceSettings[deviceId];
    deviceSettings.sensors[sensorId].dynamicParams[paramName].value = paramValue;
    /* Update the store */
    dispatch(updateSenGenParams(deviceId, deviceSettings));
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

/* [] - END OF FILE */
