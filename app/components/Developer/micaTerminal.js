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
import Terminal from 'react-bash';
import update from 'immutability-helper';
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

/* Command Object passed to commands  */
type cmdObjT = {
  name: string,
  input: string,
  args: {},
  flags: {
    [flagName: string]: boolean
  }
};

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


export default class MicaTerminal extends Component {

  render() {
    const terminalDivStyle = {
      marginTop: '10px',
      marginBottom: '10px',
      height: '300px'
    };
    const terminalStyle = {
    };

    const commands = {
      clearCmd,
      serialports
    };
    return (
      <div id="micaTerminal" style={terminalDivStyle}>
        <Terminal
          style={terminalStyle}
          extensions={commands}
        />
      </div>
    );
  }
}
/* [] - END OF FILE */
