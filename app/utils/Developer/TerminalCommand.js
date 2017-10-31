/* @flow */
/* **********************************************************
* File: utils/Developer/TerminalCommands.js
*
* Brief: Commands that can be executed in the mica terminal
*
* Authors: Craig Cheney
*
* 2017.10.27 CC - Document created
*
********************************************************* */
import Serialport from 'serialport';
import type {
  terminalParsedObjT
} from '../../types/developerTypes';

/* Echo the string, except for the name 'echo ' */
async function echo(cmdObj: terminalParsedObjT): Promise<string[]> {
  const echoLen = 'echo '.length;
  return [cmdObj.input.slice(echoLen)];
}

/* Open a serial port */
async function openPort(portName: string, baudRate: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const port = new Serialport(portName, { baudRate }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`Successfully opened ${portName}`);
      }
    });
    /* Store the reference */
    ports[portName] = port; // @FIXME: shouldn't store if failed...
  });
}

const ports = {};
/* Get the serial ports currently connected */
async function serial(cmdObj: terminalParsedObjT): Promise<string[]> {
  const { args, flags } = cmdObj;
  const serialList = await Serialport.list();
  const cmdReturn = [];
  /* List all devices */
  if (flags.l || flags.a) {
    /* iterate through each */
    for (let i = 0; i < serialList.length; i++) {
      const port = serialList[i];
      const { comName } = port;
      /* IF a usb modem, or the a flag is passed */
      if (comName.search('usbmodem') >= 0 || flags.a) {
        cmdReturn.push(comName);
      }
    }
  /* Open a serial port */
  } else if (flags.c) {
    /* Defaults */
    let nameNum = args[0];
    let baudRate = 115200;
    if (args.baud) {
      baudRate = parseInt(args.baud, 10);
    }
    for (let i = 0; i < serialList.length; i++) {
      const port = serialList[i];
      const { comName } = port;
      /* find the first matching string */
      if (nameNum && comName.search(nameNum) >= 0) {
        nameNum = comName;
        break;
      /* Find the first usbmodem */
      } else if (comName.search('usbmodem') >= 0) {
        nameNum = comName;
        break;
      }
    }
    /* open port */
    if (nameNum) {
      const portStatus = await openPort(nameNum, baudRate);
      cmdReturn.push(portStatus);
    } else {
      cmdReturn.push('No ports found');
    }
  } else {
    /* not enough args */
    const usage = [
      'usage: serial [-al] [-c [ <name> | <number> ]] --baud <baud=115200>]',
      '-a   List all serial ports (see -l)',
      '-l   List mica serial ports (see -a)',
      '-c   Start a new connection. Selects default if only one is available',
      '   name: Name of serial port',
      '   port: Port number (e.g. usbmodem1441 => 1441)',
      '   --baud   Sets the baud rate for the connection (default 115200)'
    ];
    cmdReturn.push(...usage);
  }
  return cmdReturn;
}

const terminalCommands = {
  serial,
  echo
};

export default terminalCommands;
/* [] - END OF FILE */
