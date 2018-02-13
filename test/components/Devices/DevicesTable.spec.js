// @flow
/* eslint no-underscore-dangle: 0 */ /* Using Rewire in testing */
/* **********************************************************
* File: test/components/Devices/DevicesTable.spec.js
*
* Brief: Testing of the Devices Table react component
*
* Author: Craig Cheney
*
* 2017.09.26 CC - Document created
*
********************************************************* */
import { spy } from 'sinon';
import * as React from 'react';
import { shallow } from 'enzyme';
import ScanBtn, { __Rewire__ as Rewire } from '../../../app/components/Devices/DevicesTable';

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
  const component = shallow(
    <ScanBtn
      devices={props.devices}
      enabled={props.enabled}
      {...actions}
    />
  );
  return {
    component,
    actions,
    table: component.find('ReactTable')
  };
}

describe('DevicesTable.spec.js', () => {
  describe('ReactTable', () => {
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
});

/* [] - END OF FILE */

