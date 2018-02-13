/* @flow */
/* eslint no-bitwise: 0 */
/* **********************************************************
* File: components/CollectData/CoilControl.js
*
* Brief: Component for interacting with a spring-mass coil
*
* Authors: Craig Cheney
*
* 2017.09.30 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row, Button, ButtonToolbar } from 'react-bootstrap';
import { bleWriteCharacteristic } from '../../utils/BLE/bleFunctions';
import { micaCharUuids } from '../../utils/mica/micaConstants';
import { MASK_BYTE_ONE, SHIFT_BYTE_ONE } from '../../utils/bitConstants';
import type { idType } from '../../types/paramTypes';

type propsT = {
  deviceId: idType
};

type commandT = 'pulse' | 'step' | 'ramp' | 'stochastic';
type stateT = {
  running: boolean,
  command: ?commandT,
  timeout: ?number,
  interval: ?number
};

type periodCountT = {
  pcMsb: number,
  pcLsb: number
};

let rampVal = 0;
/* Needs to be refactored for when multiple methods exist */
const bleMethod = 'ble';
const charUuid = micaCharUuids.actuationCommands;
const durationInfinite = 0x00;
const stochasticBaseDuration = 300;
const stochasticAmplitude = 50;
/* Basic static commands for the coil */
const coilStartCmd = 0x81;
const coilChannels = 0x01;
const coilGenType = 0x01;
const coilHeaderCmd = [coilStartCmd, coilChannels, coilGenType];
/* Default state type */
const defaultState = {
  running: false,
  command: undefined,
  timeout: undefined,
  interval: undefined
};

/* Get the period count from duration in ms */
function durationToPc(duration: number): periodCountT {
  const pcMsb = (duration >> SHIFT_BYTE_ONE) & MASK_BYTE_ONE;
  const pcLsb = duration & MASK_BYTE_ONE;
  return { pcMsb, pcLsb };
}

/* Create the stochastic signal */
function stochasticCallback(numTimesRemaining: number): void {
  /* stop the coil - no need to clear as it's a timeout, not an interrupt */
  if (numTimesRemaining <= 0) {
    this.cancelCoilCmd();
    return;
  }
  /* Create an alternating binary value  */
  const binaryVal = (numTimesRemaining % 2) * stochasticAmplitude;
  /* Write the value */
  this.writeCoilCmd('stochastic', binaryVal, durationInfinite);
  /* Create the randomness */
  const randDuration = Math.round(Math.random() * stochasticBaseDuration);
  /* Register another timeout */
  const stochasticTimeout = setTimeout(
    stochasticCallback.bind(this),
    randDuration,
    (numTimesRemaining - 1)
  );
  /* Update the timeout id */
  this.setState({ timeout: stochasticTimeout });
}

/* Component */
export default class CoilControl extends Component<propsT, stateT> {
  constructor(props: propsT): void {
    super(props);
    this.state = defaultState;
  }
  /* Set the color of the button based on the state */
  btnStyle(btnCommand: commandT): 'danger' | 'primary' {
    const { running, command } = this.state;
    /* If a command is running */
    if (running && command === btnCommand) {
      return 'danger';
    }
    return 'primary';
  }
  /* A button isn't clickable when a command is running */
  btnDisabled(btnCommand: commandT): boolean {
    const { running, command } = this.state;
    /* If a command is running */
    if (running) {
      if (command === btnCommand) {
        return false;
      }
      return true;
    }
    return false;
  }
  /* Write to the coil */
  writeCoilCmd(command: ?commandT, amplitude: number, duration: number): void {
    const { deviceId } = this.props;
    const { pcMsb, pcLsb } = durationToPc(duration);
    const cmdPacket = [...coilHeaderCmd, amplitude, pcMsb, pcLsb];
    /* Write to the device */
    bleWriteCharacteristic(bleMethod, deviceId, charUuid, cmdPacket);
    /* Register the optimistic callback, if not infinite */
    let timeout;
    if (duration) {
      timeout = setTimeout(() => this.setState(defaultState), duration);
    }
    /* Set the state to be running */
    this.setState({ running: true, command, timeout });
  }

