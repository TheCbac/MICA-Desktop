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
import * as React from 'react';
import { shallow } from 'enzyme';
import DevicesPage, { __RewireAPI__ as Rewire } from '../../../app/components/Devices/DevicesPage';
/* Create the scan devices component */
function setup(propsObj) {
  /* Default props */
  let props = {};
  props.method = 'ble';
  props.enabled = false;
  props.scanning = false;
  props.devices = {};
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
    method={props.method}
    enabled={props.enabled}
    scanning={props.scanning}
    devices={props.devices}
    {...actions}
  />);
  /* Not sure why the spread operator isn't working for props/flow */
  // const component = shallow(<DevicesPage
  //   {...props}
  //   {...actions}
  // />);
  return {
    component,
    actions,
    ScanMethodBtn: component.find('ScanMethodBtn'),
    ScanBtn: component.find('ScanBtn'),
    DevicesTable: component.find('DevicesTable')
  };
}

/* Testing suite */
describe('DevicesPage', () => {
  it('should have a ScanMethodBtn', () => {
    const { ScanMethodBtn } = setup();
    expect(ScanMethodBtn).toBeTruthy();
  });
  it('should have a ScanBtn', () => {
    const { ScanBtn } = setup();
    expect(ScanBtn).toBeTruthy();
  });
  it('should have a DevicesTable', () => {
    const { DevicesTable } = setup();
    expect(DevicesTable).toBeTruthy();
  });
});
/* [] - END OF FILE */
