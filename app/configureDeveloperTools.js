// @flow
/* **********************************************************
* File: app/configureDeveloperTools.js 
*
* Brief: Disable developer tools window when app is in production mode
*
* Author: George Whitfield
* Date: 2017.08.010
*
**********************************************************/
import { webContents, app } from 'electron';
const remote = require('remote');
/* 'ready' = when the app is done initializing */
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    webContents.toggleDevTools();
    remote.getCurrentWindow().devTools = false;
  }
});
