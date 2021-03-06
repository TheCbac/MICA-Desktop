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
  subscribe: () => void,
  write: () => void,
  on: () => void
};
/* Noble BLE services */
export type nobleServiceType = {
  uuid: string,
  name: ?string,
  characteristics: ?nobleCharacteristicType[]
};

/* Object emitted when a device has been found */
export type newDeviceObjType = {
  deviceId: idType,
  address: string,
  name: string,
  rssi: number
};

/* Noble Object */
// export type noblePeripheralType = {};
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
/* ID of a device */
export type idType = string;

/* Options for the parameter settings */
export type deviceOptionsType = {
  name: string,
  value: number,
  word: number,
  display: string
};

/* Parameter settings for devices */
export type deviceParamType = {
  display: string,
  default: number,
  options: deviceOptionsType[],
  address: number,
  btnType: 'radio' | 'checkbox'
};

export type deviceRangeParamT = {
  display: string,
  address: number,
  default: number,
  gain: (range: number) => number,
  options: deviceOptionsType[],
  btnType: 'radio' | 'checkbox'
};

export type deviceChannelType = {
  display: string,
  default: channelsT
};

export type deviceParamObj = {
  [instrumentId: number | string]: {
    channels: deviceChannelType,
    dynamicParams: {
      range?: deviceRangeParamT,
      [paramName: string]: deviceParamType
    }
  }
};

/* A bit field */
export type bitField = number;

/* Dynamic Sensor parameters */
export type dynamicParamType = {
  address: number,
  value: number
};

export type channelObjT = {
  active: boolean,
  name: string,
  offset: number
};

export type channelsT = {
  [channelId: string]: channelObjT
};

/* Parameter type for updating a sensor */
export type sensorParamType = {
  name: string,
  active: boolean,
  channels: channelsT,
  scalingConstant: number,
  gain: number,
  units: string,
  sampleRate: number,
  dynamicParams: {
    [paramName: string]: dynamicParamType
  }
};

/* Parameter type for updating a generator */
export type generatorParamType = {
  name: string,
  active: boolean,
  channels: channelsT,
  dynamicParams: {
    [paramName: string]: dynamicParamType
  }
};

/* A list of sensors */
export type sensorListType = {
  [sensorId: number]: sensorParamType
};

export type generatorListType = {
  [generatorId: number]: generatorParamType
};

/* Specific object for device settings */
export type deviceSettingsObjType = {
  sensors: sensorListType,
  generators: generatorListType
};

/* A period count */
export type periodCountType = {
  msb: number,
  lsb: number
};

export type zeroT = {
  [channelId: number]: number
};

/* [] - END OF FILE */
