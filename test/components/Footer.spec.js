// @flow
/* eslint no-underscore-dangle: 0 */
/* **********************************************************
* File: Footer.spec.js
*
* Brief: Test for the react footer component
*
* Author: George Whitfield
* Date: 2017.07.27
*
**********************************************************/

import React from 'react';
import { shallow } from 'enzyme';
import __RewireAPI__ from '../../app/components/Footer';
import Footer from '../../app/components/Footer';
 // The default export from Fotoer.js needs to be imported seperately or else Jest throws an error

function setup() {
  const component = shallow(<Footer />);
  return {
    component
  };
}
const mitLogoStyle = __RewireAPI__.__get__('mitLogoStyle');
const bilabLogoStyle = __RewireAPI__.__get__('bilabLogoStyle');
const footerStyle = __RewireAPI__.__get__('footerStyle');
// Begin test
describe('Footer test', () => {
  const { component } = setup();
  const grid = component.find('Grid');
  describe('Grid JSX Element', () => {
    it('Has correct values for props', () => {
      expect(grid.at(0).prop('className')).toEqual('Footer');
      expect(grid.at(0).prop('style')).toBe(footerStyle);
      expect(grid.at(0).prop('fluid')).toBe(true);
    });
    it('Colomn elements have correct props', () => {
      const col = component.find('Col');
      expect(col.at(0).prop('xs')).toBe(4);
      expect(col.at(1).prop('xs')).toBe(4);
      expect(col.at(2).prop('xs')).toBe(4);
    });
    it('Image elements match snapshot', () => {
      const img = component.find('img');
      expect(img.at(0)).toMatchSnapshot();
      expect(img.at(1)).toMatchSnapshot();
    });
    it('variables test', () => {
      expect(footerStyle).toMatchSnapshot();
      expect(mitLogoStyle).toMatchSnapshot();
      expect(bilabLogoStyle).toMatchSnapshot();
    });
  });
});
