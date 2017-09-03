import sinon from 'sinon';
import { shallow } from 'enzyme';
import React from 'react';
import HamburgerSettingsButton from '../../app/components/HamburgerSettingsButton';

function setup() {
  const actions = {
    // Button has an openSettings function.
    openSettings: sinon.spy(),
  };
  const component = shallow(<HamburgerSettingsButton
    {...actions}
  />);
  return {
    component,
    actions,
    Button: component.find('Button'),
  };
}

describe('Hamburger Settings', () => {
  it('Renders one hamburger settings button', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });
  it('Button opens the settings', () => {
    // the settings open when user clicks on it.
    const { button, actions } = setup();
    button.at(0).simulate('click');
    expect(actions.openSettings.called).toBe(true);
  });
});
