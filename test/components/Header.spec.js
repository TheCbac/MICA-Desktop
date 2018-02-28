// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/components/Header.spec.js
*
* Brief: Testing of the Header element
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.10.22 CC - Rewritten for developer refactor
* 2017.09.25 CC - Update test for v0.2
* 2017.07.13 GW - Document created
*
********************************************************* */
import * as React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import Header from '../../app/components/Header';

function setup(developer = false) {
  const actions = {
    showUserSettings: spy()
  };
  const component = shallow(<Header
    developer={developer}
    showUserSettings={actions.showUserSettings}
  />);
  return {
    component,
    actions
  };
}

/* test suite */
describe('Header', () => {
  it('The header should have a navbar', () => {
    const { component } = setup();
    const nav = component.find('Navbar');
    expect(nav).toBeDefined();
  });
  describe('Link containers', () => {
    it('has a devices page', () => {
      const { component } = setup();
      const linkContainer = component.find('#devicesPageLink');
      expect(linkContainer.exists()).toBeTruthy();
      expect(linkContainer.prop('to')).toBe('/');
      const navItem = linkContainer.children('NavItem');
      expect(navItem.length).toBe(1);
      expect(navItem.children().text()).toBe('DEVICES');
    });
    it('has a settings page', () => {
      const { component } = setup();
      const linkContainer = component.find('#settingsPageLink');
      expect(linkContainer.exists()).toBeTruthy();
      expect(linkContainer.prop('to')).toBe('/settings');
      const navItem = linkContainer.children('NavItem');
      expect(navItem.length).toBe(1);
      expect(navItem.children().text()).toBe('SETTINGS');
    });
    it('has a collect page', () => {
      const { component } = setup();
      const linkContainer = component.find('#collectDataPageLink');
      expect(linkContainer.exists()).toBeTruthy();
      expect(linkContainer.prop('to')).toBe('/collect');
      const navItem = linkContainer.children('NavItem');
      expect(navItem.length).toBe(1);
      expect(navItem.children().text()).toBe('COLLECT');
    });
    it('has a developer page sometimes', () => {
      const { component } = setup();
      const noLink = component.find('#developerPageLink');
      expect(noLink.exists()).toBeFalsy();
      /* Set the prop on the component */
      component.setProps({ developer: true });
      const linkContainer = component.find('#developerPageLink');
      expect(linkContainer.exists()).toBeTruthy();
      expect(linkContainer.prop('to')).toBe('/developer');
      const navItem = linkContainer.children('NavItem');
      expect(navItem.length).toBe(1);
      expect(navItem.children().text()).toBe('DEVELOPER');
    });
  });
  describe('Click hamburger', () => {
    it('should call show user settings', () => {
      const { component, actions } = setup();
      const hamburger = component.find('#userSettingsBars');
      expect(hamburger.exists()).toBeTruthy();
      /* Click the hamburger */
      hamburger.simulate('click');
      expect(actions.showUserSettings.called).toBeTruthy();
      expect(actions.showUserSettings.calledWith(true));
    });
  });
});
