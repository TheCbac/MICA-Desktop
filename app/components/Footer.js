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

export const footerStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  color: '#9d9d9d',
  backgroundColor: '#222',
  height: '25px',
  textAlign: 'center'
};
export const mitLogoStyle = {
  height: '20px'
};
export const bilabLogoStyle = {
  height: '20px'
};
export default class Footer extends Component {
  render() {
    return (
      <Grid className="Footer" style={footerStyle} fluid>
        <Row>
          <Col xs={4}><img src="../img/mitLogo.png" style={mitLogoStyle} alt="MICA" /></Col>
          <Col xs={4}>Craig Cheney &copy; 2017</Col>
          <Col xs={4}><img src="../img/bilabLogo_white.png" style={bilabLogoStyle} alt="BioInstrumentation Lab" /></Col>
        </Row>
      </Grid>
    );
  }
}
