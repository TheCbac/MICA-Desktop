/* @flow */
/* **********************************************************
* File: components/Developer/OtaUpdate.js
*
* Brief: Component for managing over the air updates for a
* a MICA Cube
*
* Authors: Craig Cheney
*
* 2017.10.22 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import {
  Col, Row, FormGroup, ControlLabel,
  FormControl, Button, ButtonToolbar
} from 'react-bootstrap';

export default class OtaUpdate extends Component {

  render() {
    const nameStyle = {
      backgroundColor: '#E0E5E8',
      paddingBottom: '10px',
      border: '2px solid #6c6d6d',
      borderRadius: '10px'
    };
    const titleStyle = {
      color: '#6845a6',
      borderBottom: '1px solid black'
    };

    return (
      <Col md={6} style={nameStyle}>
        <Col md={10} mdOffset={1} style={titleStyle} className="text-center">
          <h4>UPDATE DEVICE FIRMWARE</h4>
        </Col>
        <Row />
        <Col md={8} mdOffset={2} style={{ marginTop: '5px' }}>
          <FormGroup controlId="formDeviceName">
            <ControlLabel>DEVICE</ControlLabel>
            <FormControl componentClass="select" onChange={this.handleSelection}>
              {this.getDeviceSelection()}
            </FormControl>
          </FormGroup>
        </Col>
        <Row />
        <Col md={8} mdOffset={2}>
          <FormGroup controlId="formChangeName" validationState={this.nameValidation()}>
            <ControlLabel>NEW NAME</ControlLabel>
            <FormControl onChange={this.handleName} componentClass="textarea" placeholder="NAME" />
          </FormGroup>
        </Col>
        <Row />
        <Col md={4} mdOffset={2}>
          <ButtonToolbar>
            <Button
              disabled={this.submitDisabled()}
              bsStyle="primary"
              onClick={this.changeName}
            >UPDATE DEVICE</Button>
          </ButtonToolbar>
        </Col>
      </Col>
    );
  }

}

/* [] - END OF FILE */
