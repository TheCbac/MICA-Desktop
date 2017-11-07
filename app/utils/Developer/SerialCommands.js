/* @flow */
/* **********************************************************
* File: utils/Developer/SerialCommands.js
*
* Brief: Serial commands for communicating with MICA USB
*   devices
*
* Authors: Craig Cheney
*
* 2017.11.07 CC - Document created
*
********************************************************* */
import Serialport from 'serialport';
import { logAsyncData } from './TerminalUtils';
import {
  enterBootloaderCmd, dummyCmd, ledCmd
} from '../dataStreams/controlCommands';
import { parseMicaResponse } from '../dataStreams/packets';
import type { subCommandT, subCommandObjT } from '../dataStreams/controlCommands';
import type { terminalParsedObjT } from '../../types/developerTypes';

const ports = {};
const subCommands: subCommandObjT = {
  leds: ledCmd
};
/* callback for when the command returns */
let cmdCallback;
let lastCmdObj;
let lastPacketObj;

/* Get the serial ports currently connected */
export default async function serial(cmdObj: terminalParsedObjT): Promise<string[]> {
  const { args, flags } = cmdObj;
  const serialList = await Serialport.list();
  const cmdReturn = [];
  /* Set the last command */
  lastCmdObj = cmdObj;

  /* A sub command was passed in, execute the command */
  const port = getOpenPort();
  if (args[0] && port) {
    const subcommand = getSubCommand(args[0]);
    if (subcommand) {
      const { generatePacketObj, callback } = subcommand;
      const { packetObj, binary } = generatePacketObj(cmdObj);
      /* Register the callback function */
      cmdCallback = callback;
      lastPacketObj = packetObj;
      /* Write the command */
      port.write(binary);
    }
  } else if (flags.l || flags.a) {
    /* List all devices */
    /* iterate through each */
    for (let i = 0; i < serialList.length; i++) {
      /* More specific: vendorId: '04b4', productId: '0002' */
      const portInstance = serialList[i];
      const { comName } = portInstance;
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
      const portInstance = serialList[i];
      const { comName } = portInstance;
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
      'usage: serial [-abl] [-c [ <name> | <number> ]] --baud <baud=115200>] <command>',
      '-a   List all serial ports (see -l)',
      '-l   List mica serial ports (see -a)',
      '-c   Start a new connection. Selects default if only one is available',
      '   name: Name of serial port',
      '   port: Port number (e.g. usbmodem1441 => 1441)',
      '   --baud   Sets the baud rate for the connection (default 115200)',
      'boot - Enter bootload mode',
      'echo - Writes the string following the command'
    ];
    cmdReturn.push(...usage);
  }
  return cmdReturn;
}

/* Open a serial port */
async function openPort(portName: string, baudRate: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const port = new Serialport(portName, { baudRate }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`Successfully opened ${portName}`);
        /* Store the reference */
        ports[portName] = port;
        port.on('data', (chunk) => {
          const response = parseMicaResponse(chunk);
          if (cmdCallback && response.success && response.data) {
            cmdCallback(response.data, lastCmdObj, lastPacketObj);
          }
        });
        port.on('close', () => {
          logAsyncData(`Disconnected from ${portName}`);
        });
      }
    });
  });
}

/* Get the open port - simple place holder */
function getOpenPort() {
  return ports[Object.keys(ports)[0]];
}

function getSubCommand(name: string): ?subCommandT {
  return subCommands[name];
}

/* [] - END OF FILE */
