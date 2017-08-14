// @flow
/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */
/* **********************************************************
* File: test/ThingsThatDontExistYet/quickAccessBar.spec.js
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
import { QuickAccessBar, __RewireAPI__ as Rewire } from '../../app/components/QuickAccessBar';

// Array of objects containing information about what's being rednered in the quick access bar.

 /* Each item in the array has the following elemets: {
   score: boolean,
   nameOfComponent: string
 }
  */

function setup(propsObj) {
  let props;
  // Number of available slots in the QuickAccessBar. I just have it set to 5 but it can be anything
  const numberOfElements = 5;
  if (propsObj === undefined) {
    props = {
      // Status of each block in the QuickAccessBar grid
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
  const component = shallow(<QuickAccessBar
    componentsArray={props.componentArray}
    {...actions}
  />);
  return {
    component,
    actions,
  };
}

describe('QuickAccessBar', () => {
  it('Renders one empty QuickAccessBar', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });
  describe('QuickAccessBar sorts components in ascending order based on score', () => {
    const { component } = setup();
    const componentsArray = component.prop('componentsArray');
    // update with items that have been clicked most recently and sort in the correct order
    QuickAccessBar.updateDisplay();
    let i;
    // iterate through each element inthe componentsArray
    for (i = 0; i < componentsArray.length; i++) {
      // ignore the final element in the array
      if (i < (componentsArray.length - 1)) {
        expect(componentsArray[i].score).toBeLessThan(componentsArray[i + 1].score);
      }
    }
  });
});

