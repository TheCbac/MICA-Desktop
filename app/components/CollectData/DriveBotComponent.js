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

export default class DriveBot extends Component {

  render() {
    return (
      <div>
        <Col md={6}>
          <Col md={4} mdOffset={4}>
            <Button bsStyle={'primary'}><FA name={'arrow-up'} /></Button>
          </Col>
          <Row style={{ marginBottom: '4px' }} />
          <Col md={4} mdOffset={0}>
            <Button bsStyle={'primary'}><FA name={'arrow-left'} /></Button>
          </Col>
          <Col md={4} mdOffset={0}>
            <Button bsStyle={'primary'}><FA name={'arrow-down'} /></Button>
          </Col>
          <Col md={4} mdOffset={0}>
            <Button bsStyle={'primary'}><FA name={'arrow-right'} /></Button>
          </Col>
        </Col>
        <Col md={5}>
          <Col md={12} >
            <Button bsStyle={'primary'} block>+ SPEED</Button>
          </Col>
          <Row style={{ marginBottom: '4px' }} />
          <Col md={12} >
            <Button bsStyle={'primary'} block>- SPEED</Button>
          </Col>
        </Col>
      </div>
    );
  }
}
/* [] - END OF FILE */
