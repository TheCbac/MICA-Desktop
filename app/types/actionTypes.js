// @flow
/* **********************************************************
* File: types/actionTypes.js
*
* Brief: Types for the various actions
* https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
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


/* Defines the type for the action - seems like this doesn't do anything */
export type actionType = {
  type?: string,
  payload?: ?string | routeObject
};


/* Different scan types available */
export type scanTypes = 'usb' | 'ble';
/* [] - END OF FILE */
