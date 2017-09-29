// @flow
/* **********************************************************
* File: reducers/createReducer.js
*
* Brief: Returns a reducer based off a handler. This method
*   allows for flow to check accurately check types
*
* Author: Craig Cheney
* 2017.09.22 CC - Updated to ensure an object is always returned
* 2017.06.08 CC - Document created
*
********************************************************* */
export default function createReducer(initialState: {}, handlers: {}) {
  return function reducer(state: ?{} = initialState, action: {type: string}): {} {
    return Object.prototype.hasOwnProperty.call(handlers, action.type) ?
      handlers[action.type](state, action) : (state || {});
  };
}
/* [] - END OF FILE */
