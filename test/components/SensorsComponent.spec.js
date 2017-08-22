// @flow
/* **********************************************************
* File: test/components/SensorsComponent.spec.js
*
* Brief: Test for the sensors component on the SEN+GEN page
*
* Author: George Whitfield
* Date: 2017.08.18
*
**********************************************************/
import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SensorsComponent from '../../app/components/SensorsComponent';

function setup(propsObj) {
  let props;
  if (propsObj === undefined) {
    props = {
      devicesArray: [
        { device: 'DRIVE_BOT46738',
          sensors: ['Gyroscope', 'Magnetometer'] },
        { device: 'DRIVE_BOT2343',
          sensors: ['Accellerometer', 'Gyroscope'] }],
    };
  } else {
    props = { ...propsObj };
  }
  const actions = {
    changeCurrentSensor: sinon.spy(),
  };
  const component = shallow(<SensorsComponent
    devicesArray={props.devicesArray}
    {...actions}
  />);
  return {
    component,
    actions,
    buttonGroup: component.find('ButtonGroup'),
  };
}

describe('SensorsComponent', () => {
  const { component, actions } = setup();
  it('Renders one SensorsComponent', () => {
    expect(component).toMatchSnapshot();
  });
  describe('Buttons that changes the current sensor works correctly', () => {
    // Buttons are from react-bootstrap and inside of a ButtonGroup
    const buttonGroup = setup().buttonGroup.at(0);
    it('Buttons should be stacked vertically', () => {
      expect(buttonGroup.prop('vertical')).toBe(true);
    });
    it('Up Button should call changeCurrentSensor correctly', () => {
      // The first ButtonGroup in SensorsComponent contains the up/down buttons that change the current sensor.
      const upButton = buttonGroup.find('Button').at(0);
      upButton.simulate('click');
      // When the up button is clicked, changeCurrentSensor is called with the 'up' argument
      expect(actions.changeCurrentSensor.calledWith('up')).toBe(true);
    });
    it('Down Button should call changeCurrentSensor correctly', () => {
      const downButton = buttonGroup.find('Button').at(1);
      downButton.simulate('click');
      // When clicked, the down button calls changeCurrentSensor with 'down' argument.
      expect(actions.changeCurrentSensor.calledWith('down')).toBe(true);
    });
  });
});
