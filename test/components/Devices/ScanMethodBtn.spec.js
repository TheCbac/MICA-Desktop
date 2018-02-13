// @flow
/* **********************************************************
* File: test/components/Devices/ScanMethodBtn.spec.js
*
* Brief: Testing of the scan method selection button
*
* Author: Craig Cheney
*
* 2017.09.26 CC - Document created
*
********************************************************* */
import { spy } from 'sinon';
import * as React from 'react';
import { shallow } from 'enzyme';
import ScanMethodBtn from '../../../app/components/Devices/ScanMethodBtn';

function setup(propsObj) {
  let props = {};
  props.method = 'ble';
  props.enabled = true;
  /* If arguments were passed in use those */
  if (propsObj !== undefined) {
    props = { ...props, ...propsObj };
  }
  const actions = {
    changeScanMethod: spy()
  };
  const component = shallow(
    <ScanMethodBtn
      method={props.method}
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

/* IDs of the buttons */
const bleId = 0;
const usbId = 1;
describe('ScanMethodBtns.spec.js', () => {
  it('Buttons should be named correctly', () => {
    const { buttons } = setup();
    expect(buttons.at(bleId).prop('name')).toEqual('bleMethodBtn');
    expect(buttons.at(usbId).prop('name')).toEqual('usbMethodBtn');
  });
  describe('Method selection', () => {
    it('BLE button should call changeScanMethod', () => {
      const { buttons, actions } = setup();
      buttons.at(bleId).simulate('click');
      expect(actions.changeScanMethod.calledWith('ble')).toBe(true);
    });
    it('USB button should call changeScanMethod', () => {
      const { buttons, actions } = setup();
      buttons.at(usbId).simulate('click');
      expect(actions.changeScanMethod.calledWith('usb')).toBe(true);
    });
    it('Buttons should change color when scanning method changes', () => {
      const ScanSetup = setup({ enabled: false });
      const { component } = ScanSetup;
      let { buttons } = ScanSetup;
      expect(component.props.enabled).toBeFalsy();
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('danger');
      /* Change to active */
      component.setProps({ method: 'usb' });
      /* Must refind buttons */
      buttons = component.find('Button');
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('default');
      expect(buttons.at(usbId).prop('bsStyle')).toEqual('danger');
    });
    it('Buttons should change color when method enable changes', () => {
      const ScanSetup = setup({ enabled: false });
      const { component } = ScanSetup;
      let { buttons } = ScanSetup;
      expect(component.props.enabled).toBeFalsy();
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('danger');
      /* Change to active */
      component.setProps({ enabled: true });
      /* Must refind buttons */
      buttons = component.find('Button');
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('success');
      expect(buttons.at(usbId).prop('bsStyle')).toEqual('default');
    });
  });
});

/* [] - END OF FILE */
