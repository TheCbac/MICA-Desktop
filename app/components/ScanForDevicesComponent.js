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
import type { scanTypes, noblePeripheralType } from '../types/paramTypes';
import type { changeScanActionType } from '../types/actionTypes';

type methodBtnStyleType = 'success' | 'danger' | 'default';
type scanBtnStyleType = {
  color: 'primary' | 'danger',
  text: 'Start' | 'Stop'
};

// type advertisingDeviceType = {
//   name: string,
//   id: string
// };

// type advertisingListType = Array<advertisingDeviceType>;

export default class ScanForDevices extends Component {
  /* Properties, checked with flow */
  props: {
      method: scanTypes,
      enabled: boolean,
      scanning: boolean,
      changeScanMethod: (scanTypes) => changeScanActionType,
      startStopScan: () => mixed,
      advertisingDevices: noblePeripheralType[],
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
  /* Render function */
  render() {
    const {
      changeScanMethod,
      scanning,
      enabled,
      startStopScan,
      advertisingDevices,
    } = this.props;
    const scanBtnStyle = { marginLeft: '20px' };
    /* Spin when scanning */
    const spinner = scanning ? <FontAwesome name={'spinner'} spin /> : null;
    /* React Table */
    const tableStyle = {
      marginTop: '20px',
      backgroundColor: 'white',
      borderRadius: '5px',
      border: '0px',
      cursor: 'pointer',
      textAlign: 'center'
    };
    // const data = [{
    //   name: 'Cube5',
    //   id: '111123214321432',
    // }, {
    //   name: 'Cube5',
    //   id: '1111232143214dsfasd2',
    // }, {
    //   name: 'Cube7',
    //   id: 'dslfadkflsamfdsa',
    // }, {
    //   name: 'Cube8',
    //   id: 'asdaass232342423',
    // }];
    const advertisingColumns = [{
      Header: 'Advertising Device',
      accessor: 'advertisement.localName',
    }, {
      Header: 'ID',
      accessor: 'id',
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
            <Row />
            <ReactTable
              name={'advertisingTable'}
              data={advertisingDevices}
              // data={data}   // testing only
              columns={advertisingColumns}
              minRows={3}
              noDataText={'No devices found'}
              showPagination={false}
              className={'-striped -highlight'}
              style={tableStyle}
              getTdProps={(state, rowInfo) => ({
                onClick: () => {
                  console.log('Click row: ', rowInfo);
                }
              })
            }
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

/* [] - END OF FILE */
