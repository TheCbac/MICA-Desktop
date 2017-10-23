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
import type {
  showUserSettingsActionT
} from '../types/appWideActionTypes';

type propsT = {
  developer: boolean,
  showUserSettings: (boolean) => showUserSettingsActionT,
  children?: Children
};
export default class App extends Component {
  props: propsT;

  render() {
    const { developer, showUserSettings } = this.props;
    return (
      <div>
        <Header
          developer={developer}
          showUserSettings={showUserSettings}
        />
        {this.props.children}
        {/* <Footer /> */}
      </div>
    );
  }
}

/* [] - END OF FILE */
