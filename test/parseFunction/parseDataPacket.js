/* Returns the data packet object from the dataPacket data */
/* eslint no-bitwise: 0 */
/* eslint import/prefer-default-export: 0 */

const LOW_NIBBLE_MASK = 0x0F;
const HALF_BYTE_SHIFT = 4;
const BYTE_SHIFT = 8;
const ROLLUNDER_FLAG = 0x08;
const BITS_12 = 12;
const IS_ODD = 0x01;

const newPacketTimeVariable = newPacketTime();

/* ************* Generic Helpers ************* */
/* wrapper function to ensure BLE and USB functionality  */
function getValue(data, index) {
  if (data._isBuffer) {
    return data.readUInt8(index);
  }
  return data[index];
}
/* Converts a twos complement word of numBits length to a signed int */
function twosCompToSigned(value, numBits) {
  let newValue;
  /* if the sign bit is set */
  if ((value & (1 << (numBits - 1))) !== 0) {
    newValue = value - Math.pow(2, BITS_12);
    return newValue;
  }
  return value;
  // console.log(Math.pow(2,numBits));
  // console.log('numbits^^^^^^^^^^^^^');
  // console.log(value);
  // console.log('Value^ ^ ^ ^ ^ ^ ^ ');
}
function newPacketTime() {
  const packetTime = new Date();
  packetTime.microsecond = 0;
  packetTime.lastLogged = null;
  /* Modify packetTime for microseconds */
  packetTime.addMicroseconds = function (usec) {
    let micro = usec + this.microsecond;
    let millisecond = Math.floor(micro/1000);
    this.setTime(this.getTime() + millisecond);
    this.microsecond = (micro % 1000);
    return this.microsecond;
  };
  // Look into 'extends'
  packetTime.getMicroseconds = function () {
    return this.microsecond;
    
  };
  /* returns the timestamp with microseconds */
  packetTime.getTimeMicro = function () {

    return Number(this.getTime()+ "." + this.microsecond);
  };

  return packetTime;
}

/* Parse Data Function */
export const parseDataPacket = function (peripheralId, data, numChannels, periodLength, packetTime, scalingConstant, gain, offset) {
  let i = 0;
  let dataArray = [];

  while (i < data.length) {
    try {
      /* ***************** Time information ***************** */
      const timeMSB = getValue(data, i++);
      const timeLSB = getValue(data, i++);
      /* If the rollunder flag is set read secondsLSB */
      /* Currently no error correction is done with secondsLSB, but it
          needs to be read to maintain packet index integrity  */
      const rollunder = (timeLSB & ROLLUNDER_FLAG);
      if (rollunder) {
          const secondsLSB = getValue(data, i++);
      }
      /* ***************** Data information ***************** */
      const channelData = [];
      let dataMSB, dataLSB, rawData;
      for (let channel = 0; channel < numChannels; channel++) {
          /* If an even numbered channel */
          if (!(channel & IS_ODD)) {
            dataMSB = getValue(data, i++);
            dataLSB = getValue(data, i++);
            rawData = (dataMSB << HALF_BYTE_SHIFT) | ((dataLSB >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);
          }
          /* If an odd numbered channel */
        else {
            /* Unpack the MSB of odd channels from the previous byte */
            dataMSB = getValue(data, (i - 1));
            dataLSB = getValue(data, (i + 1));
            rawData = ((dataMSB & LOW_NIBBLE_MASK) << BYTE_SHIFT) | dataLSB;
            // console.log('rawData for channel ' + channel + ' --> ' + rawData);

          }

          /* Record the result */
          /* dataPoint = K/G*(x-x0) = K/G*x - offset */
        const chanOffset = offset[channel];
        channelData[channel] = (scalingConstant / (gain * (twosCompToSigned(rawData, BITS_12)) - chanOffset).toFixed(5));
      }
      /* ***************** End Packet Data Parsing ***************** */
      /* Calculate the time differential */
      const timeDifferentialTwos = (timeMSB << HALF_BYTE_SHIFT) | ((timeLSB >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);

      const timeDifferential = twosCompToSigned(timeDifferentialTwos, BITS_12);

      const micro = periodLength + timeDifferential;

      /* Add the number of microseconds to the packet time obj */
      packetTime.addMicroseconds(micro);
      const newTime = packetTime.getTimeMicro();

      /* Push the data array */
      const result = {
        t: newTime,
        d: channelData
      };

      dataArray.push(result);
      let array = [];
      array.push(result);

      /* ***************** Update on the graph ***************** */
      /* Time in milliseconds between updates */
      const graphingInterval = 60;
      /* Graph on client if beyond the graphing interval */
      if (packetTime.lastLogged === null || (newTime - packetTime.lastLogged) > graphingInterval) {
        packetTime.lastLogged = newTime;
          /* report to client */
        // Streamy.emit('reportSensorData', {id: peripheralId, sensorData: result }, clientSocket);	
      }
    /* Catch any Errors */
    }
    catch (err) {
      console.log('parseDataPacket: ', err);
    }
  } /* End While */
  return dataArray;
}

/*
let i;

for (i = 0; i < 1; i++) {
  console.log(parseDataPacket(6, [110, 209, 90, 88, 130, 77, 34, 102], 5, 24, newPacketTimeVariable, 5, 1, [0, 0, 0, 0, 0]));
}
*/
