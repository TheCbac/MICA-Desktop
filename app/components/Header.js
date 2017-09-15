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
**********************************************************/
import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

export default class Header extends Component {
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
            <IndexLinkContainer to="/" activeClassName="active">
              <NavItem>DEVICES</NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/sengen" activeClassName="active">
              <NavItem>SETTINGS</NavItem>
            </LinkContainer>
            <LinkContainer to="/collectData" activeClassName="active">
              <NavItem>COLLECT</NavItem>
            </LinkContainer>
            <LinkContainer to="/analyze" activeClassName="active">
              <NavItem>ANALYZE</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
