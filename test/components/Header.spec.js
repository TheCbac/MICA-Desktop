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
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { Router, createMemoryHistory } from 'react-router';
import TestUtils from 'react-addons-test-utils';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { shallow } from 'enzyme';
import Header from '../../app/components/Header';

function setup() {
  const component = shallow(<Header />);
  return {
    component
  };
}

function createNodeMock(element) {
  if (element.type === 'Header') {
    return {};
  }
  return null;
}
/* Beginning of the test suite */

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
  it('Renders correctly', () => {
    const options = { createNodeMock };
    const head = renderer.create(<Header />, options);
    expect(head).toMatchSnapshot();
  });
});


// There seems to be a problem where jest cannot render the Navbar because there are too many nested
// components inside of it. Will look into that in the future.
