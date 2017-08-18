// @flow
/* **********************************************************
* File: test/utils/mica/micaUuids.js
*
* Brief: Snapshot test for the Mica constants
*
* Author: George Whitfield
* Modified: 2017.08.18
*
**********************************************************/
import * as Mica from '../../../app/utils/mica/MicaUuids';

// Begin test
describe('MicaUuids', () => {
  // Snapshot tests are great for cases like these where we have a big list of constants
  it('Passes snapshot test', () => {
    expect(Mica.micaServiceUuid).toMatchSnapshot();
    expect(Mica.micaCharUuids).toMatchSnapshot();
  });
});
