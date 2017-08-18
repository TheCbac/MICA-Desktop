/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route, hashHistory } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CollectDataPage from './containers/CollectDataPage';
import AnalysisPage from './containers/AnalysisPage';
import SenGenPage from './containers/SenGenPage';


export default () => (
  <Router history={hashHistory}>
    <App>
      <Switch>
        <Route path="/collectData" component={CollectDataPage} />
        <Route path="/sengen" component={SenGenPage} />
        <Route path="/analyze" component={AnalysisPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </App>
  </Router>
);

// <Route path="/" component={HomePage} must be last in the Route order
// or else the tabs will not work correctly.
