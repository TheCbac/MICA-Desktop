// @flow
/* **********************************************************
* File: components/Devices/DevicesTable.js
*
* Brief: Component that displays all MICA devices
*
* Author: Craig Cheney
*
* 2017.09.25 CC - Document Created (refactored from DevicesPage.js)
*
********************************************************* */
import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import update from 'immutability-helper';
import type { devicesStateType } from '../../types/stateTypes';
import type { idType } from '../../types/paramTypes';
import type { thunkType } from '../../types/functionTypes';


/* Component Property Types */
type propTypes = {
  /* Variables */
  devices: devicesStateType,
  /* Functions */
  connectToDevice: (deviceId: idType) => thunkType,
  cancelPendingConnection: (deviceId: idType) => thunkType,
  disconnectFromDevice: (deviceId: idType) => thunkType
};
/* Text for the buttons */
type connectBtnTextType =
'CONNECT' | 'CONNECTING...' | 'DISCONNECT' | 'DISCONNECTING...' | 'State Unknown';
/* Style of the connect button */
type connectBtnStyleType = {
  text: connectBtnTextType,
  color: string
};

export default class DevicesTable extends Component<propTypes, $FlowFixMeState> {
  /* Convert the Devices to an array */
  devicesToArray() {
    const deviceList = [];
    /* Iterate through each device in the state */
    const deviceIdList = Object.keys(this.props.devices);
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = this.props.devices[deviceId];
      if (device.state !== 'disconnected') {
        /* Create a copy and add the ID to the object */
        const newDevice = update(this.props.devices[deviceId], {
          id: { $set: deviceId }
        });
        /* Push to the list */
        deviceList.push(newDevice);
      }
    }
    return deviceList;
  }
  /* Glow if connected */
  getGlowStyle(id: idType): { color: string } {
    /* Style of the glowing */
    const glow = {
      color: 'white',
      textShadow: 'white 0 0 15px'
    };
    const dull = { color: 'black' };
    /* See if the device is connected */
    if (this.props.devices[id].state === 'connected') {
      return glow;
    }
    return dull;
  }
  /* Color of the Button */
  getDeviceBtnStyle(id: idType): connectBtnStyleType {
    /* Get the state */
    switch (this.props.devices[id].state) {
      case 'advertising':
        return { text: 'CONNECT', color: 'warning' };
      case 'connecting':
        return { text: 'CONNECTING...', color: 'warning' };
      case 'connected':
        return { text: 'DISCONNECT', color: 'warning' };
      case 'disconnecting':
        return { text: 'DISCONNECTING...', color: 'warning' };
      default:
        return { text: 'State Unknown', color: 'warning' };
    }
  }
  /* Perform a device action based on the current state */
  performDeviceAction(id: idType): void {
    /* Find the current state of the device */
    const deviceState = this.props.devices[id].state;
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
    /* React Table */
    const tableStyle = {
      marginTop: '20px',
      backgroundColor: '#D2D3C9',
      borderRadius: '5px',
      border: '0px',
      textAlign: 'center'
    };
    /* Data table */
    const devicesTableCols = [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: row => (
          <div style={this.getGlowStyle(row.original.id)}>
            {row.value.toUpperCase()}
          </div>
        )
      },
      {
        Header: 'Address',
        accessor: 'address',
        Cell: row => (
          <div style={this.getGlowStyle(row.original.id)}>
            {row.value.toUpperCase()}
          </div>
        )
      },
      {
        Header: 'Signal Strength',
        accessor: 'rssi',
        Cell: row => (
          <div style={this.getGlowStyle(row.original.id)}>
            {`${row.value} dB`}
          </div>
        )
      },
      {
        Header: 'Actions',
        accessor: 'state',
        Cell: row => {
          /* Get the color and text for the next state */
          const { color, text } = this.getDeviceBtnStyle(row.original.id);
          return (
            <div>
              <Button
                onClick={() => this.performDeviceAction(row.original.id)}
                bsStyle={color}
                style={this.getGlowStyle(row.original.id)}
              >{text}</Button>
            </div>
          );
        }
      }
    ];

    return (
      <div>
        <ReactTable
          name={'advertisingTable'}
          data={this.devicesToArray()}
          columns={devicesTableCols}
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
      </div>
    );
  }
}
/* [] - END OF FILE */
