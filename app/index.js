/* **********************************************************
* File: index.js
*
* Brief: Top level file for the application
*
* Author: Craig Cheney
* Date: 2017.06.08
*
**********************************************************/
import React from 'react';
// import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import './actions/nobleCallbackActions';

const store = configureStore();

ReactDOM.render(
  <div id="root">
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>
  </div>,
  // document.getElementById('root')
  document.querySelector('body')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    ReactDOM.render(
      <div id="root">
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>
      </div>,
    //  document.getElementById('root')
    document.querySelector('body')
    );
  });
}

export default store;

/* [] - END OF FILE */
