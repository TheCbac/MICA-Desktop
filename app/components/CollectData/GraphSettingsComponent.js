
/* @flow */
/* **********************************************************
* File: components/CollectData/GraphSettingsComponent.js
*
* Brief: Settings and controls for the graph on the Collect
*   tab
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row, ButtonToolbar, Button } from 'react-bootstrap';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';

export default class GraphSettings extends Component {

  render() {
    const boxStyle = {
      marginBottom: '20px',
      backgroundColor: '#E0E5E8',
      minHeight: '240px',
      fontFamily: 'Abel'
    };

    return (
      <div style={boxStyle}>
        <div className={'text-center'} style={{ fontSize: '1.5em' }}>Graphs</div>
        <Row style={{ marginTop: '10px' }} />
        <Col md={6}>
          <span style={{ fontSize: '1.25em' }}>Horizontal Scale</span>
        </Col>
        <Col md={6} style={{ paddingLeft: '0px' }}>
          <ButtonToolbar>
            <ToggleButtonGroup
              bsSize="xsmall"
              type={'radio'}
              name={'graphScale'}
              defaultValue={[1]}
            >
              <ToggleButton value={0.5}>½</ToggleButton>
              <ToggleButton value={1}>1</ToggleButton>
              <ToggleButton value={2}>2</ToggleButton>
              <ToggleButton value={5}>5</ToggleButton>
              <ToggleButton value={10}>10</ToggleButton>
            </ToggleButtonGroup>
            <span style={{ marginLeft: '5px' }}> s/div</span>
          </ButtonToolbar>
        </Col>
        <Row />
        <Col xs={12} className={'text-center'} style={{ marginTop: '10px' }}>
          <Button block bsStyle="success">START COLLECTION</Button>
        </Col>
        <Row />
        <Col xs={6} className={'text-center'} style={{ marginTop: '10px' }}>
          <Button block bsStyle="warning">PAUSE DISPLAY</Button>
        </Col>
        <Col xs={6} className={'text-center'} style={{ marginTop: '10px' }}>
          <Button block bsStyle="primary">SAVE RUN</Button>
        </Col>
        <Row />
        <Col xs={12} style={{ position: 'absolute', bottom: '25px' }}>
          Last run saved in /tmp/mica/2017.8.24-1359.csv
        </Col>
      </div>
    );
  }
}

/* [] - END OF FILE */
