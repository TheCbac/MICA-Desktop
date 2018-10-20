// @flow
/* **********************************************************
* File: actions/ScanForDevicesActions.js
*
* Brief: Actions for the scanning devices
*
* Author: Craig Cheney
* Date: 2017.04.28
*
********************************************************* */
import type { stateType } from '../types/stateTypes';
import type { scanTypes, idType } from '../types/paramTypes';
import type {
  enableScanActionType,
  changeScanActionType,
  scanStateActionType,
} from '../types/actionTypes';
import { Noble, Serialport } from '../utils/nativeModules';
import log from '../utils/loggingUtils';
import store from '../index';
import {
  clearAdvertisingList,
  connectingToDevice,
  connectedToDevice,
  cancelConnectToDevice,
  disconnectingFromDevice,
  disconnectedFromDevice,
  lostConnectionFromDevice
} from './devicesActions';
import { bleStartScan, bleStopScan, bleConnect,
  bleCancelPending, bleDisconnect, bleInitializeDevice } from '../utils/BLE/bleFunctions';
import type { thunkType } from '../types/functionTypes';
import { isMicaSerialDevice } from '../utils/Developer/SerialCommands';
import { setPort, removePort, getPort } from '../utils/micaUsb/micaUsb';
import { processRxBuffer, constructPacket } from '../utils/micaUsb/micaParser';

/* Set the file debug level */
// log.debugLevel = 5;
log.debug('ScanForDevicesActions.js logging level set to:', log.debugLevel);

/* Action names */
export const CHANGE_SCAN_METHOD = 'CHANGE_SCAN_METHOD';
export const ENABLE_SCAN_METHOD = 'ENABLE_SCAN_METHOD';
export const CHANGE_SCAN_STATE = 'CHANGE_SCAN_STATE';


export function changeScanMethodAsync(method: scanTypes): thunkType {
  /* Return a function for redux thunk */
  return async (dispatch: (mixed) => void, getState: () => stateType): any => {
    /* Do nothing if the new state is the active state */
    if (method === getState().scanForDevices.method) { return; }
    /* Check the state on switch */
    let enable = false;
    if (method === 'ble') {
      enable = Noble.state === 'poweredOn';
      /* Close any open ports */
      closeMicaPort();
      /* See if there is a valid MICA USB port */
    } else if (method === 'usb') {
      getMicaUsb(dispatch, getState);
    }
    dispatch(changeScanMethod(method, enable));
    /* Clear the advertising list */
    dispatch(clearAdvertisingList());
  };
}

/* Action method for changing active method */
export function changeScanMethod(method: scanTypes, enable: boolean): changeScanActionType {
  return {
    type: CHANGE_SCAN_METHOD,
    payload: {
      method,
      enable,
    }
  };
}


/* List all of the device */
async function getMicaUsb(dispatch: (mixed)=> void, getState: () => stateType): Promise<any> {
  const serialList = await Serialport.list();
  let i;
  for (i = 0; i < serialList.length; i++) {
    const portInstance = serialList[i];
    const { comName, productId, vendorId } = portInstance;
    if (isMicaSerialDevice(productId, vendorId)) {
      const baudRate = 115200;
      /* Open the USB port if it isn't already open */
      if (!portInstance.isOpen) {
        const newPort = new Serialport(comName, { baudRate }, (err) => {
          if (!err) {
            setPort(newPort);
          }
        });
        newPort.on('close', () => {
          const { scanForDevices: { method } } = getState();
          if (method === 'usb') {
            dispatch(changeScanMethod('usb', false));
            /* Callbacks determine when the scan state itself is changed */
          }
        });
        /* Process mica data as it's received */
        newPort.on('data', (data) => {
          // console.log(data);
          processRxBuffer(data);
        });
        console.log(`opened port ${comName}`);

        /* Testing - send the request for ID - this needs to live somewhere else */
        const requestIdPacket = {
          module: 'control',
          cmd: 0x00,
          payload: [],
          flags: 0x00
        };
        const { err, success, packet } = constructPacket(requestIdPacket);
        if(success){
          newPort.write(packet);
        } else {
          console.log(`Err constructing: ${err}`);
        }

      }
      break;
    }
  }
}

