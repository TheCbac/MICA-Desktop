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

import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../app/components/Header';

function setup() {
  const component = shallow(<Header />);
  return {
    component
  };
}

// Begin test
describe('Header', () => {
  const { component } = setup();
  it('Navbar should have props inverse and collaseOnSelect', () => {
    const nav = component.find('Navbar');
    expect(nav.at(0).prop('inverse')).not.toBeNull();
    expect(nav.at(0).prop('collapseOnSelect')).not.toBeNull();
  });
  describe('IndexLinkContainers Test', () => {
    it('Has correct values for props', () => {
      const index = component.find('IndexLinkContainer');
      expect(index.at(0).prop('activeClassName')).toEqual('active');
      expect(index.at(1).prop('activeClassName')).toEqual('active');
      expect(index.at(0).prop('to')).toEqual('/');
      expect(index.at(1).prop('to')).toEqual('/collectData');
    });
  });
  it('Matches Snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});

// To create a new snapshot, you have to move the old snapshot file to the trash. Using ' npm test -- -u ' 
// does not work.
