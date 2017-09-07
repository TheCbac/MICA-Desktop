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
import { Grid, Col, Row, Dropdown, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import type { Element } from 'react';
import CustomToggle from './customToggle';
import CustomMenu from './customMenu';
import log from '../utils/loggingUtils';
// import { getSelectedDevices } from '../actions/senGenActions';
import SenGen from './senGenComponent';
import sensorParams from '../utils/mica/micaSensorParams';
import generatorParams from '../utils/mica/micaGeneratorParams';
import type { metadataType } from '../types/stateTypes';

/* Props used in component */
type propsType = {
  selected: {
    generator: ?string,
    sensor: ?string
  },
  unselected: {
    generators: string[],
    sensors: string[]
  },
  getSelectedDevices: () => mixed,
  setSelectedDevices: () => mixed,
  metadata: metadataType
};

export default class sensorSettings extends Component {
  /* Component properties */
  props: propsType;
  state: {
    open: boolean
  };
  constructor(props: propsType) {
    super(props);
    /* Trigger the selected devices to occur */
    props.getSelectedDevices();
    this.state = {
      open: false
    };
  }
  /* Get the selected device */
  selectedDevice(type: 'sensor' | 'generator'): {text: string, style: {fontStyle: string}} {
    const device = this.props.selected[type];
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
  /* Unselected devices */
  unselectedDevices(type: 'sensors' | 'generators'): *[] {
    const deviceStyle = {
      fontFamily: 'Franklin Gothic Book',
      color: '#7C7C7C',
      textDecoration: 'none',
      fontStyle: 'normal'
    };
    const array = [];
    /* iterate over devices */
    const len = this.props.unselected[type].length;
    if (len) {
      for (let i = 0; i < len; i += 1) {
        const name = this.props.unselected[type][i];
        /* Create the element - should this be a new component? */
        const element = (<MenuItem
          style={deviceStyle}
          onClick={(e) => {
            e.preventDefault();
            this.props.setSelectedDevices(type, name);
          }}
          key={i}
        >{name}</MenuItem>);
        /* Populate the array */
        array.push(element);
      }
    } else {
      deviceStyle.fontStyle = 'italic';
      array.push(<MenuItem style={deviceStyle} key="none">NO OTHER DEVICES</MenuItem>);
    }

    return array;
  }
  /* Get the sensor and generators from the selected device */
  getSenGen(type: 'sensing' | 'actuation', name: ?string): [] {
    const transducerArray = [];
    let device;
    /* Get the device */
    if (name) { device = this.props.metadata[name]; }
    if (device) {
      const senGenList = device[type];
      const numSenGen = senGenList.length;
      /* Iterate through all of the sensors */
      for (let i = 0; i < numSenGen; i += 1) {
        /* Get the transducer in question */
        const transducer = senGenList[i];
        /* Make the react component */
        let transducerComponent;
        if (type === 'sensing') {
          transducerComponent = (
            <SenGen name={transducer.type} key={i} active params={sensorParams[transducer.id]} />
          );
        } else if (type === 'actuation') {
          transducerComponent = (<div />);
            // <SenGen name={transducer.type} active params={generatorParams[transducer.id]} />
        }
        transducerArray.push(transducerComponent);
      }
    }
    return transducerArray;
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
      color: '#7C7C7C',
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
                      <span style={this.selectedDevice('sensor').style}>{this.selectedDevice('sensor').text}</span>
                      <span className="fa-stack">
                        <FontAwesome style={upStyle} stack={'1x'} name={'chevron-up'} size={'lg'} />
                        <FontAwesome style={downStyle} stack={'1x'} name={'chevron-down'} size={'lg'} />
                      </span>
                    </CustomToggle>

                    <CustomMenu bsRole="menu">
                      {this.unselectedDevices('sensors')}
                    </CustomMenu>
                  </Dropdown>
                </div>
              </Col>
              { this.getSenGen('sensing', this.props.selected.sensor) }
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
                      <span style={this.selectedDevice('generator').style}>{this.selectedDevice('generator').text}</span>
                      <span className="fa-stack">
                        <FontAwesome style={upStyle} stack={'1x'} name={'chevron-up'} size={'lg'} />
                        <FontAwesome style={downStyle} stack={'1x'} name={'chevron-down'} size={'lg'} />
                      </span>
                    </CustomToggle>

                    <CustomMenu bsRole="menu">
                      {this.unselectedDevices('generators')}
                    </CustomMenu>
                  </Dropdown>
                </div>
              </Col>
              { this.getSenGen('actuation', this.props.selected.generator) }
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}
/* [] - END OF FILE */