  /* Stop the current command */
  cancelCoilCmd(): void {
    const { deviceId } = this.props;
    const stopPacket = [0x01];
    bleWriteCharacteristic(bleMethod, deviceId, charUuid, stopPacket);
    /* Clear the timeout */
    const { timeout } = this.state;
    if (timeout) { clearTimeout(timeout); }
    /* Reset the state */
    this.setState(defaultState);
  }

  /* Command a pulse to the coil - should be dynamic */
  pulseCoil(): void {
    const { running, command } = this.state;
    /* If already running cancel the command */
    if (running && command === 'pulse') {
      this.cancelCoilCmd();
      return;
    }
    /* Duration of the pulse */
    const amplitude = 99;
    const duration = 200;
    /* Write the command */
    this.writeCoilCmd('pulse', amplitude, duration);
  }
  /* Command a step to the coil */
  stepCoil(): void {
    const { running, command } = this.state;
    /* If already running cancel the command */
    if (running && command === 'step') {
      this.cancelCoilCmd();
      return;
    }
    /* Duration of the pulse in ms */
    const duration = 3000;
    const amplitude = 25;
    /* Write the command */
    this.writeCoilCmd('step', amplitude, duration);
  }
  /* Command a step to the coil */
  rampCoil(): void {
    const { running, command, interval: rampInt } = this.state;
    /* If already running cancel the command */
    if (running && command === 'ramp') {
      this.cancelCoilCmd();
      /* Clear the interval */
      if (rampInt) { clearInterval(rampInt); }
      /* Reset the value */
      rampVal = 0;
      return;
    }
    const intervalDuration = 300;
    const interval = setInterval(
      () => {
        const { interval: rampInterval } = this.state;
        console.log('ramp', rampVal);
        /* If at max val, cancel the ramp and clear the interval */
        if (rampVal >= 99) {
          this.cancelCoilCmd();
          /* Clear the interval */
          if (rampInterval) { clearInterval(rampInterval); }
          /* Reset the value */
          rampVal = 0;
          return;
        }
        /* Otherwise, increase the ramp value */
        rampVal += 1;
        this.writeCoilCmd('ramp', rampVal, durationInfinite);
        /* update the state with the new ramp val */
      },
      intervalDuration
    );
    /* Register the interval */
    this.setState({ interval });
  }

  /* Command to stochastically perturb the coil */
  stochasticCoil(): void {
    const { running, command, timeout } = this.state;
    /* If already running cancel the command */
    if (running && command === 'stochastic') {
      this.cancelCoilCmd();
      /* Clear the interval */
      if (timeout) { clearTimeout(timeout); }
      return;
    }
    const stochasticNumTimes = 100;
    /* register the callback - pass the duration to the callback */
    const stochasticTimeout = setTimeout(
      stochasticCallback.bind(this),
      stochasticBaseDuration,
      stochasticNumTimes
    );
    this.setState({ running: true, timeout: stochasticTimeout, command: 'stochastic' });
  }
  /* Render function */
  render() {
    return (
      <div>
        <Col md={12}>
          <span style={{ fontFamily: 'Abel', fontSize: '1.25em' }}>COIL</span>
        </Col>
        <Row />
        <Col md={12}>
          <ButtonToolbar>
            <Button
              disabled={this.btnDisabled('pulse')}
              bsStyle={this.btnStyle('pulse')}
              onClick={() => this.pulseCoil()}
            >Pulse</Button>
            <Button
              disabled={this.btnDisabled('step')}
              bsStyle={this.btnStyle('step')}
              onClick={() => this.stepCoil()}
            >Step</Button>
            <Button
              disabled={this.btnDisabled('ramp')}
              bsStyle={this.btnStyle('ramp')}
              onClick={() => this.rampCoil()}
            >Ramp</Button>
            <Button
              disabled={this.btnDisabled('stochastic')}
              bsStyle={this.btnStyle('stochastic')}
              onClick={() => this.stochasticCoil()}
            >Stochastic</Button>
          </ButtonToolbar>
        </Col>
      </div>
    );
  }
}
/* [] - END OF FILE */
