/* **********************************************************
* File: routes.js
*
* Brief: Maps file location to screen react component
*
* Authors: Craig Cheney, George Whitfield
*
* 2017.06.08 CC - Document created
*
********************************************************* */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route, hashHistory } from 'react-router';
import App from './containers/AppContainer';
import DevicesContainer from './containers/DevicesContainer';
import CollectDataContainer from './containers/CollectDataContainer';
import AnalysisContainer from './containers/AnalysisContainer';
import SettingsContainer from './containers/SettingsContainer';
import AppModalContainer from './containers/AppModalContainer';
import DeveloperContainer from './containers/DeveloperContainer';

export default () => (
  <Router history={hashHistory}>
    <App>
      <AppModalContainer />
      <Switch>
        <Route path="/collect" component={CollectDataContainer} />
        <Route path="/settings" component={SettingsContainer} />
        <Route path="/analyze" component={AnalysisContainer} />
        <Route path="/developer" component={DeveloperContainer} />
        <Route path="/" component={DevicesContainer} />
      </Switch>
    </App>
  </Router>
);

/* [] - END OF FILE */
