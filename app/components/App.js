// @flow
/* **********************************************************
* File: components/App.js
*
* Brief: Main component for the application
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import type { Children } from 'react';
import Header from './Header';
// import Footer from '../components/Footer';

type propsT = {
  developer: boolean,
  children?: Children
};
export default class App extends Component {
  props: propsT;

  render() {
    return (
      <div>
        <Header developer={this.props.developer} />
        {this.props.children}
        {/* <Footer /> */}
      </div>
    );
  }
}

/* [] - END OF FILE */
