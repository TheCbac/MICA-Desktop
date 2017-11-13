/* **********************************************************
* File: index.js
*
* Brief: Top level file for the application
*
* Author: Craig Cheney
*
* 2017.09.18 CC - Added IPC events
* 2017.06.08 CC - Document modified from boilerplate
*
********************************************************* */
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { updatePending } from './actions/appWideActions';
import './app.global.css';

const store = configureStore();

/*  CC - I'm not sure the IPC actions make sense here.. */
/* Receive messages from the main process */
ipcRenderer.on('message', (event, text): void => {
  console.log('MESSAGE:', text);
});

/* Receive notifications from the main process */
ipcRenderer.on('updateAvailable', (event, version: string): void => {
  store.dispatch(updatePending(version));
});

document.ondrop = (event) => {
  event.preventDefault();
};

document.ondragover = (event) => {
  event.preventDefault();
};

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
