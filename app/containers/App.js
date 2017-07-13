// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div id="root">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
