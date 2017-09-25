// @flow
/* **********************************************************
* File: types/styleTypes.js
*
* Brief: Typedefs for React component styles
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document Created
*
********************************************************* */

/* Scan method btn style */
export type scanMethodBtnStyleType = 'success' | 'danger' | 'default';

/* Used for determine the color of the scan button */
export type scanBtnStyleType = {
  color: 'primary' | 'danger',
  text: 'Start' | 'Stop'
};

/* [] - END OF FILE */
