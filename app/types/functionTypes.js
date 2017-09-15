/* @flow */
/* **********************************************************
* File: types/functionTypes.js
*
* Brief: Types for functions
*
* Authors: Craig Cheney
*
* 2017.09.10 CC - Document created
*
********************************************************* */

/* Return type of a redux-thunk */
export type thunkType = (dispatch: () => void, getState: () => *) => void;
/* [] - END OF FILE */
