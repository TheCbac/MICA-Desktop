// @flow
/* **********************************************************
* File: homePage.js
*
* Brief: Container for the Devices page
*
* Author: Craig Cheney
* Date: 2017.04.27
*
**********************************************************/
import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import Noble from 'noble';
import ScanForDevices from '../components/ScanForDevices';


export default class HomePage extends Component {
  constructor() {
    super();
    console.log(Noble.state);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col md={4} mdOffset={1}>
            <ScanForDevices />
          </Col>
        </Row>
      </Grid>
    );
  }
}
