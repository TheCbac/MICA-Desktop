/* @flow */
/* **********************************************************
* File: components/CollectData/DriveBotComponent.js
*
* Brief: React component for controlling DriveBot
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import FA from 'react-fontawesome';
import { writeCharacteristic } from '../../utils/mica/micaNobleDevices';
import { micaCharUuids } from '../../utils/mica/micaConstants';

type propsType = {
  deviceId: string
};
type stateType = {
  keyPressed: boolean
};

type directionType = 'forward' | 'backward' | 'left' | 'right';

export default class DriveBot extends Component {
  props: propsType;
  state: stateType;
  /* Constructor function */
  constructor(props: propsType) {
    super(props);
    this.state = {
      keyPressed: false
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
  onKeyDown = (event: {keyCode: number}): void => {
    /* If a key is already pressed, do nothing */
    if (this.state.keyPressed) { return; }
    /* A key has not been pressed */
    this.setState({ keyPressed: true });
    /* Determine the direction */
    let direction;
    switch (event.keyCode) {
      case 37:
        direction = 'left';
        break;
      case 38:
        direction = 'forward';
        break;
      case 39:
        direction = 'right';
        break;
      case 40:
        direction = 'backward';
        break;
      default:
        return;
    }
    /* Move drivebot */
    this.onMouseDown(direction);
  };
  onKeyUp = (): void => {
    /* Clear the key pressed flag */
    this.setState({ keyPressed: false });
    this.onMouseUp();
  }

  onMouseDown(direction: directionType): void {
    const { deviceId } = this.props;
    /* Get the characteristic UUID */
    const { communicationCommands } = micaCharUuids;
    let directionWord;
    switch (direction) {
      case 'forward':
        directionWord = 0x44;
        break;
      case 'backward':
        directionWord = 0x55;
        break;
      case 'left':
        directionWord = 0x45;
        break;
      case 'right':
        directionWord = 0x54;
        break;
      default:
        directionWord = 0x00;
    }
    const data = [0x05, 0x01, 0x01, directionWord, 0xff, 0xff, 0x00, 0x00];
    writeCharacteristic(deviceId, communicationCommands, data);
    console.log('clickedDrivebot', direction, deviceId);
  }

  onMouseUp(): void {
    const { deviceId } = this.props;
    /* Get the characteristic UUID */
    const { communicationCommands } = micaCharUuids;
    /* Needs to be refactored to be dynamic */
    const data = [0x05, 0x01, 0x01, 0x00, 0xff, 0xff, 0x00, 0x00];
    writeCharacteristic(deviceId, communicationCommands, data);
  }

  render() {
    return (
      <div>
        <Col md={12}>
          <span style={{ fontFamily: 'Abel', fontSize: '1.25em' }}>DRIVEBOT</span>
        </Col>
        <Row />
        <Col md={6}>
          <Col md={4} mdOffset={4}>
            <Button
              bsStyle={'primary'}
              onMouseDown={() => this.onMouseDown('forward')}
              onMouseUp={() => this.onMouseUp()}

            >
              <FA name={'arrow-up'} />
            </Button>
          </Col>
          <Row style={{ marginBottom: '4px' }} />
          <Col md={4} mdOffset={0}>
            <Button
              bsStyle={'primary'}
              onMouseDown={() => this.onMouseDown('left')}
              onMouseUp={() => this.onMouseUp()}
            >
              <FA name={'arrow-left'} />
            </Button>
          </Col>
          <Col md={4} mdOffset={0}>
            <Button
              bsStyle={'primary'}
              onMouseDown={() => this.onMouseDown('backward')}
              onMouseUp={() => this.onMouseUp()}
            >
              <FA name={'arrow-down'} />
            </Button>
          </Col>
          <Col md={4} mdOffset={0}>
            <Button
              bsStyle={'primary'}
              onMouseDown={() => this.onMouseDown('right')}
              onMouseUp={() => this.onMouseUp()}
            >
              <FA name={'arrow-right'} />
            </Button>
          </Col>
        </Col>
        <Col md={5}>
          <Col md={12} >
            <Button
              bsStyle={'primary'}
              block
            >+ SPEED
            </Button>
          </Col>
          <Row style={{ marginBottom: '4px' }} />
          <Col md={12} >
            <Button
              bsStyle={'primary'}
              block
            >- SPEED
            </Button>
          </Col>
        </Col>
      </div>
    );
  }
}
/* [] - END OF FILE */
