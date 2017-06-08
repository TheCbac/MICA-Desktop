// @flow
/* **********************************************************
* File: reducers/createReducer.js
*
* Brief: Returns a reducer based off a handler. This method
*   allows for flow to check accurately check types
*
* Author: Craig Cheney
* Date: 2017.06.08
*
**********************************************************/
export default function createReducer(initialState: ?{}, handlers: {}) {
  return function reducer(state: ?{} = initialState, action: {type: string}) {
    return Object.prototype.hasOwnProperty.call(handlers, action.type) ?
      handlers[action.type](state, action) : state;
  };
}
/* [] - END OF FILE */
