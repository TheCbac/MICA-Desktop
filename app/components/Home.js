// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styles from './Home.css';



export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Button bsStyle="primary">Primary</Button>
          <Link to="/collectData">CollectData</Link>
          <p>
            <Link to="/">HOME</Link>
          </p>
          TEST
        </div>
      </div>
    );
  }
}
