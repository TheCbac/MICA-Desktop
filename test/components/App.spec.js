/* **********************************************************
* File: test/components/App.spec.js
*
* Brief: Test for the app component
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.10.12 CC - Refactored for App container
* 2017.07.28 GW - Document Created
*
********************************************************* */

import React from 'react';
import { shallow } from 'enzyme';
import App from '../../app/components/App';

const app = shallow(<App />);

/* Test suite */
describe('App', () => {
  it('Renders one App', () => {
    expect(app).toHaveLength(1);
  });
  it('Contains a header', () => {
    const header = app.find('Header');
    expect(header).toBeDefined();
  });
});

/* [] - END OF FILE */
