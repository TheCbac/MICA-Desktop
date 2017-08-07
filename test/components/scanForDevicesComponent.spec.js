// @flow
/* eslint no-underscore-dangle: 0 */
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
import ScanForDevices from '../../app/components/ScanForDevicesComponent';
import __RewireAPI__ from '../../app/components/ScanForDevicesComponent';
/* Create the scan devices component */
function setup(propsObj) {
  let props;
  if (propsObj === undefined) {
    props = {
      method: 'ble',
      enabled: false,
      scanning: false,
      advertisingDevices: []
    };
  } else {
    props = { ...propsObj };
  }
  const actions = {
    changeScanMethod: spy(),
    startStopScan: spy()
  };
  const component = shallow(<ScanForDevices
    method={props.method}
    enabled={props.enabled}
    scanning={props.scanning}
    {...actions}
  />);
  return {
    component,
    actions,
    buttons: component.find('Button'),
    table: component.find('ReactTable')
  };
}
/* IDs of the buttons */
const bleId = 0;
const usbId = 1;
const scanId = 2;
/* Testing suite */
describe('ScanForDevicesComponent', () => {
  it('Buttons should be named correctly', () => {
    const { buttons } = setup();
    expect(buttons.at(bleId).prop('name')).toEqual('bleMethodBtn');
    expect(buttons.at(usbId).prop('name')).toEqual('usbMethodBtn');
    expect(buttons.at(scanId).prop('name')).toEqual('scanBtn');
  });
  it('ReactTable', () => {
    const { table } = setup();
    it('Should be named correctly', () => {
      expect(table.at(0).prop('name')).toEqual('advertisingTable');
    });
    it('Should have the correct number of columns and rows', () => {
      expect(table.at(0).prop('rows')).toBe(3);
      /* Inject fake variable */
      const columns = __RewireAPI__.__Rewire__('advertisingColumns', [{
        Header: 'Advertising Devices',
        accessors: 'advertisement.localName'
      }, {
        Header: 'IDs',
        accessor: 'ids'
      }]);
      expect(table.at(0).prop('columns')).toEqual(columns);
    }); 
    it('Should have correct tabStyle', () => {
      const tabStyle = __RewireAPI__.__Rewire__('tabStyle', {
        margin: '200px',
        backgroundColor: 'white',
        borderRadius: '15px',
        border: '0px',
        cursor: 'pointer',
        textAlign: 'center'
      });
      expect(table.at(0).prop('tabStyle')).toBe(tabStyle);
    });
  });
  /* BLE or USB */
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
      const { component } = setup();
      let { buttons } = setup();
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('danger');
      /* Change to active */
      component.setProps({ method: 'usb' });
      /* Must refind buttons */
      buttons = component.find('Button');
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('default');
      expect(buttons.at(usbId).prop('bsStyle')).toEqual('danger');
    });
    it('Buttons should change color when method enable changes', () => {
      const { component } = setup();
      let { buttons } = setup();
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('danger');
      /* Change to active */
      component.setProps({ enabled: true });
      /* Must refind buttons */
      buttons = component.find('Button');
      expect(buttons.at(bleId).prop('bsStyle')).toEqual('success');
      expect(buttons.at(usbId).prop('bsStyle')).toEqual('default');
    });
    /* Start scan button */
    describe('Start scan button', () => {
      it('Scanning not available when method is disabled', () => {
        const { component } = setup();
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
    });
  });
});
/* [] - END OF FILE */
