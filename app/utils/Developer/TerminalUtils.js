/* @flow */
/* eslint no-plusplus: 0 */
/* **********************************************************
* File: utils/Developer/TerminalUtils.js
*
* Brief: Utilities for the mica Terminal
*
* Authors: Craig Cheney
*
* 2017.10.27 CC - Document created
*
********************************************************* */
import { clipboard } from 'electron';
import update from 'immutability-helper';
import terminalCommands from './TerminalCommand';
import type {
  terminalParsedObjT, terminalStateT
} from '../../types/developerTypes';

export const delimiters = /\s|\.|\(|\)|"|'|;|:|!/;
export const cmdLineStart = '> ';
export const valueLineStart = '    ';
export const lineEnd = '\n';
/* All of the values displayed in the terminal */
export function getTerminalDisplayValue(state: terminalStateT): string {
  let stringVal = '';
  /* Add the past history */
  const { history, currentLine } = state;
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    if (entry.isCmd) {
      stringVal += cmdLineStart;
    } else {
      stringVal += valueLineStart;
    }
    stringVal = `${stringVal}${entry.value}${lineEnd}`;
  }
  /* Add the current line */
  stringVal += `${cmdLineStart}${currentLine}`;
  return stringVal;
}
/* Calculate the current cursor position from the state */
export function calculateCursorPosition(state: terminalStateT): number {
  const { cursorPosition, history } = state;
  let pastLen = 0;
  /* Add all of the previous commands */
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    if (entry.isCmd) {
      pastLen += cmdLineStart.length;
    } else {
      pastLen += valueLineStart.length;
    }
    pastLen = pastLen + entry.value.length + lineEnd.length;
  }
  /* Add the start of line offset */
  pastLen += cmdLineStart.length;
  return pastLen + cursorPosition;
}
type recallT = {
  cmd: string,
  index: ?number
};
/* Recall a previous command */
export function recallPrevCommand(state: terminalStateT): ?recallT {
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
export function recallNextCommand(state: terminalStateT): ?recallT {
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

/*
 * This method parses a single command + args. It handles
 * the tokenization and processing of flags, anonymous args,
 * and named args.
 *
 * @param {string} input - the user input to parse
 * @returns {Object} the parsed command/arg
 */
export function parseInput(input: string): terminalParsedObjT {
  const tokens = input.split(/ +/);
  const name = tokens.shift();
  const flags = {};
  const args = {};
  let anonArgPos = 0;

  while (tokens.length > 0) {
    const token = tokens.shift();
    if (token[0] === '-') {
      if (token[1] === '-') {
        const next = tokens.shift();
        args[token.slice(2)] = next;
      } else {
        token.slice(1).split('').forEach(flag => {
          flags[flag] = true;
        });
      }
    } else {
      args[anonArgPos++] = token;
    }
  }
  return { name, flags, input, args };
}

/* Execute the command */
export async function executeCommand(currentLine: string): Promise<string[]> {
  /* Parse command */
  const parseObj: terminalParsedObjT = parseInput(currentLine);
  const { name: commandName } = parseObj;
  const commandExec = terminalCommands[commandName];
  if (!commandExec) {
    return [`${commandName}: command not found`];
  }

  const cmdReturn = await commandExec(parseObj);
  return cmdReturn;
}
/* Jump to the end of the word */
export function nextWordPosition(cursorPosition: number, currentLine: string): number {
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
export function prevWordPosition(cursorPosition: number, currentLine: string): number {
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
export async function handleHotKeys(
  event: SyntheticKeyboardEvent<>,
  state: terminalStateT
): Promise<terminalStateT> {
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
  return {
    ...state, cursorPosition, currentLine, commandLineNumber
  };
}

/* Handle a regular terminal input */
export async function handleTerminalInput(
  event: SyntheticKeyboardEvent<>,
  state: terminalStateT
): Promise<terminalStateT> {
  const { metaKeys } = state;
  let { cursorPosition, currentLine, history, commandLineNumber } = state;
  const { key } = event;
  /* Parse the key */
  switch (key) {
    /* Enter a command */
    case 'Enter': {
      /* Store the line */
      history = update(history, {
        $push: [{
          value: currentLine,
          isCmd: true
        }]
      });
      /* Execute the command */
      try {
        const cmdReturn = await executeCommand(currentLine);
        /* Update the object */
        for (let i = 0; i < cmdReturn.length; i++) {
          const cmdLine = cmdReturn[i];
          history = update(history, {
            $push: [{
              value: cmdLine,
              isCmd: false
            }]
          });
        }
      } catch (err) {
        /* Display error in the mica terminal */
        history = update(history, {
          $push: [
            {
              value: `Error: ${err}`,
              isCmd: false
            },
            {
              value: 'See console for more details',
              isCmd: false
            }
          ]
        });
        /* Log the error */
        console.log(`Error in terminal command: '${currentLine}'`, err);
      }
      currentLine = '';
      cursorPosition = 0;
      commandLineNumber = undefined;
      /* */
      break;
    }
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
      } else if (metaKeys.indexOf(key) === -1) {
        /* Store the meta key if not already stored */
        metaKeys.push(key);
      }
      break;
  } /* End Switch */
  return { ...state, cursorPosition, currentLine, history, commandLineNumber, metaKeys };
}

let terminalCallback;
export function registerCallback(callback: (string) => void): void {
  terminalCallback = callback;
}

export function logAsyncData(data: string): void {
  if (terminalCallback) {
    terminalCallback(data);
  }
}
/* [] - END OF FILE */
