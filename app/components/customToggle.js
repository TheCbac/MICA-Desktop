/* **********************************************************
* File: customToggle.js
*
* Brief: Custom dropdown toggle based on the bootstrap dropdown
*
* Authors: Craig Cheney
*
* 2017.08.30 CC - Document created
*
**********************************************************/
import React, { Component } from 'react';
import type { Element } from 'react';

export default class CustomToggle extends Component {
  /* Props validation */
  props: {
    onClick: ?() => void,
    children: Element
  }
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    this.props.onClick(e);
  }

  render() {
    const style = {
      fontFamily: 'Franklin Gothic Book',
      color: '#7C7C7C',
      textDecoration: 'none'
    };
    return (
      <a href="" style={style} className="glow" onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

/* [] - END OF FILE */

