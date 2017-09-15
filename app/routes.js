<<<<<<< HEAD
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
=======
/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';

export default () => (
  <App>
    <Switch>
      <Route path="/counter" component={CounterPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
>>>>>>> b76f537bc784d1102b13675297d54bd28baff9d8
