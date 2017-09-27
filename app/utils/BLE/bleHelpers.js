// @flow
/* **********************************************************
* File: utils/BLE/bleHelper.js
*
* Brief: Helper functions for Noble Devices
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document created
*
********************************************************* */
import type {
  noblePeripheralType,
  nobleCharacteristicType,
  nobleServiceType
} from '../../types/paramTypes';
import type {
  bleApiResultType
} from '../../types/bleTypes';

/* Get the characteristic from a Device */
export function getCharacteristicFromDevice(
  device: noblePeripheralType,
  serviceUuid: string,
  charUuid: string
): ?nobleCharacteristicType {
  /* Find the service  */
  const service = getServiceFromDevice(serviceUuid, device);
  if (!service) { return undefined; }
  return getCharacteristicFromService(
    charUuid,
    service
  );
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

/* Return a service from a given device by UUID */
export function getServiceFromDevice(
  serviceUuid: string,
  device: noblePeripheralType
): ?nobleServiceType {
  /* Find the appropriate service from the device */
  if (!device) { return undefined; }
  const servicesList = device.services;
  /* Ensure list exists */
  if (!servicesList) { return undefined; }
  for (let i = 0; i < servicesList.length; i += 1) {
    if (servicesList[i].uuid === serviceUuid) {
      return servicesList[i];
    }
  }
  return undefined;
}

// /* Read a characteristic */
// export function readBleCharacteristic(
//   device: noblePeripheralType,
//   serviceUuid: string,
//   charUuid: string,
//   callback: (charId: string, deviceId: string, error: ?string, data: Buffer) => void
// ): bleApiResultType {
//   const apiResult = { success: false, error: '' };
//   /* Get the characteristic */
//   const char = getCharacteristicFromDevice(device, serviceUuid, charUuid);
//   if (!char) { return { ...apiResult, error: 'No characteristic found' }; }
//   /* Read the char */
//   char.read(callback.bind(null, charUuid, device.id));
//   return { success: true };
// }

/* [] - END OF FILE */
