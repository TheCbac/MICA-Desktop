/* @flow */
/* **********************************************************
* File: Header.js
*
* Brief: React component for the header. Uses 'react-router-bootstrap'
*     to wrap around links to avoid errors.
*
* Author: Craig Cheney
* Date: 2017.04.27
*
********************************************************* */
import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import FontAwesome from 'react-fontawesome';
import type {
  showUserSettingsActionT
} from '../types/appWideActionTypes';

type propsT = {
  developer: boolean,
  showUserSettings: (boolean) => showUserSettingsActionT
};

export default class Header extends Component<propsT> {
  developerState() {
    if (this.props.developer) {
      return (
        <LinkContainer to='/developer' id='developerPageLink' activeClassName='active'>
          <NavItem>DEVELOPER</NavItem>
        </LinkContainer>
      );
    }
  }
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            MICA
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <IndexLinkContainer to='/' id='devicesPageLink' activeClassName='active'>
              <NavItem>DEVICES</NavItem>
            </IndexLinkContainer>
            <LinkContainer to='/settings' id='settingsPageLink' activeClassName='active'>
              <NavItem>SETTINGS</NavItem>
            </LinkContainer>
            <LinkContainer to='/collect' id='collectDataPageLink' activeClassName='active'>
              <NavItem>COLLECT</NavItem>
            </LinkContainer>
            {this.developerState()}
            {/* <LinkContainer to="/analyze" activeClassName="active">
              <NavItem>ANALYZE</NavItem>
            </LinkContainer> */}
          </Nav>
          <Nav pullRight>
            <NavItem
              id='userSettingsBars'
              onClick={() => { this.props.showUserSettings(true); }}
            >
              <FontAwesome name='bars' size='lg' />
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
