// @flow
/* **********************************************************
* File: tests/factories/actionFactories.js
*
* Brief: Factory definitions for action creators

* Author: Craig Cheney
*
* 2017.09.23 CC - Document Created
*
********************************************************* */
import faker from 'faker';
import { deviceIdFactory } from './factories';
import type { idType } from '../../app/types/paramTypes';
import type {
  foundDeviceActionType,
  clearAdvertisingActionType,
  connectingToDeviceActionType,
  connectedToDeviceActionType,
  cancelConnectToDeviceActionType,
  disconnectingFromDeviceActionType,
  disconnectedFromDeviceActionType,
  lostConnectionFromDeviceActionType,
  reportMetaDataActionType,
  setSensorChannelsActionT
} from '../../app/types/actionTypes';
import { moduleNameType } from '../../app/types/metaDataTypes';
import { metadataObjFactory } from './metadataFactories';

/* Return an action creator for finding an advertising device */
export function foundDeviceActionFactory(deviceId?: idType): foundDeviceActionType {
  const id = deviceId || deviceIdFactory();
  return {
    type: 'FOUND_ADVERTISING_DEVICE',
    payload: {
      deviceId: id,
      name: faker.name.firstName(),
      address: faker.random.alphaNumeric(),
      rssi: faker.random.number()
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
export function disconnectingFromDeviceActionFactory(id?: idType): disconnectingFromDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'DISCONNECTING_FROM_DEVICE',
    payload: {
      deviceId
    }
  };
}
/* Action creator for successful disconnect  */
export function disconnectedFromDeviceActionFactory(id?: idType): disconnectedFromDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'DISCONNECTED_FROM_DEVICE',
    payload: {
      deviceId
    }
  };
}

/* Connection to a device was lost */
export function lostConnectionFromDeviceActionFactory(id?: idType): lostConnectionFromDeviceActionType {
  const deviceId = id || deviceIdFactory();
  return {
    type: 'LOST_CONNECTION_FROM_DEVICE',
    payload: {
      deviceId
    }
  };
}

/* Connection to a device was lost */
export function reportMetadataFactory(
  id?: idType,
  name?: moduleNameType
): reportMetaDataActionType {
  const deviceId = id || deviceIdFactory();
  const data = metadataObjFactory(name);
  return {
    type: 'REPORT_META_DATA',
    payload: {
      deviceId,
      data
    }
  };
}

export function setChannelsFactory(
  deviceId: idType,
  sensingId : idType,
  channels: number[]
): setSensorChannelsActionT {
  return {
    type: 'SET_SENSOR_CHANNELS',
    payload: {
      deviceId,
      sensingId,
      channels
    }
  };
}


/* [] - END OF FILE */
