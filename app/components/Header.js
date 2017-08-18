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
import { IndexLinkContainer } from 'react-router-bootstrap';

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
            <IndexLinkContainer to="/collectData" activeClassName="active">
              <NavItem>COLLECT DATA</NavItem>
            </IndexLinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
