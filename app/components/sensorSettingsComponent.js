// @flow
/* **********************************************************
* File: sensorSettingsComponent.js
*
* Brief: React component for changing settings on sensors
*
* Authors: Craig Cheney
*
* 2017.08.30 CC - Document created
*
**********************************************************/
import React, { Component } from 'react';
import { Grid, Col, Row, Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import CustomToggle from './customToggle';
import CustomMenu from './customMenu';


export default class sensorSettings extends Component {
  /* Component properties */
  props: {
    active: {
      generator: ?string,
      sensor: ?string
    }
  };
  /* Get the active device */
  activeDevice(type: 'sensor' | 'generator'): {text: string, style: {fontStyle: string}} {
    const device = this.props.active[type];
    let text = 'NO DEVICES';
    let style = 'italic';
    /* If the device is present */
    if (device) {
      text = device;
      style = 'normal';
    }
    return {
      text: text.toUpperCase(),
      style: { fontStyle: style }
    };
  }
  /* Render function */
  render() {
    const sensorBoxStyle = {
      backgroundColor: '#D0E1D0',
      minHeight: '400px',
    };
    const headerTextStyle = {
      fontSize: '1.5em',
      fontFamily: 'Franklin Gothic Book',
      marginTop: '15px',
      color: '#7C7C7C'
    };
    const toggleStyle = {
      fontFamily: 'Franklin Gothic Book',
      color: '#7C7C7C'
    };
    const upStyle = {
      fontSize: '12px',
      marginTop: '-8px',
      marginLeft: '-8px'
    };
    const downStyle = {
      fontSize: '12px',
      marginTop: '2px',
      marginLeft: '-8px'
    };
    const dropdownStyle = {
      marginTop: '-4px',
      marginRight: '-30px'
    };
    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <Col md={12} mdOffset={0} style={sensorBoxStyle}>
              <Col md={6} style={headerTextStyle}>
                <span className="pull-left" >SENSORS</span>
              </Col>
              <Col md={6} style={headerTextStyle}>
                <div className="pull-right">
                  <Dropdown id="dropdown-custom-menu" style={dropdownStyle}>
                    <CustomToggle bsRole="toggle" >
                      <span style={this.activeDevice('sensor').style}>{this.activeDevice('sensor').text}</span>
                      <span className="fa-stack">
                        <FontAwesome style={upStyle} stack={'1x'} name={'chevron-up'} size={'lg'} />
                        <FontAwesome style={downStyle} stack={'1x'} name={'chevron-down'} size={'lg'} />
                      </span>
                    </CustomToggle>

                    <CustomMenu bsRole="menu">
                      <MenuItem eventKey="1">Red</MenuItem>
                      <MenuItem eventKey="2">Blue</MenuItem>
                      <MenuItem eventKey="3" active>Orange</MenuItem>
                      <MenuItem eventKey="1">Red-Orange</MenuItem>
                    </CustomMenu>
                  </Dropdown>
                </div>
              </Col>
            </Col>
          </Col>
          <Col md={6}>
            <Col md={12} mdOffset={0} style={sensorBoxStyle}>
              <Col md={6} style={headerTextStyle}>
                <span className="pull-left" >GENERATORS</span>
              </Col>
              <Col md={6} style={headerTextStyle}>
                <div className="pull-right">
                  <Dropdown id="dropdown-custom-menu" style={dropdownStyle}>
                    <CustomToggle bsRole="toggle" >
                      <span style={this.activeDevice('generator').style}>{this.activeDevice('generator').text}</span>
                      <span className="fa-stack">
                        <FontAwesome style={upStyle} stack={'1x'} name={'chevron-up'} size={'lg'} />
                        <FontAwesome style={downStyle} stack={'1x'} name={'chevron-down'} size={'lg'} />
                      </span>
                    </CustomToggle>

                    <CustomMenu bsRole="menu">
                      <MenuItem eventKey="1">Red</MenuItem>
                      <MenuItem eventKey="2">Blue</MenuItem>
                      <MenuItem eventKey="3" active>Orange</MenuItem>
                      <MenuItem eventKey="1">Red-Orange</MenuItem>
                    </CustomMenu>
                  </Dropdown>
                </div>
              </Col>
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}
/* [] - END OF FILE */
