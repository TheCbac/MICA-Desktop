// @flow
/* **********************************************************
* File: Footer.js
*
* Brief: The react footer component
*
* Authors: Craig Cheney, George Whitfield
*
* 2017.04.27 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';

let mitImagePath = '../resources/img/mitLogo.png';
/* Set mitImagePath to new path */
if (process.resourcesPath !== undefined) {
  mitImagePath = (`${String(process.resourcesPath)}resources/img/mitLogo.png`);
  // mitImagePath = `${process.resourcesPath}resources/img/mitLogo.png`;
}

// const nativeImage = require('electron').nativeImage;
// const mitLogoImage = nativeImage.createFromPath(mitImagePath);
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
export default class Footer extends Component<{}> {
  render() {
    return (
      <Grid className='Footer' style={footerStyle} fluid>
        <Row>
          <Col xs={4}><img src={'../resources/img/mitLogo.png' || mitImagePath} style={mitLogoStyle} alt='MICA' /></Col>
          <Col xs={4}>The MICA Group &copy; 2017</Col>
          <Col xs={4}><img src='../resources/img/bilabLogo_white.png' style={bilabLogoStyle} alt='BioInstrumentation Lab' /></Col>
        </Row>
      </Grid>
    );
  }
}

/* [] - END OF FILE */
