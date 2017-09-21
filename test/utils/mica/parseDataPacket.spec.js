// @flow
/* **********************************************************
* File: test/utils/mica/parseDataPacket.spec.js
*
* Brief: Test the parsing functionality for arriving packets
*
* Authors: Craig Cheney
*
* 2017.09.20 CC - Document created
*
********************************************************* */
import { twosCompToSigned } from '../../../app/utils/mica/parseDataPacket';

/* Test suite */
describe('parseDataPacket.spec.js', () => {
  /* Two's Complement */
  it('twosCompToSigned returns the correct values', () => {
    expect(twosCompToSigned(23, 8)).toEqual(23);
    expect(twosCompToSigned(233, 8)).toEqual(-23);
    expect(twosCompToSigned(128, 8)).toEqual(-128);
    expect(twosCompToSigned(3840, 12)).toEqual(-256);
    expect(twosCompToSigned(467, 12)).toEqual(467);
  });
});
/* [] - END OF FILE */
