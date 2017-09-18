/* **********************************************************
* File: index.js
*
* Brief: Top level file for the application
*
* Author: Craig Cheney
*
* 2017.06.08 CC - Document created
*
********************************************************* */
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import './actions/nobleCallbackActions';

const store = configureStore();

ipcRenderer.on('message', (event, text) => {
  console.log('MESSAGE:', text);
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root') || document.createElement('div')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
    document.getElementById('root') || document.createElement('div')
    );
  });
}

export default store;

/* [] - END OF FILE */
