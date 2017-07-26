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
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { shallow, mount } from 'enzyme';
import Header from '../../app/components/Header';

function setup(propsObj){
  const component = mount(<Header 
/>);
return{
  component
};

}
/* Beginning of the test suite */

describe('Header', () => {
  it('Should render everything the same as the snapshot file', () => {
    const header = renderer.create(<Header />).toJSON();
    expect(header).toMatchSnapshot();
  });
});


// There seems to be a problem where jest cannot render the Navbar because there are too many nested
// components inside of it. Will look into that in the future.
