/* **********************************************************
* File: index.js
*
* Brief: Top level file for the application
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.06.08 CC - Document created
*
********************************************************* */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route, hashHistory } from 'react-router';
import App from './containers/App';
import DevicesPage from './containers/DevicesPage';
import CollectDataContainer from './containers/CollectDataContainer';
import AnalysisPage from './containers/AnalysisPage';
import SenGenPage from './containers/SenGenPage';


export default () => (
  <Router history={hashHistory}>
    <App>
      <Switch>
        <Route path="/collectData" component={CollectDataContainer} />
        <Route path="/sengen" component={SenGenPage} />
        <Route path="/analyze" component={AnalysisPage} />
        <Route path="/" component={DevicesPage} />
      </Switch>
    </App>
  </Router>
);

/* GW - <Route path="/" component={DevicesPage} must be last in the Route order
 or else the tabs will not work correctly. */

/* [] - END OF FILE */
