// @flow
/* **********************************************************
* File: test/components/Devices/DevicesTable.spec.js
*
* Brief: Testing of the Devices Table react component
*
* Author: Craig Cheney
*
* 2018.03.05 CC - Updated since React 16. Remove Rewire.
*   The suite passes, but these tests need work, they are
*   very trivial.
* 2017.09.26 CC - Document created
*
********************************************************* */
import { spy } from 'sinon';
import * as React from 'react';
import { shallow } from 'enzyme';
import ScanBtn from '../../../app/components/Devices/DevicesTable';

function setup(propsObj) {
  let props = {};
  props.devices = {};
  /* If arguments were passed in use those */
  if (propsObj !== undefined) {
    props = { ...props, ...propsObj };
  }
  const actions = {
    connectToDevice: spy(),
    cancelPendingConnection: spy(),
    disconnectFromDevice: spy()
  };
  const component = shallow(<ScanBtn
    devices={props.devices}
    enabled={props.enabled}
    {...actions}
  />);
  return {
    component,
    actions,
    // table: component.find('ReactTable')
  };
}

describe('DevicesTable.spec.js', () => {
  describe('ReactTable', () => {
    const { component } = setup();
    let table = component.find('ReactTable').at(0);
    it('Should be named correctly', () => {
      expect(table.prop('name')).toEqual('advertisingTable');
    });
    it('Should have the correct number of columns and rows', () => {
      expect(table.prop('minRows')).toBe(3);
    });
  });
});

/* [] - END OF FILE */

