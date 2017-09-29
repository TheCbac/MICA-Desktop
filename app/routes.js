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
import DevicesContainer from './containers/DevicesContainer';
import CollectDataContainer from './containers/CollectDataContainer';
import AnalysisContainer from './containers/AnalysisContainer';
import SettingsContainer from './containers/SettingsContainer';
import AppModalContainer from './containers/AppModalContainer';

export default () => (
  <Router history={hashHistory}>
    <App>
      <AppModalContainer />
      <Switch>
        <Route path="/collectData" component={CollectDataContainer} />
        <Route path="/settings" component={SettingsContainer} />
        <Route path="/analyze" component={AnalysisContainer} />
        <Route path="/" component={DevicesContainer} />
      </Switch>
    </App>
  </Router>
);

/* GW - <Route path="/" component={DevicesPage} must be last in the Route order
 or else the tabs will not work correctly. */

/* [] - END OF FILE */
