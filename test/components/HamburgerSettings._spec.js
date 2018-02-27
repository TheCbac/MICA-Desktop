
// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/components/HamburgerSettings.spec.js
*
* Brief: Test for Hamburger Settings
*
* Author: George Whitfield
* Date: 2017.7.21
*
********************************************************* */
import * as React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import HamburgerSettings from '../../app/components/HamburgerSettings';

function setup() {
  const actions = {
    // Button has an activateDevTab method.
    activateDevTab: sinon.spy(),
  };
  const component = shallow(<HamburgerSettings
    {...actions}
  />);
  return {
    component,
    actions,
    // Button is react-bootstrap
    button: component.find('Button'),
  };
}

// Not sure what the Hamburger settings are supposed to do yet. Will update later
describe('HamburgerSettings', () => {
  it('Renders one HamburgerSettings', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });
  it('Contains a \'Activate Develop Tab\' button', () => {
    const { actions, button } = setup();
    // replace the number inside of at() with index of the devTools button in render method.
    button.at(0).simulate('click');
    expect(actions.activateDevTab.called).toBe(true);
  });
});
