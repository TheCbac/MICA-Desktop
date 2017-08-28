// @flow
/* **********************************************************
* File: utils/deviceUtils.js
*
* Brief: Utility functions for interacting with BLE devices
*
* Author: Craig Cheney
* Date: 2017.08.27
*
**********************************************************/
import type {
  noblePeripheralType,
  nobleIdType,
  nobleCharacteristicType,
  nobleServiceType
} from '../types/paramTypes';

/* Find a peripheral from a list of peripherals */
export function getPeripheralFromList(
  deviceList: noblePeripheralType[],
  id: nobleIdType
): {peripheral: ?noblePeripheralType, index: ?number} {
  /* Iterate over the list */
  for (let i = 0; i < deviceList.length; i += 1) {
    /* Check the ID */
    if (deviceList[i].id === id) {
      /* Return the matching device */
      return { peripheral: deviceList[i], index: i };
    }
  }
  /* No device found */
  return { peripheral: undefined, index: undefined };
}


/* Return a service from a given peripehral by UUID */
export function getServiceFromPeripheral(
  serviceUuid: string,
  peripheral: noblePeripheralType
): ?nobleServiceType {
  /* Find the appropriate service from the peripheral */
  const servicesList = peripheral.services;
  /* Ensure list exists */
  if (!servicesList) { return undefined; }
  for (let i = 0; i < servicesList.length; i += 1) {
    if (servicesList[i].uuid === serviceUuid) {
      return servicesList[i];
    }
  }
  return undefined;
}
/* Returns a characteristic when passed a service */
export function getCharacteristicFromService(
  charUuid: string,
  service: nobleServiceType
): ?nobleCharacteristicType {
  /* find the characteristics list */
  const charList = service.characteristics;
  /* Ensure the list exists */
  if (!charList) { return undefined; }
  /* Look for the matching UUID */
  for (let i = 0; i < charList.length; i += 1) {
    if (charList[i].uuid === charUuid) {
      return charList[i];
    }
  }
  return undefined;
}

/* Returns a characteristic from a given peripehral */
export function getCharacteristicFromPeripheralId(
  serviceUuid: string,
  charUuid: string,
  peripheralId: nobleIdType,
  deviceList: noblePeripheralType[]
): ?nobleCharacteristicType {
  /* Find the peripheral */
  const peripheral = getPeripheralFromList(deviceList, peripheralId).peripheral;
  if (!peripheral) { return undefined; }
  /* Find the service */
  const service = getServiceFromPeripheral(serviceUuid, peripheral);
  /* Ensure a service was found */
  if (!service) { return undefined; }
  /* Get the characteristic */
  return getCharacteristicFromService(charUuid, service);
}

/* Return an array from an array like object */
export function shallowObjToArray(obj: {}): ?mixed[] {
  const objArray = [];
  const keys = Object.keys(obj);
  /* Iterate over the keys */
  for (let i = 0; i < keys.length; i += 1) {
    objArray.push(obj[keys[i]]);
  }
  return objArray;
}

/* [] - END OF FILE */
