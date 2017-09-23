// @flow
/* **********************************************************
* File: tests/factories/factories.js
*
* Brief: Factory definitions for tests.

* Author: Craig Cheney
*
* 2017.09.22 CC - Document Created
*
********************************************************* */
import faker from 'faker';
import type { idType } from '../../app/types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType,
  cancelConnectToDeviceActionType,
  disconnectingFromDeviceActionType,
  disconnectedFromDeviceActionType,
  lostConnectionFromDeviceActionType
} from '../../app/types/actionTypes';

/* Factory for creating an device id */
export function deviceIdFactory(): idType {
  /* Return a 128 bit uuid with no dashes */
  return faker.random.uuid().replace(/-/g, '');
}

/* Return an action creator for finding an advertising device */
export function foundDeviceActionFactory(deviceId?: idType): foundDeviceActionType {
  const id = deviceId || deviceIdFactory();
  return {
    type: 'FOUND_ADVERTISING_DEVICE',
    payload: {
      deviceId: id
    }
  };
}

/* Clear the advertising list action creator */
export function clearAdvertisingListFactory(): clearAdvertisingActionType {
  return {
    type: 'CLEAR_ADVERTISING_LIST',
    payload: {}
  };
}

/* Return an action creator for attempting to connect to a device */
export function connectingToDeviceActionFactory(id?: idType): connectingToDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'CONNECTING_TO_DEVICE',
    payload: {
      deviceId
    }
  };
}

/* Action creator for successful device connection  */
export function connectedToDeviceActionFactory(id?: idType): connectedToDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'CONNECTED_TO_DEVICE',
    payload: {
      deviceId
    }
  };
}

/* Action creator for Cancelling a connection  */
export function cancelConnectToDeviceActionFactory(id?: idType): cancelConnectToDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'CANCEL_CONNECT_TO_DEVICE',
    payload: {
      deviceId
    }
  };
}

/* Action creator for initiating a disconnection  */
export function disconnectingFromDeviceActionFactory(
  id?: idType
): disconnectingFromDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'DISCONNECTING_FROM_DEVICE',
    payload: {
      deviceId
    }
  };
}
/* Action creator for successful disconnect  */
export function disconnectedFromDeviceActionFactory(
  id?: idType
): disconnectedFromDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'DISCONNECTED_FROM_DEVICE',
    payload: {
      deviceId
    }
  };
}

/* Connection to a device was lost */
export function lostConnectionFromDeviceActionFactory(
  id?: idType
): lostConnectionFromDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'LOST_CONNECTION_FROM_DEVICE',
    payload: {
      deviceId
    }
  };
}


/* [] - END OF FILE */
