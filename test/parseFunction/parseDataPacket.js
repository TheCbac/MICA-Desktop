/* Returns the data packet object from the dataPacket data */

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
  /* if the sign bit is set */
  let valueMinused;
  if ((value & (0x001 << (numBits - 1))) !== 0) {
    value = value - Math.pow(2, numBits);
  }
  return value;
}
function newPacketTime() {
  const packetTime = new Date();
  packetTime.microsecond = 0;
  packetTime.lastLogged = null;
  /* Modify packetTime for microseconds */
  packetTime.addMicroseconds = function (usec) {
    let micro = usec + this.microsecond;
    console.log(this.microsecond);
    console.log('This.microsecond^^^^^^^^^^^^^^^^^');
    let millisecond = Math.floor(micro/1000);
    this.setTime(this.getTime() + millisecond);
    console.log(this.getTime());
    console.log('This.getTime()^^^^^^^^^^^^^^^');
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
function parseDataPacket(peripheralId, data, numChannels, periodLength, packetTime, scalingConstant, gain, offset) {
  let i = 0;
  let dataArray = [];

  while (i < data.length) {
    try {
      /* ***************** Time information ***************** */
      const timeMSB = getValue(data, i++);
      const timeLSB = getValue(data, i++);
      console.log('Time LSB --> ' + timeLSB);
      console.log('Time MSB --> ' + timeMSB);
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
            console.log('rawData for channel ' + channel + ' --> ' + rawData);
          }
          /* If an odd numbered channel */
        else {
            /* Unpack the MSB of odd channels from the previous byte */
            dataMSB = getValue(data, (i - 1));
            dataLSB = getValue(data, (i + 1));
            rawData = ((dataMSB & LOW_NIBBLE_MASK) << BYTE_SHIFT) | dataLSB;
            console.log('rawData for channel ' + channel + ' --> ' + rawData);

          }

          /* Record the result */
          /* dataPoint = K/G*(x-x0) = K/G*x - offset */
        const chanOffset = offset[channel];
        console.log('offset for channel ' + channel + chanOffset);
          // console.log("parseData - RawData",rawData, this.twosCompToSigned(rawData, BITS_12));
        channelData[channel] = (scalingConstant / (gain * (twosCompToSigned(rawData, BITS_12)) - chanOffset).toFixed(5));
        console.log('ChannelData[' + channel + '] --> ' + channelData[channel]);
      }
      /* ***************** End Packet Data Parsing ***************** */
      /* Calculate the time differential */
      const timeDifferentialTwos = (timeMSB << HALF_BYTE_SHIFT) | ((timeLSB >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);
      
      console.log(timeDifferentialTwos);
      console.log('TIme Differential Twos^^^^^^^^^^^^^^^^^^^^^');

      const timeDifferential = twosCompToSigned(timeDifferentialTwos, BITS_12);

      console.log(timeDifferential);
      console.log('Time Differential^^^^^^^^^^^^^^^^^^^^^^^^^^^');

      const micro = periodLength + timeDifferential;

      console.log(micro);
      console.log('Micro^^^^^^^^^^^^^^^^^^^^^^^^^^^^')

      /* Add the number of microseconds to the packet time obj */
      packetTime.addMicroseconds(micro);
      const newTime = packetTime.getTimeMicro();

      console.log(newTime);
      console.log('^^^^^^^^^^^^^NEW TIME^^^^^^^^^^^^^^^^^^^^^^^^');

      /* Push the data array */
      const result = {
        t: newTime,
        d: channelData
      };
     /* console.log(result);
      console.log('Result above ^^^^^^^^^^^^^^^^^^^^');
      console.log('t --> ' + newTime);
      console.log('d --> ' + channelData); */

      dataArray.push(result);
      let array = [];
      array.push(result);
      
      /* console.log(array);
      console.log('Array above ^^^^^^^^^^^^^^');
      console.log(dataArray)
      console.log('Data Array above ^^^^^^^^^^^^^^^^^^^'); */


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

let i;
for (i = 0; i < 1; i++) {
  console.log(parseDataPacket(6, [110, 209, 90, 88, 130, 77, 34, 102], 5, 24, newPacketTimeVariable, 5, 1, [0, 0, 0, 0, 0]));
}

// read about what data buffers are
// read about noble.
