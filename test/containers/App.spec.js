/* **********************************************************
* File: App.spec.js
*
* Brief: Test for the app component
*
* Author: George Whitfield
* Date: 2017.07.28
*
**********************************************************/

import React from 'react';
import { shallow } from 'enzyme';
import App from '../../app/containers/App';

// Begin test
describe('App', () => {
  const app = shallow(<App />);
  it('Renders one App', () => {
    expect(app).toHaveLength(1);
  });
  it('Contains a header and a footer', () => {
    const header = app.find('Header');
    const footer = app.find('Footer');
    expect(header).toBeDefined();
    expect(footer).toBeDefined();
  });
});
