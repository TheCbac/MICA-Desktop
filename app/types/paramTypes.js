// @flow
/* **********************************************************
* File: types/paramTypes.js
*
* Brief: Types of miscellaneous parameters

* Author: Craig Cheney
* Date: 2017.07.10
*
**********************************************************/
/* Different scan types available */
export type scanTypes = 'usb' | 'ble';

/* Noble characteritic type */
export type nobleCharacteristicType = {
  uuid: string,
  name: ?string,
  properties: ?string[],
  descriptors: ?string,
  type: ?string
};
/* Noble BLE services */
export type nobleServiceType = {
  uuid: string,
  name: ?string,
  characteristics: ?nobleCharacteristicType[]
};

/* Noble Object */
export type noblePeripheralType = {
  address: string,
  addressType: string,
  advertisement: {
    localName: string,
    manufacturerData: ?string,
    serviceData: [],
    serviceUuids: string[],
    txPowerLevel: ?number
  },
  connectable: boolean,
  id: string,
  rssi: number,
  services: ?nobleServiceType[],
  uuid: string
};


export type nobleIdType = string;

/* [] - END OF FILE */
