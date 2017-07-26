// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/components/Header.spec.js
*
* Brief: Testing of the Header element
*
* Author: George Whitfield
* Date: 2017.7.13
*
**********************************************************/
// $FlowFixMe
import renderer from 'react-test-renderer';
import React from 'react';
// import { Navbar } from 'react-bootstrap';
// import { shallow } from 'enzyme';
import Header from '../../app/components/Header';


// console.log(Navbar.props);

/* Beginning of the test suite */
describe('Header', () => {
  it('Should render everything the same as the snapshot file', () => {
    const header = renderer.create(
      <Header />
    ).toJSON();
    expect(header).toMatchSnapshot();
  });
});
