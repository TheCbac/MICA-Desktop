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
import { Serialport } from '../nativeModules';
import { logAsyncData, hexToString } from './TerminalUtils';
import {
  ledCmd, bootloaderCmd, resetCmd
} from '../dataStreams/controlCommands';
import { scanCmd, connectCmd, disconnectCmd } from '../dataStreams/commCommands';
import {
  parseMicaResponse, processMicaPacketByte, MICA_CYPRESS_PID, MICA_CYPRESS_VID
} from '../dataStreams/packets';
import { handleAsyncData, MICA_PACKET_ASYNC_RESP } from '../dataStreams/asyncResponses';
import type { subCommandT, subCommandObjT } from '../dataStreams/commandTypes';
import type { terminalParsedObjT } from '../../types/developerTypes';

const ports = {};
/* Serial subcommands - name is the name that gets called */
const subCommands: subCommandObjT = {
  leds: ledCmd,
  boot: bootloaderCmd,
  scan: scanCmd,
  connect: connectCmd,
  disconnect: disconnectCmd,
  reset: resetCmd
};
/* callback for when the command returns */
let cmdCallback;
let lastCmdObj;
let lastPacketObj;

/* Get the serial ports currently connected */
export default async function serial(cmdObj: terminalParsedObjT): Promise<string[]> {
  const { args, flags } = cmdObj;
  const cmdReturn = [];
  /* Set the last command */
  lastCmdObj = cmdObj;

  /* A sub command was passed in, execute the command */
  const port = getOpenPort();
  if (args[0] && port) {
    const subcommand = getSubCommand(args[0]);
    if (subcommand) {
      /* Extract the subcmd function and callback */
      const { generatePacketObj, callback } = subcommand;
      const { packetObj, binary, output } = generatePacketObj(cmdObj);
      /* Register the callback function */
      cmdCallback = callback;
      lastPacketObj = packetObj;
      /* Print the output if relevant */
      if (output) {
        cmdReturn.push(output);
      }
      /* Verbose flag */
      if (flags.v && binary) {
        cmdReturn.push(hexToString(binary));
      }
      /* Write the command */
      port.write(binary);
    }
  } else if (flags.l || flags.a) {
    /* List all devices */
    const serialList = await Serialport.list();
    console.log(serialList);
    /* iterate through each */
    for (let i = 0; i < serialList.length; i++) {
      const portInstance = serialList[i];
      const { comName, productId, vendorId } = portInstance;
      /* IF a usb modem, or the a flag is passed */
      if (isMicaSerialDevice(productId, vendorId) || flags.a) {
        cmdReturn.push(comName);
      }
    }
  /* Open a serial port */
  } else if (flags.c) {
    const serialList = await Serialport.list();
    /* Defaults */
    let nameNum = args[0];
    let baudRate = 115200;
    if (args.baud) {
      baudRate = parseInt(args.baud, 10);
    }
    for (let i = 0; i < serialList.length; i++) {
      const portInstance = serialList[i];
      const { comName, productId, vendorId } = portInstance;
      /* find the first matching string */
      if (nameNum && comName.search(nameNum) >= 0) {
        nameNum = comName;
        break;
      /* Find the first cypress device */
      } else if (isMicaSerialDevice(productId, vendorId)) {
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
      'echo - Writes the string following the command',
      'scan [state] - start or stop the scan'
    ];
    cmdReturn.push(...usage);
  }
  return cmdReturn;
}

/* check if a reported serialport is a MICA cube */
export function isMicaSerialDevice(productId: ?string, vendorId: ?string): boolean {
  return (
    parseInt(productId, 16) === MICA_CYPRESS_PID &&
    parseInt(vendorId, 16) === MICA_CYPRESS_VID
  );
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
        const { ByteLength } = Serialport.parsers;
        /* Send each individual byte */
        const parser = port.pipe(new ByteLength({ length: 1 }));
        parser.on('data', receiveSerialData);
        port.on('close', () => {
          logAsyncData(`Disconnected from ${portName}`);
        });
      }
    });
  });
}

/* Receive data from the serial port */
const receiveSerialData = (chunk) => {
  const { complete, packet } = processMicaPacketByte(chunk);
  if (complete && packet) {
    /* log on verbose */
    if (lastCmdObj.flags.v) {
      logAsyncData(hexToString(packet));
    }
    const { success, error, data } = parseMicaResponse(packet);
    /* Corrupted packet was received (packet response was not necessarily success) */
    if (!success || data == null) {
      console.log('Corrupted packet received:', error, packet);
      return;
    }
    /* Packet was not corrupted */
    const { status } = data;
    /* See if a response packet, or Async data */
    if (status >= MICA_PACKET_ASYNC_RESP) {
      /* Async data */
      handleAsyncData(data, packet);
    } else if (cmdCallback) {
      /* Packet was valid, send data to callback */
      cmdCallback(data, lastCmdObj, lastPacketObj, packet);
    }
  }
};


/* Get the open port - simple place holder */
function getOpenPort() {
  return ports[Object.keys(ports)[0]];
}

function getSubCommand(name: string): ?subCommandT {
  return subCommands[name];
}

/* [] - END OF FILE */
