/* **********************************************************
* File: customMenu.js
*
* Brief: Custom dropdown menu based on the bootstrap dropdown
*
* Authors: Craig Cheney
*
* 2017.08.30 CC - Document created
*
**********************************************************/
import React, { Component, ReactDOM } from 'react';

export default class CustomMenu extends Component {
  constructor(props, context) {
    super(props, context);

    this.onChange = e => this.setState({ value: e.target.value });

    this.state = { value: '' };
  }

  focusNext() {
    const input = ReactDOM.findDOMNode(this.input);

    if (input) {
      input.focus();
    }
  }

  render() {
    const { children } = this.props;
    const { value } = this.state;
    const style = {
      fontFamily: 'Franklin Gothic Book',
      color: '#7C7C7C',
      textDecoration: 'none'
    };
    return (
      <div className="dropdown-menu" style={style}>
        <ul className="list-unstyled" style={style}>
          {React.Children.toArray(children).filter(child => (
            !value.trim() || child.props.children.indexOf(value) !== -1
          ))}
        </ul>
      </div>
    );
  }
}

/* [] - END OF FILE */
