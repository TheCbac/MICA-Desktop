// @flow
/* **********************************************************
* File: types/actionTypes.js
*
* Brief: Action types
*
* Author: Craig Cheney
* Date: 2017.04.28
*
**********************************************************/
type initAction = {
  type: string,
  payload: ?string
};

type routerLocationAction = {
  type: "@@router/LOCATION_CHANGE",
  payload: {
    pathname: string,
    search: string,
    hash: string
  }
};

type changeScanMethodAction = {
  type: 'CHANGE_SCAN_METHOD',
  payload: 'ble' | 'usb'
};


export type Action =
  |initAction
  | routerLocationAction
  | changeScanMethodAction;

/* [] - END OF FILE */
