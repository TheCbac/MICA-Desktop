/* @flow */
/* **********************************************************
* File: test/jestSetup.js
*
* Brief: Sets up the Jest environment. Runs before each test
* suite. Passed as argument to runTest.js
*
* Authors: Craig Cheney
*
* 2017.11.06 CC - Document created
*
********************************************************* */
import 'raf/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

/* [] - END OF FILE */
