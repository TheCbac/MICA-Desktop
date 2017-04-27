// @flow
import React, { Component } from 'react';
import { Button } from 'react-desktop/windows';

export default class extends Component {
  props: {
    color: string
  }
  static defaultProps = {
    color: '#b0abff'
  };
  render() {
    return (
      <Button
        push color={this.props.color}
        onClick={() =>
          console.log('Clicked!')
        }
      >
      Press me!
      </Button>
    );
  }
}
