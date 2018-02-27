// @flow
/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */
/* eslint no-plusplus: 0 */
/* **********************************************************
* File: test/ThingsThatDontExistYet/quickAccessBar.spec.js
*
* Brief: Test for frecency bar
*
* Author: George Whitfield
* Date: 2017.08.09
*
********************************************************* */
import { Button, Grid } from 'react-bootstrap';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import * as React from 'react';
import { QuickAccessBar, __RewireAPI__ as Rewire } from '../../app/components/QuickAccessBar'; // does not exist yet.
import UnpinComponentButton from '../../app/components/UnpinComponentButton'; // does not exist yet.

// componentArray = Array of objects containing information about what's being rednered in the quick access bar.

/* Each item in the array has the following properties: {
   score: boolean,
   component: React Component
 }
  */

function setup(propsObj) {
  let props;
  // Number of available slots in the QuickAccessBar. I just have it set to 5 but it can be anything
  const numberOfElements = 5;
  if (propsObj === undefined) {
    props = {
      // Status of each block in the QuickAccessBar grid
      componentArray: [
        { score: 1, component: <Button /> },
        { score: 2, component: <Grid /> },
        { score: null, component: null },
        { score: null, component: null }
      ]
    };
  } else {
    props = { ...propsObj };
  }
  const actions = {
    updateDisplay: sinon.spy(),
    getFrecencies: sinon.spy()
  };
  const component = shallow(<QuickAccessBar
    componentArray={props.componentArray}
    {...actions}
  />);
  return {
    component,
    actions
  };
}

describe('QuickAccessBar', () => {
  it('Renders one empty QuickAccessBar', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });
  describe('QuickAccessBar sorts components in ascending order based on score', () => {
    const { component } = setup();
    const componentArray = component.prop('componentArray');
    // update with items that have been clicked most recently and sort in the correct order
    QuickAccessBar.updateDisplay();
    let i;
    // iterate through each element inthe componentArray
    for (i = 0; i < componentArray.length; i++) {
      // ignore the final element in the array and if there is no component assigned to the current index of array
      if (componentArray[i].component != null) {
        if (i < (componentArray.length - 1)) {
          expect(componentArray[i].score).toBeLessThan(componentArray[i + 1].score);
        }
      }
    }
  });
  it('Elemenets in QuickAccessBar have a pin/unpin button', () => {
    const { component } = setup();
    expect(component.childAt(0).contains(<UnpinComponentButton />)).toBe(true);
    expect(component.childAt(1).contains(<UnpinComponentButton />)).toBe(true);
    expect(component.childAt(2).contains(<UnpinComponentButton />)).toBe(false);
  });
  it('Renders the correct component in QuickAccessBar', () => {
    const { component } = setup();
    expect(component.childAt(0).contains(<Button />)).toBe(true);
    expect(component.childAt(1).contains(<Grid />)).toBe(true);
    expect(component.childAt(2).contains(undefined)).toBe(true);
  });
});

