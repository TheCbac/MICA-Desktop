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
import serialPort from 'serialport';
import type { terminalStateT } from '../../types/developerTypes';

import {
  handleHotKeys, handleTerminalInput, calculateCursorPosition, getTerminalDisplayValue
} from '../../utils/Developer/TerminalUtils';

// const clearCmd = {
//   exec: ({ structure, history, cwd }, command) => {
//     return { structure, cwd, history: [] };
//   }
// };

// /* Command History */
// type historyObjT = {
//   cwd?: string,
//   value?: string
// };
// /* State passed to a command */
// type cmdStateT = {
//   structure: {},
//   history: historyObjT[],
//   cwd: string
// };

// // /* Command Object passed to commands  */
// // type cmdObjT = {
// //   name: string,
// //   input: string,
// //   args: {},
// //   flags: {
// //     [flagName: string]: boolean
// //   }
// // };

// async function getSerialPorts() {
//   const serialList = await serialPort.list();
//   console.log(serialList);
//   return serialList;
// }
//   /* List all serial ports connected */
//   const serialports = {
//     exec: (state: cmdStateT, command: cmdObjT): cmdStateT => {
//       /* Find all the serial ports */
//       // serialPort.list((err, portList) => {
//       //   console.log(portList);
//       // });
//       // const t = serialPort.list()
//       //   .then((ports) => {
//       //     console.log(state.history);
//       //     // return 'hello';
//       //     // const history = update(state.history, {
//       //     //   $push: [{ value: 'poop' }]
//       //     // });
//       //     // this.setState({ history: state.history });
//       //     return state.history;
//       //   })
//       //   .catch((err) => {
//       //     console.log(err);
//       //   });

//       console.log(getSerialPorts());

//       return update(state, {
//         history: {
//           $push: [{ value: 'test' }]
//         }
//       });
//     }
//   };

// /* Command Object passed to commands  */
// type cmdObjT = {
//   name: string,
//   input: string,
//   args: {},
//   flags: {
//     [flagName: string]: boolean
//   }
// };


// const commandsList = {
//   clear: (state) => state,
//   serialPort: (state) => state
// };

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
      metaKeys: []
    };
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
    let newState;
    /* Handle a hotkey unless the only metakey is Shift */
    if (metaKeys.length && !(metaKeys.length === 1 && metaKeys[0] === 'Shift')) {
      newState = handleHotKeys(event, this.state);
    } else {
      newState = handleTerminalInput(event, this.state);
    }
    /* Update the state and cursor position */
    this.setState({ ...newState }, () => {
      const pos = calculateCursorPosition(this.state);
      const { textInput } = this;
      if (textInput) {
        textInput.setSelectionRange(pos, pos);
        textInput.scrollTop = textInput.scrollHeight;
      }
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
      width: '400px'
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
        />
      </div>
    );
  }
}
/* [] - END OF FILE */
