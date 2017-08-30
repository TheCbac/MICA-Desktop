// @flow
/* **********************************************************
* File: components/ScanForDevicesComponent.js
*
* Brief: Component for starting scan, and choosing scan
*     method.
*
* Author: Craig Cheney
* Date: 2017.04.27
*
**********************************************************/
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { ButtonGroup, Button, Grid, Col, Row } from 'react-bootstrap';
import ReactTable from 'react-table';
import { getPeripheralFromList } from '../utils/deviceUtils';
import type { scanTypes, noblePeripheralType, nobleIdType } from '../types/paramTypes';
import type { changeScanActionType } from '../types/actionTypes';

type methodBtnStyleType = 'success' | 'danger' | 'default';
type scanBtnStyleType = {
  color: 'primary' | 'danger',
  text: 'Start' | 'Stop'
};
type connectBtnTextType =
  'CONNECT' | 'CONNECTING...' | 'DISCONNECT' | 'DISCONNECTING...' | 'State Unknown';
type connectBtnColorType = 'warning' | 'default';
type connectBtnSettingsType = {
  text: connectBtnTextType,
  color: connectBtnColorType,
  style: {color: 'white' | 'black'}
};
type deviceListType = 'advertising' | 'connecting' | 'connected' | 'disconnecting';

export default class ScanForDevices extends Component {
  /* Properties, checked with flow */
  props: {
      method: scanTypes,
      enabled: boolean,
      scanning: boolean,
      changeScanMethod: (scanTypes) => changeScanActionType,
      startStopScan: () => mixed,
      advertisingDevices: noblePeripheralType[],
      connectingDevices: noblePeripheralType[],
      connectedDevices: noblePeripheralType[],
      disconnectingDevices: noblePeripheralType[],
      connectToDevice: () => mixed,
      cancelPendingConnection: () => mixed,
      disconnectFromDevice: () => mixed
    };
  /* Returns the color for the button */
  getColor(name: scanTypes): methodBtnStyleType {
    /* Act for the active method */
    if (name === this.props.method) {
      return this.props.enabled ? 'success' : 'danger';
    }
    return 'default';
  }
  /* Sets the active state */
  isActive(name: scanTypes): boolean {
    if (name === this.props.method) {
      return true;
    }
    return false;
  }
  /* Determines whether or not a scan is enabled */
  getScanState(): scanBtnStyleType {
    if (this.props.scanning) {
      return { color: 'danger', text: 'Stop' };
    }
    return { color: 'primary', text: 'Start' };
  }

  /* Determine which list the device is in */
  determineDeviceState(id: nobleIdType): ?deviceListType {
    if (getPeripheralFromList(this.props.advertisingDevices, id).index != null) {
      return 'advertising';
    } else if (getPeripheralFromList(this.props.connectedDevices, id).index != null) {
      return 'connected';
    } else if (getPeripheralFromList(this.props.connectingDevices, id).index != null) {
      return 'connecting';
    } else if (getPeripheralFromList(this.props.disconnectingDevices, id).index != null) {
      return 'disconnecting';
    }
    return null;
  }
  /* Find which list the device is in */
  getConnectBtnSettings(id: nobleIdType): connectBtnSettingsType {
    const glow = {
      color: 'white',
      textShadow: 'white 0 0 15px'
    };
    const dull = {
      color: 'black'
    };
    /* Find the current state of the device */
    const deviceState = this.determineDeviceState(id);
    /* Act depending on the state */
    switch (deviceState) {
      case 'advertising': {
        return { text: 'CONNECT', color: 'warning', style: dull };
      }
      case 'connecting': {
        return { text: 'CONNECTING...', color: 'warning', style: dull };
      }
      case 'connected': {
        return { text: 'DISCONNECT', color: 'warning', style: glow };
      }
      case 'disconnecting': {
        return { text: 'DISCONNECTING...', color: 'warning', style: dull };
      }
      default: {
        return { text: 'State Unknown', color: 'warning', style: dull };
      }
    }
  }
  /* Perform a device action based on the current state */
  performDeviceAction(id: nobleIdType): void {
    /* Find the current state of the device */
    const deviceState = this.determineDeviceState(id);
    /* Act depending on the state */
    if (deviceState === 'advertising') {
      this.props.connectToDevice(id);
    } else if (deviceState === 'connected') {
      this.props.disconnectFromDevice(id);
    } else if (deviceState === 'connecting') {
      this.props.cancelPendingConnection(id);
    }
  }
  /* Render function */
  render() {
    const {
      changeScanMethod,
      scanning,
      enabled,
      startStopScan,
      advertisingDevices,
      connectingDevices,
      connectedDevices,
      disconnectingDevices
    } = this.props;
    const scanBtnStyle = { marginLeft: '20px' };
    /* Spin when scanning */
    const spinner = scanning ? <FontAwesome name={'spinner'} pulse /> : null;
    /* React Table */
    const tableStyle = {
      marginTop: '20px',
      backgroundColor: '#D2D3C9',
      borderRadius: '5px',
      border: '0px',
      textAlign: 'center'
    };
    /* Data table */
    const advertisingColumns = [{
      Header: 'Name',
      accessor: 'advertisement.localName',
      Cell: row => (
        <div style={this.getConnectBtnSettings(row.original.id).style}>
          {row.value.toUpperCase()}
        </div>
      )
    }, {
      Header: 'Address',
      accessor: 'address',
      Cell: row => (
        <div style={this.getConnectBtnSettings(row.original.id).style}>
          {row.value.toUpperCase()}
        </div>
      )
    }, {
      Header: 'Signal Strength',
      accessor: 'rssi',
      Cell: row => (
        <div style={this.getConnectBtnSettings(row.original.id).style}>
          {`${row.value} dB`}
        </div>
      )
    }, {
      Header: 'Actions',
      Cell: row => (
        <div>
          <Button
            onClick={() => this.performDeviceAction(row.original.id)}
            bsStyle={this.getConnectBtnSettings(row.original.id).color}
            style={this.getConnectBtnSettings(row.original.id).style}
          >{this.getConnectBtnSettings(row.original.id).text}</Button>
        </div>
      )
    }];
    return (
      <Grid fluid>
        <Row>
          <Col md={4} mdOffset={1}>
            <ButtonGroup>
              <Button
                name={'bleMethodBtn'}
                active={this.isActive('ble')}
                bsStyle={this.getColor('ble')}
                onClick={() => changeScanMethod('ble')}
              >BLE</Button>
              <Button
                name={'usbMethodBtn'}
                active={this.isActive('usb')}
                bsStyle={this.getColor('usb')}
                onClick={() => changeScanMethod('usb')}
              >USB</Button>
            </ButtonGroup>
            <ButtonGroup >
              <Button
                name={'scanBtn'}
                style={scanBtnStyle}
                bsStyle={this.getScanState().color}
                disabled={!enabled}
                onClick={() => startStopScan()}
              >{this.getScanState().text} Scan {spinner}</Button>
            </ButtonGroup>
          </Col>
          <Row />
          <Col md={10} mdOffset={1}>
            <ReactTable
              name={'advertisingTable'}
              data={advertisingDevices.concat(
                connectingDevices,
                connectedDevices,
                disconnectingDevices
              )}
              columns={advertisingColumns}
              minRows={3}
              noDataText={'No devices found'}
              showPagination={false}
              className={'-striped -highlight'}
              style={tableStyle}
              sortable
              defaultSorted={[{
                id: 'advertisement.localName',
                desc: false
              }]}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

/* [] - END OF FILE */
