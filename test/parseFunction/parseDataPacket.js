/* Returns the data packet object from the dataPacket data */

let LOW_NIBBLE_MASK = 0x0F;
let HALF_BYTE_SHIFT = 4;
let BYTE_SHIFT = 8;
let ROLLUNDER_FLAG = 0x08;
let BITS_12 = 12;
let IS_ODD = 0x01;

function parseDataPacket(peripheralId, data, numChannels, periodLength, packetTime, scalingConstant, gain, offset) {
  const dataArray = [];
  let i = 0;
  while (i < data.length) {
    try {
      /* ***************** Time information ***************** */
      const timeMSB = this.getValue(data, i++);
      const timeLSB = this.getValue(data, i++);
      /* If the rollunder flag is set read secondsLSB */
      /* Currently no error correction is done with secondsLSB, but it
          needs to be read to maintain packet index integrity  */
      const rollunder = (timeLSB & ROLLUNDER_FLAG);
      if (rollunder) {
          const secondsLSB = this.getValue(data, i++);
      }
      /* ***************** Data information ***************** */
      const channelData =[];
      let dataMSB, dataLSB, rawData;
      for ( let channel =0; channel < numChannels; channel++){
          /* If an even numbered channel */
          if (!(channel & IS_ODD)) {
            dataMSB = this.getValue(data, i++);
            dataLSB = this.getValue(data, i++);
            rawData = (dataMSB << HALF_BYTE_SHIFT) | ((dataLSB >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);
          }
          /* If an odd numbered channel */
        else {
            /* Unpack the MSB of odd channels from the previous byte */
            dataMSB = this.getValue(data, (i - 1));
            dataLSB = this.getValue(data, (i + 1));
            rawData = ((dataMSB & LOW_NIBBLE_MASK) << BYTE_SHIFT) | dataLSB;
          }

          /* Record the result */
          /* dataPoint = K/G*(x-x0) = K/G*x - offset */
        const chanOffset = offset[channel];
          // console.log("parseData - RawData",rawData, this.twosCompToSigned(rawData, BITS_12));
        channelData[channel] = (scalingConstant / gain * (this.twosCompToSigned(rawData, BITS_12)) - chanOffset).toFixed(5);
      }
      /* ***************** End Packet Data Parsing ***************** */
      /* Calculate the time differential */
      const timeDifferentialTwos = (timeMSB << HALF_BYTE_SHIFT) | ((timeLSB >> HALF_BYTE_SHIFT) & LOW_NIBBLE_MASK);
      const timeDifferential = this.twosCompToSigned(timeDifferentialTwos, BITS_12);
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


// read about what data buffers are
// read about noble. 