/* Close the cached usb device */
function closeMicaPort() {
  const port = getPort();
  if (port && port.isOpen) {
    port.close((err) => {
      if (err) {
        console.log('Error closing port');
      } else {
        removePort();
        console.log(`Closed port ${port.path}`);
      }
    });
  }
}

/* Enable the currently selected scanning method */
export function enableScanMethod(method: scanTypes, enable: boolean): enableScanActionType {
  return {
    type: ENABLE_SCAN_METHOD,
    payload: {
      method,
      enable
    }
  };
}

/* Indicate that the scanState should change */
export function changeScanState(method: scanTypes,
  state: boolean, tOutId?: number): scanStateActionType {
  return {
    type: CHANGE_SCAN_STATE,
    payload: {
      method,
      state,
      timeoutId: tOutId
    }
  };
}
/* Starts and stops the scanning events - dispatches events based on results */
export function startStopScan(): thunkType {
  return (dispatch: (mixed) => void, getState: () => stateType): void => {
    /* Get the current state */
    const { method, scanning, enabled } = getState().scanForDevices;
    /* Only scan if the current method is enabled */
    if (enabled) {
      /* If not scanning start a scan */
      if (!scanning) {
        const startResult = bleStartScan(method);
        /* Clear the advertising list */
        if (startResult.success) {
          dispatch(clearAdvertisingList());
        } else {
          console.log(startResult.error);
        }
        /* Callbacks determine when the scan state itself is changed */
      } else {
        /* Stop the scan */
        bleStopScan(method);
        /* Callbacks determine when the scan state itself is changed */
      }
    }
  };
}

/* Connect to a device */
export function connectToDevice(deviceId: idType): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: (mixed) => void, getState: () => stateType): void => {
    /* get the current state */
    const { method } = getState().scanForDevices;
    /* Move to advertising list */
    dispatch(connectingToDevice(deviceId));
    /* Attempt to connect */
    bleConnect(
      method,
      deviceId,
      connectCallBack.bind(null, deviceId, method),
      disconnectCallback.bind(null, deviceId, method)
    );
  };
}
/* Callback when a device has been connected (or timeout) */
function connectCallBack(id: idType, method: scanTypes, error: ?string): void {
  if (error) {
    log.error('Failed to connect to device:', id);
    return;
  }
  log.debug('ConnectCallBack Called');
  /* Dispatch an action to indicate connected device */
  store.dispatch(connectedToDevice(id));
  /* Discover parameters about the device */
  bleInitializeDevice(method, id);
}

/* Cancel an attempt to connect */
export function cancelPendingConnection(deviceId: idType): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: (mixed) => void, getState: () => stateType): void => {
    /* get the state */
    const state = getState();
    const { method } = state.scanForDevices;
    const { state: deviceState } = state.devices[deviceId];
    /* Ensure the connection is pending */
    if (deviceState !== 'connecting') { return; }
    /* Update the state */
    dispatch(cancelConnectToDevice(deviceId));
    /* Take an steps necessary to disconnect */
    bleCancelPending(method, deviceId);
  };
}

/* Disconnect from a device */
export function disconnectFromDevice(deviceId: idType): thunkType {
  /* Return a function for redux thunk */
  return (dispatch: (mixed) => void, getState: () => stateType): void => {
    /* get the current state */
    const { method } = getState().scanForDevices;
    /* Update the store */
    dispatch(disconnectingFromDevice(deviceId));
    /* Perform the BLE disconnect */
    bleDisconnect(method, deviceId);
  };
}

/* Callback for when a device becomes disconnected */
function disconnectCallback(id: idType): void {
  /* Get the devices */
  const { devices } = store.getState();
  const device = devices[id];
  /* Ensure something was found */
  if (!device) {
    log.warn('disconnectCallback: Unknown device id', id);
    return;
  }
  /* Issue the corresponding action */
  if (device.state === 'disconnecting') {
    /* Planned disconnection */
    store.dispatch(disconnectedFromDevice(id));
  } else {
    /* Unplanned disconnection */
    store.dispatch(lostConnectionFromDevice(id));
  }
}

/* [] - END OF FILE */
