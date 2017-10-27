/* @flow */
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
// import type { SyntheticMouseEvent } from 'react-dom';
import update from 'immutability-helper';
import { FormControl, FormGroup, Form } from 'react-bootstrap';
import serialPort from 'serialport';

const clearCmd = {
  exec: ({ structure, history, cwd }, command) => {
    return { structure, cwd, history: [] };
  }
};

/* Command History */
type historyObjT = {
  cwd?: string,
  value?: string
};
/* State passed to a command */
type cmdStateT = {
  structure: {},
  history: historyObjT[],
  cwd: string
};

// /* Command Object passed to commands  */
// type cmdObjT = {
//   name: string,
//   input: string,
//   args: {},
//   flags: {
//     [flagName: string]: boolean
//   }
// };

async function getSerialPorts() {
  const serialList = await serialPort.list();
  console.log(serialList);
  return serialList;
}
  /* List all serial ports connected */
  const serialports = {
    exec: (state: cmdStateT, command: cmdObjT): cmdStateT => {
      /* Find all the serial ports */
      // serialPort.list((err, portList) => {
      //   console.log(portList);
      // });
      // const t = serialPort.list()
      //   .then((ports) => {
      //     console.log(state.history);
      //     // return 'hello';
      //     // const history = update(state.history, {
      //     //   $push: [{ value: 'poop' }]
      //     // });
      //     // this.setState({ history: state.history });
      //     return state.history;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      console.log(getSerialPorts());

      return update(state, {
        history: {
          $push: [{ value: 'test' }]
        }
      });
    }
  };

/* Command Object passed to commands  */
type cmdObjT = {
  name: string,
  input: string,
  args: {},
  flags: {
    [flagName: string]: boolean
  }
};


const commandsList = {
  clear: (state) => state,
  serialPort: (state) => state
};

type propsT = {

};
type historyT = {
  value: string,
  isCmd: boolean
};
type stateT = {
  commands: string[],
  cursorPosition: number,
  currentLine: string,
  history: historyT[],
  commandLineNumber: ?number
};

/* Calculate the current cursor position from the state */
function calculateCursorPosition(state: stateT): number {
  const { cursorPosition, history } = state;
  const startOffset = 2; // '> '
  const newLineOffset = 1; // '\n'
  let pastLen = 0;
  /* Add all of the previous commands */
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    if (entry.isCmd) {
      pastLen += startOffset;
    }
    pastLen = pastLen + entry.value.length + newLineOffset;
  }
  /* Add the start of line offset */
  pastLen += startOffset;
  return pastLen + cursorPosition;
}
type recallT = {
  cmd: string,
  index: ?number
};
/* Recall a previous command */
function recallPrevCommand(state: stateT): ?recallT {
  const { commandLineNumber, history } = state;
  /* Start at end if commandLineNumber is undefined */
  let startIndex = history.length;
  if (commandLineNumber != null) {
    startIndex = commandLineNumber;
  }
  for (let i = startIndex - 1; i >= 0; i--) {
    const entry = history[i];
    if (entry.isCmd) {
      return { cmd: entry.value, index: i };
    }
  }
  /* No Command was found */
  return undefined;
}
/* Recall the next command */
function recallNextCommand(state: stateT): ?recallT {
  const { commandLineNumber, history } = state;
  /* Nothing to return if undefined */
  if (commandLineNumber == null) {
    return undefined;
  }
  for (let i = commandLineNumber + 1; i < history.length; i++) {
    const entry = history[i];
    if (entry.isCmd) {
      return { cmd: entry.value, index: i };
    }
  }
  /* No Command was found */
  return { cmd: '', index: undefined };
}
/* Parse the current entry */
function parseLine(currentLine: string): cmdObjT {
  /* Tokenize */
  const tokens = currentLine.split(' ');
  const commandName = tokens[0];
  const command = commandsList[commandName];
  if (!command) {
    console.log('unknown command ', commandName);
  }
}

/* Begin Component */
export default class MicaTerminal extends Component {
  props: propsT;
  state: stateT;
  textInput: *;

  constructor(props: propsT) {
    super(props);

    this.state = {
      commands: ['help'],
      cursorPosition: 0,
      currentLine: '',
      history: [],
      commandLineNumber: undefined
    };
  }
  /* Handle all of the key presses */
  handleKeyPress = (event: SyntheticKeyboardEvent): void => {
    event.preventDefault();
    let { cursorPosition, currentLine, history, commandLineNumber } = this.state;
    const { key } = event;
    let command;
    /* Parse the command */
    switch (key) {
      /* Enter a command */
      case 'Enter':
        /* Parse the command */
        command = parseLine(currentLine);
        /* Store the line */
        history = update(history, {
          $push: [{
            value: currentLine,
            isCmd: true
          }]
        });
        currentLine = '';
        cursorPosition = 0;
        commandLineNumber = undefined;
        /* */
        break;
      /* Delete a character */
      case 'Backspace':
        /* Don't delete past start of line */
        if (cursorPosition > 0) {
          currentLine = currentLine.slice(0, cursorPosition - 1) +
            currentLine.slice(cursorPosition, currentLine.length);
          cursorPosition -= 1;
        }
        break;
      /* Navigate left */
      case 'ArrowLeft':
        if (cursorPosition > 0) {
          cursorPosition -= 1;
        }
        break;
      /* Navigate right */
      case 'ArrowRight':
        if (cursorPosition < currentLine.length) {
          cursorPosition += 1;
        }
        break;
      /* Recall previous line */
      case 'ArrowUp': {
        const recall = recallPrevCommand(this.state);
        if (recall) {
          currentLine = recall.cmd;
          commandLineNumber = recall.index;
          cursorPosition = currentLine.length;
        }
        break;
      }
      /* Move to next line */
      case 'ArrowDown': {
        const recall = recallNextCommand(this.state);
        console.log('arrowdown', recall);
        if (recall) {
          currentLine = recall.cmd;
          commandLineNumber = recall.index;
          cursorPosition = currentLine.length;
        }
        break;
      }
      /* All other keys */
      default:
        /* Normal character */
        if (typeof key === 'string' && key.length === 1) {
          currentLine += key;
          cursorPosition += 1;
        } else {
          /* Other meta characters */
          console.log('metaKey:', key);
        }
        break;
    }
    /* Update the state and cursor position */
    this.setState({ cursorPosition, currentLine, history, commandLineNumber }, () => {
      const pos = calculateCursorPosition(this.state);
      this.textInput.setSelectionRange(pos, pos);
    });
  }
  /* Handle click events - Bring focus, but don't move cursor */
  handleClick = (event: SyntheticMouseEvent): void => {
    event.preventDefault();
    this.textInput.focus();
  }
  /* Dummy function to suppress React warning */
  handleChange = () => {
    /* No-op */
  }
  /* What to display in the terminal */
  terminalValue(): string {
    let stringVal = '';
    /* Add the past history */
    const { history, currentLine } = this.state;
    for (let i = 0; i < history.length; i++) {
      const entry = history[i];
      if (entry.isCmd) {
        stringVal += '> ';
      }
      stringVal = `${stringVal}${entry.value}\n`;
    }
    /* Add the current line */
    stringVal += `> ${currentLine}`;
    return stringVal;
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

    const commands = {
      clearCmd,
      serialports
    };
    return (
      <div id="micaTerminal" style={terminalDivStyle}>
        <textarea
          id="terminalId"
          ref={(input) => { this.textInput = input; }}
          onMouseDown={this.handleClick}
          style={terminalStyle}
          onKeyDown={this.handleKeyPress}
          value={this.terminalValue()}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
/* [] - END OF FILE */
