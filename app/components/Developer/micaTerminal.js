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
import { clipboard } from 'electron';
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
  commandLineNumber: ?number,
  metaKeys: string[]
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

const delimiters = /\s|\.|\(|\)|"|'|;|:|!/;
/* Jump to the end of the word */
function nextWordPosition(cursorPosition: number, currentLine: string): number {
  /* split the string */
  const wordArray = currentLine.substr(cursorPosition).split(delimiters);
  if (wordArray) {
    let accumulator = 0;
    for (let i = 0; i < wordArray.length; i++) {
      const word = wordArray[i];
      if (word.length) {
        return cursorPosition + word.length + accumulator;
      }
      /* Skip the delimiter */
      accumulator += 1;
    }
  }
  const maxLen = currentLine.length;
  return cursorPosition < maxLen ? cursorPosition : maxLen;
}

/* Jump to start of the previous word */
function prevWordPosition(cursorPosition: number, currentLine: string): number {
  const wordArray = currentLine.substr(0, cursorPosition).split(delimiters);
  if (wordArray) {
    let accumulator = 0;
    for (let i = wordArray.length - 1; i >= 0; i--) {
      const word = wordArray[i];
      if (word.length) {
        return cursorPosition - word.length - accumulator;
      }
      /* Skip the delimiter */
      accumulator += 1;
    }
  }
  const minLen = 0;
  return cursorPosition > minLen ? cursorPosition : minLen;
}

/* Handle all of the hotkeys */
function handleHotKeys(event: SyntheticKeyboardEvent, state: stateT): stateT {
  const { key } = event;
  let { cursorPosition, currentLine, commandLineNumber } = state;
  const { metaKeys } = state;
  /* Push any new keys */
  if (key === 'Meta' || key === 'Alt' || key === 'Control') {
    /* Store the meta key if not already stored */
    if (metaKeys.indexOf(key) === -1) {
      metaKeys.push(key);
    }
  }
  /* find presence of keys */
  const meta: boolean = metaKeys.indexOf('Meta') >= 0;
  const alt: boolean = metaKeys.indexOf('Alt') >= 0;
  const control: boolean = metaKeys.indexOf('Control') >= 0;
  /* There's got to be a more compact form */
  if (meta && !alt && !control) {
    /* META */
    switch (key) {
      /* Beginning of line */
      case 'ArrowLeft':
        cursorPosition = 0;
        break;
      /* End of line */
      case 'ArrowRight':
        cursorPosition = currentLine.length;
        break;
      /* Delete line */
      case 'Backspace':
        currentLine = '';
        cursorPosition = 0;
        commandLineNumber = undefined;
        break;
      /* Paste */
      case 'v':
        /* Insert the key at the cursor position */
        currentLine = currentLine.substr(0, cursorPosition)
          + clipboard.readText() + currentLine.substr(cursorPosition);
        cursorPosition += clipboard.readText().length;
        commandLineNumber = undefined;
        break;
      default:
        break;
    }
  } else if (!meta && alt && !control) {
    /* ALT */
    switch (key) {
      case 'Backspace': {
        const wordStart = prevWordPosition(cursorPosition, currentLine);
        /* delete the word in question */
        currentLine = currentLine.slice(0, wordStart) +
          currentLine.slice(cursorPosition, currentLine.length);
        cursorPosition = wordStart;
        commandLineNumber = undefined;
        break;
      }
      case 'ArrowLeft':
        cursorPosition = prevWordPosition(cursorPosition, currentLine);
        break;
      /* End of the next word */
      case 'ArrowRight':
        cursorPosition = nextWordPosition(cursorPosition, currentLine);
        break;
      default:
        break;
    }
  }
  return { ...state, cursorPosition, currentLine, commandLineNumber };
}

/* Handle a regular terminal input */
function handleTerminalInput(event: SyntheticKeyboardEvent, state: stateT): stateT {
  const { metaKeys } = state;
  let { cursorPosition, currentLine, history, commandLineNumber } = state;
  let command;
  const { key } = event;
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
        /* Delete at the cursor position */
        currentLine = currentLine.slice(0, cursorPosition - 1) +
          currentLine.slice(cursorPosition, currentLine.length);
        cursorPosition -= 1;
        /* typing means that the line should be reset */
        commandLineNumber = undefined;
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
      const recall = recallPrevCommand(state);
      if (recall) {
        currentLine = recall.cmd;
        commandLineNumber = recall.index;
        cursorPosition = currentLine.length;
      }
      break;
    }
    /* Move to next line */
    case 'ArrowDown': {
      const recall = recallNextCommand(state);
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
        /* Insert the key at the cursor position */
        currentLine = currentLine.substr(0, cursorPosition)
          + key + currentLine.substr(cursorPosition);
        cursorPosition += 1;
        /* typing means that the line should be reset */
        commandLineNumber = undefined;
      } else {
        /* Store the meta key if not already stored */
        if (metaKeys.indexOf(key) === -1) {
          metaKeys.push(key);
        }
        /* Other meta characters */
        console.log('metaKey:', key);
      }
      break;
  } /* End Switch */
  return { ...state, cursorPosition, currentLine, history, commandLineNumber, metaKeys };
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
      commandLineNumber: undefined,
      metaKeys: []
    };
  }
  handleKeyUp = (event: SyntheticKeyboardEvent): void => {
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
  handleKeyDown = (event: SyntheticKeyboardEvent): void => {
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
      this.textInput.setSelectionRange(pos, pos);
    });
  }
  /* Handle click events - Bring focus, but don't move cursor */
  handleClick = (event: SyntheticMouseEvent): void => {
    event.preventDefault();
    this.textInput.focus();
  }
  /* Remove any meta keys */
  handleBlur = (): void => {
    this.setState({ metaKeys: [] });
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
    return (
      <div id="micaTerminal" style={terminalDivStyle}>
        <textarea
          id="terminalId"
          ref={(input) => { this.textInput = input; }}
          onMouseDown={this.handleClick}
          style={terminalStyle}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          value={this.terminalValue()}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </div>
    );
  }
}
/* [] - END OF FILE */
