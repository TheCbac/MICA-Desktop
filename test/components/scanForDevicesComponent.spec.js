// @flow
/* **********************************************************
* File: test/components/ScanForDevicesComponent.spec.js
*
* Brief: Testing of the scan device component
*
* Author: Craig Cheney
* Date: 2017.06.06
*
**********************************************************/
import { spy } from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ScanForDevices from '../../app/components/ScanForDevicesComponent';
/* Create the scan devices component */
function setup() {
  const actions = {
    changeScanMethod: spy()
  };
  const component = shallow(<ScanForDevices
    scanningMethod={'ble'}
    methodEnabled={false}
    {...actions}
  />);
  return {
    component,
    actions,
    buttons: component.find('Button')
  };
}
/* Testing suite */
describe('ScanForDevicesComponent', () => {
  it('BLE button should call changeScanMethod', () => {
    const { buttons, actions } = setup();
    buttons.at(0).simulate('click');
    expect(actions.changeScanMethod.calledWith('ble')).toBe(true);
  });
  it('USB button should call changeScanMethod', () => {
    const { buttons, actions } = setup();
    buttons.at(1).simulate('click');
    expect(actions.changeScanMethod.calledWith('usb')).toBe(true);
  });
  it('Buttons should change color when scanning method changes', () => {
    const { component } = setup();
    let { buttons } = setup();
    expect(buttons.at(0).prop('bsStyle')).toEqual('danger');
    /* Change to active */
    component.setProps({ scanningMethod: 'usb' });
    /* Must refind buttons */
    buttons = component.find('Button');
    expect(buttons.at(0).prop('bsStyle')).toEqual('default');
    expect(buttons.at(1).prop('bsStyle')).toEqual('danger');
  });
  it('Buttons should change color when method enable changes', () => {
    const { component } = setup();
    let { buttons } = setup();
    expect(buttons.at(0).prop('bsStyle')).toEqual('danger');
    /* Change to active */
    component.setProps({ methodEnabled: true });
    /* Must refind buttons */
    buttons = component.find('Button');
    expect(buttons.at(0).prop('bsStyle')).toEqual('success');
    expect(buttons.at(1).prop('bsStyle')).toEqual('default');
  });
});
/* [] - END OF FILE */
