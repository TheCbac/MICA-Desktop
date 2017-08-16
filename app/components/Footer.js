// @flow
/* **********************************************************
* File: Footer.js
*
* Brief: The react footer component
*
* Author: Craig Cheney
* Date: 2017.04.27
*
**********************************************************/
import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { app } from 'electron';

const path = require('path');

const mitImagePath = path.join(process.resourcesPath, 'img/mitLogo.png');

const nativeImage = require('electron').nativeImage;

const mitLogoImage = nativeImage.createFromPath(mitImagePath);

const footerStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  color: '#9d9d9d',
  backgroundColor: '#222',
  height: '25px',
  textAlign: 'center'
};
const mitLogoStyle = {
  height: '20px'
};
const bilabLogoStyle = {
  height: '20px'
};
export default class Footer extends Component {
  render() {
    return (
      <Grid className="Footer" style={footerStyle} fluid>
        <Row>
          <Col xs={4}><img src={'./resources/img/mitLogo.png' || mitLogoImage} style={mitLogoStyle} alt="MICA" /></Col>
          <Col xs={4}>Craig Cheney &copy; 2017</Col>
          <Col xs={4}><img src={'./resources/img/bilabLogo_white.png'} style={bilabLogoStyle} alt="BioInstrumentation Lab" /></Col>
        </Row>
      </Grid>
    );
  }
}
