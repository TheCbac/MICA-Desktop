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

/* Noble Object */
export type noblePeripheralType = {
  address: string,
  addressType: string,
  advertisement: {
    localName: string,
    manufacturerData: any,
    serviceData: [],
    serviceUuids: string[],
    txPowerLevel: any
  },
  connectable: boolean,
  id: string,
  rssi: int,
  services: any,
  uuid: string
};

/* [] - END OF FILE */
