// @flow
/* **********************************************************
* File: types/paramTypes.js
*
* Brief: Types of miscellaneous parameters

* Author: Craig Cheney
* Date: 2017.07.10
*
********************************************************* */
/* Different scan types available */
export type scanTypes = 'usb' | 'ble';

/* Noble characteritic type */
export type nobleCharacteristicType = {
  uuid: string,
  name: ?string,
  properties: ?string[],
  descriptors: ?string,
  type: ?string,
  read: () => void,
  subscribe: () => void
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
  uuid: string,
  connect: () => void,
  disconnect: () => void,
  once: () => void,
  discoverSomeServicesAndCharacteristics: () => void
};


export type nobleIdType = string;

/* Options for the parameter settings */
export type deviceOptionsType = {
  name: string,
  value: number,
  word: number,
  display: string
};

/* Parameter settings for devices */
export type deviceParamType = {
  name: string,
  display: string,
  default: number,
  options: deviceOptionsType[],
  address: ?number,
  btnType: 'radio' | 'checkbox'
};

/* Dynamic Sensor parameters */
export type dynamicParamType = {
  address: number,
  value: number
};

/* Parameter type for updating a sensor or generator */
export type senGenParamType = {
  sensor: string,
  active: boolean,
  params: {
    channel: number,
    dynamicParams: dynamicParamType[]
  }
};

/* Top-level Device settings */
export type deviceSettingsType = {
  deviceName: string,
  settings: senGenParamType[]
};

/* [] - END OF FILE */
