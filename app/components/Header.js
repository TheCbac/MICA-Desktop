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
import { showUserSettings } from '../actions/appWideActions';
import store from '../index';

type propsT = {
  developer: boolean
};

export default class Header extends Component {
  props: propsT;

  developerState() {
    if (this.props.developer) {
      return (
        <LinkContainer to="/developer" activeClassName="active">
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
            <IndexLinkContainer to="/" activeClassName="active">
              <NavItem>DEVICES</NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/settings" activeClassName="active">
              <NavItem>SETTINGS</NavItem>
            </LinkContainer>
            <LinkContainer to="/collectData" activeClassName="active">
              <NavItem>COLLECT</NavItem>
            </LinkContainer>
            {this.developerState()}
            {/* <LinkContainer to="/analyze" activeClassName="active">
              <NavItem>ANALYZE</NavItem>
            </LinkContainer> */}
          </Nav>
          <Nav pullRight>
            <NavItem onClick={() => { store.dispatch(showUserSettings(true)); }}><FontAwesome name="bars" size="lg" /></NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
