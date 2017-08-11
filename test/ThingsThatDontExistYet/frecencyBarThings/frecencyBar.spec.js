// @flow
/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */
/* **********************************************************
* File: test/ThingsThatDontExistYet/frecencyBar.spec.js
*
* Brief: Test for frecency bar
*
* Author: George Whitfield
* Date: 2017.08.09
*
**********************************************************/
import sinon from 'sinon';
import { shallow } from 'enzyme';
import React from 'react';
import { FrecencyBar, __RewireAPI__ as Rewire } from '../../app/components/frecencyBar';

const FrecencyBarItem = {
  item: {
    isActive: true,
    component: 'Componet'
  }
};
function setup(propsObj) {
  let props;
  // Number of available slots in the FrecencyBar. I just have it set to 5 but it can be anything
  const numberOfElements = 5;
  // Create an array of of items in FrecencyBar
  function setupComponentArray(numElements) {
    let i;
    let array = [];
    for (i = 0; i < numberOfElements; i++) {
      array.push(FrecencyBarItem);
    }
    return array;
  }
  const componentArray = setupComponentArray(numberOfElements);
  if (propsObj === undefined) {
    props = {
      // Status of each block in the FrecencyBar grid
      componentArray: componentArray,
      numberOfElements: numberOfElements,
    };
  } else {
    props = { ...propsObj };
  }
  const actions = {
    updateDisplay: sinon.spy(),
    getFrecencies: sinon.spy()
  };
  const component = shallow(<FrecencyBar
    componentArray={props.componentArray}
    numberOfElements={props.numberOfElements}
    {...actions}
  />);
  return {
    component,
    actions,
    childComponent: component.find('childComponent'),
  };
}

describe('FrecencyBar', () => {
  it('Renders one empty FrecencyBar', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });
  describe('Updates the bar correctly', () => {

  });
});

