/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route, hashHistory } from 'react-router';
import App from './containers/App';
import DevicesPage from './containers/DevicesPage';
import CollectDataPage from './containers/CollectDataPage';
import AnalysisPage from './containers/AnalysisPage';
import SenGenPage from './containers/SenGenPage';

export default () => (
  <Router history={hashHistory}>
    <App>
      <Switch>
        <Route path="/collectData" component={CollectDataPage} />
        <Route path="/sengen" component={SenGenPage} /* onEnter={}*/ />
        <Route path="/analyze" component={AnalysisPage} />
        <Route path="/" component={DevicesPage} />
      </Switch>
    </App>
  </Router>
);

// <Route path="/" component={DevicesPage} must be last in the Route order
// or else the tabs will not work correctly.

/* [] - END OF FILE */
