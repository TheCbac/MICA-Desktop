/* @flow */
/* eslint react/no-unused-state: 0 */
/* **********************************************************
* File: components/Developer/micaTerminal.js
*
* Brief: Terminal for interacting with CLI of MICA
*
* Authors: Craig Cheney
*
* 2017.10.25 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import update from 'immutability-helper';
import type { terminalStateT } from '../../types/developerTypes';

import {
  handleHotKeys, handleTerminalInput, calculateCursorPosition, getTerminalDisplayValue,
  registerCallback
} from '../../utils/Developer/TerminalUtils';

type propsT = {};
/* Begin Component */
export default class MicaTerminal extends Component<propsT, terminalStateT> {
  textInput: *;

  constructor(props: propsT) {
    super(props);

    this.state = {
      commands: ['help'],
      cursorPosition: 0,
      currentLine: '',
      history: [],
      commandLineNumber: undefined,
      metaKeys: [],
    };
  }
  componentDidMount() {
    registerCallback(this.logData);
  }
  logData = (data: string): void => {
    const state = update(this.state, {
      history: {
        $push: [{
          value: data,
          isCmd: false
        }]
      }
    });
    this.setState(state);
  }
  handleKeyUp = (event: SyntheticKeyboardEvent<>): void => {
    const { key } = event;
    const { metaKeys } = this.state;
    /* remove each key */
    const index = metaKeys.indexOf(key);
    if (index >= 0) {
      metaKeys.splice(index, 1);
    }
    this.setState({ metaKeys });
  }
  /* Handle all of the key presses */
  handleKeyDown = (event: SyntheticKeyboardEvent<>): void => {
    event.preventDefault();
    const { metaKeys } = this.state;
    let statePromise;
    /* Handle a hotkey unless the only metaKey is Shift */
    if (metaKeys.length && !(metaKeys.length === 1 && metaKeys[0] === 'Shift')) {
      statePromise = handleHotKeys(event, this.state);
    } else {
      statePromise = handleTerminalInput(event, this.state);
    }
    /* Update the state once the promise has resolved */
    statePromise.then((state: terminalStateT) => {
      this.setState({ ...state }, () => {
        const pos = calculateCursorPosition(this.state);
        const { textInput } = this;
        /* Scroll to bottom of page */
        if (textInput) {
          textInput.setSelectionRange(pos, pos);
          textInput.scrollTop = textInput.scrollHeight;
        }
      });
      return state;
    }).catch((error) => {
      /* This should be unreachable */
      console.log('Terminal error:', error);
    });
  }
  /* Handle click events - Bring focus, but don't move cursor */
  handleClick = (event: SyntheticMouseEvent<>): void => {
    event.preventDefault();
    if (this.textInput) {
      this.textInput.focus();
    }
  }
  /* Remove any meta keys */
  handleBlur = (): void => {
    this.setState({ metaKeys: [] });
  }
  /* Handle dropping of files */
  handleDrop = (event: SyntheticDragEvent<>): void => {
    const filePath = event.dataTransfer.files[0].path;
    if (filePath) {
      let { currentLine, cursorPosition } = this.state;
      currentLine += filePath;
      cursorPosition += filePath.length;
      this.setState({ currentLine, cursorPosition });
    }
  }
  /* Dummy function to suppress React warning */
  handleChange = () => { /* @FIXME - why doesn't this trigger? */
    /* No-op */
    console.log('handleChange');
    // this.textInput.scrollTop = this.textInput.scrollHeight;
  }
  render() {
    const terminalDivStyle = {
      marginTop: '10px',
      marginBottom: '10px',
      height: '300px'
    };
    const terminalStyle = {
      height: '300px',
      width: '100%',
    };
    return (
      <div id="micaTerminal" style={terminalDivStyle}>
        <textarea
          id="terminalId"
          ref={(input) => { this.textInput = input; }}
          onMouseDown={this.handleClick}
          style={terminalStyle}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          value={getTerminalDisplayValue(this.state)}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onDrop={this.handleDrop}
        />
      </div>
    );
  }
}
/* [] - END OF FILE */
