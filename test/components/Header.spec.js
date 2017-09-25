// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/components/Header.spec.js
*
* Brief: Testing of the Header element
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.09.25 CC - Update test for v0.2
* 2017.07.13 GW - Document created
*
********************************************************* */
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
  it('Navbar should have props inverse and collapseOnSelect', () => {
    const nav = component.find('Navbar');
    expect(nav.at(0).prop('inverse')).not.toBeNull();
    expect(nav.at(0).prop('collapseOnSelect')).not.toBeNull();
  });
  describe('Index and Link containers Test', () => {
    it('Has correct values for props', () => {
      const index = component.find('IndexLinkContainer');
      const link = component.find('LinkContainer');
      expect(index.at(0).prop('activeClassName')).toEqual('active');
      expect(link.at(0).prop('activeClassName')).toEqual('active');
      expect(link.at(1).prop('activeClassName')).toEqual('active');
      expect(link.at(2).prop('activeClassName')).toEqual('active');
      expect(index.at(0).prop('to')).toEqual('/');
      expect(link.at(0).prop('to')).toEqual('/settings');
      expect(link.at(1).prop('to')).toEqual('/collectData');
      expect(link.at(2).prop('to')).toEqual('/analyze');
    });
  });
  it('Matches Snapshot', () => {
    // Need to find a way to test the children of Navbar.Brand and NavItems
    expect(component).toMatchSnapshot();
  });
});
