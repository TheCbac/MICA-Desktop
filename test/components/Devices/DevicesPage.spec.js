// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: test/components/Devices/DevicesPage.spec.js
*
* Brief: Testing of the scan device component
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Changed name to DevicesPage
*   (from scanForDevicesComponent)
* 2017.06.06 CC - Document created
*
********************************************************* */
import { spy } from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import DevicesPage, { __RewireAPI__ as Rewire } from '../../../app/components/Devices/DevicesPage';
/* Create the scan devices component */
function setup(propsObj) {
  /* Default props */
  let props = {
    method: 'ble',
    enabled: false,
    scanning: false,
    devices: {}
  };
  /* If arguments were passed in use those */
  if (propsObj !== undefined) {
    props = { ...props, ...propsObj };
  }
  const actions = {
    changeScanMethod: spy(),
    startStopScan: spy(),
    connectToDevice: spy(),
    cancelPendingConnection: spy(),
    disconnectFromDevice: spy()
  };
  const component = shallow(<DevicesPage
    {...props}
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
describe('DevicesPage', () => {
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
      const columns = Rewire.__Rewire__('advertisingColumns', [{
        Header: 'Advertising Devices',
        accessors: 'advertisement.localName'
      }, {
        Header: 'IDs',
        accessor: 'ids'
      }]);
      expect(table.at(0).prop('columns')).toEqual(columns);
    });
    it('Should have correct tabStyle', () => {
      const tabStyle = Rewire.__Rewire__('tabStyle', {
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
      it('Should call startStopScan when clicked', () => {
        const { buttons, actions } = setup();
        buttons.at(2).simulate('click');
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
});
/* [] - END OF FILE */
