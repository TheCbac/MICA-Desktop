// @flow
/* **********************************************************
* File: test/components/Devices/ScanBtn.spec.js
*
* Brief: Testing of the scan button
*
* Author: Craig Cheney
*
* 2017.09.26 CC - Document created
*
********************************************************* */
import { spy } from 'sinon';
// import * as React from 'react';
import React from 'react';
import { shallow } from 'enzyme';
import ScanBtn from '../../../app/components/Devices/ScanBtn';

function setup(propsObj) {
  let props = {};
  props.scanning = false;
  props.enabled = true;
  /* If arguments were passed in use those */
  if (propsObj !== undefined) {
    props = { ...props, ...propsObj };
  }
  const actions = {
    startStopScan: spy()
  };
  const component = shallow(
    <ScanBtn
      scanning={props.scanning}
      enabled={props.enabled}
      {...actions}
    />
  );
  return {
    component,
    actions,
    buttons: component.find('Button')
  };
}

const scanId = 0;
describe('ScanBtn.spec.js', () => {
  /* Start scan button */
  describe('Start scan button', () => {
    it('Scanning not available when method is disabled', () => {
      const { component } = setup({ enabled: false });
      let scanButton = component.find('Button').at(scanId);
      expect(component.instance().props.enabled).toBe(false);
      expect(scanButton.prop('disabled')).toBe(true);
      /* Change the prop */
      component.setProps({ enabled: true });
      /* refind buttons */
      scanButton = component.find('Button').at(scanId);
      expect(component.instance().props.enabled).toBe(true);
      expect(scanButton.prop('disabled')).toBe(false);
    });
    it('Scan button color matches state', () => {
      const { component } = setup({ method: 'ble', enabled: true, scanning: false });
      let scanButton = component.find({ name: 'scanBtn' });
      expect(scanButton.prop('bsStyle')).toEqual('primary');
      /* Start the scan */
      component.setProps({ scanning: true });
      scanButton = component.find({ name: 'scanBtn' });
      expect(scanButton.prop('bsStyle')).toEqual('danger');
    });
    it('Should call startStopScan when clicked', () => {
      const { buttons, actions, component } = setup({ enabled: true });
      expect(component.instance().props.enabled).toBe(true);
      buttons.at(scanId).simulate('click');
      expect(actions.startStopScan.called).toBe(true);
    });
    it('Should have appropriate text displayed when scanning', () => {
      const { component } = setup({ method: 'ble', enabled: true, scanning: true });
      const scanButton = component.find({ name: 'scanBtn' });
      // First word in text.
      expect(scanButton.childAt(0).text()).toBe('Stop');
      // Second word
      expect(scanButton.childAt(1).text()).toBe(' Scan ');
      expect(scanButton.childAt(2).text()).toBe('<FontAwesome />');
    });
    it('Should have appropriate text displayed when not scanning', () => {
      const { component } = setup({ scanning: false });
      const scanButton = component.find({ name: 'scanBtn' });
      expect(scanButton.childAt(0).text()).toBe('Start');
      expect(scanButton.childAt(1).text()).toBe(' Scan ');
    });
  });
});

/* [] - END OF FILE */
