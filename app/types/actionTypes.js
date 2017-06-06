// @flow
/* **********************************************************
* File: types/actionTypes.js
*
* Brief: Types for the various actions
*
* Author: Craig Cheney
* Date: 2017.04.28
*
**********************************************************/
type routeObject = {
  pathname: string,
  search: string,
  hash: string,
  state: ?string,
  key: ?string
};
/* Defines the type for the action */
export type actionType = {
  type: string,
  payload: ?string | routeObject
};

export type scanTypes = 'usb' | 'ble';
/* [] - END OF FILE */
