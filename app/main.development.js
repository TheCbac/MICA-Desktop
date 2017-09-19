/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
/* eslint max-len: 0 */
// @flow
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import MenuBuilder from './menu';

const path = require('path');

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();

  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/* ************ Auto Update code ************ */
/* Send the status for logging to the window */
function sendStatusToWindow(text): void {
  if (mainWindow == null) { return; }
  mainWindow.webContents.send('message', text);
}
/* Alert the render process that an update is available */
function initiateUpdateProcess(version: string): void {
  if (mainWindow == null) { return; }
  sendStatusToWindow('Update available.');
  mainWindow.webContents.send('updateAvailable', version);
}
/* Main auto update */
autoUpdater.on('update-available', (updateInfo) => {
  sendStatusToWindow(updateInfo);
  initiateUpdateProcess(updateInfo.version);
});
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});
/* Additional auto-update events */
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-not-available', () => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater.');
  sendStatusToWindow(err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  sendStatusToWindow(logMessage);
});

/* App ready callback */
app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  /* Set the devTools in development mode */
  let tools = false;
  // let tools = true;
  if (process.env.NODE_ENV === 'development') {
    tools = true;
  }
  // Electron does not recognize when variable is set to development mode. It stays in production
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 475,
    minHeight: 475,
    webPreferences: {
      devTools: tools
    }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.openDevTools('detach');


  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  /* Check for updates */
  if (process.env.NODE_ENV === 'production') {
    /* Start the update process */
    autoUpdater.checkForUpdates();
    sendStatusToWindow('Begin Auto update');
  } else {
    setTimeout(() => {
      sendStatusToWindow('Skipping updates in development mode.');
      /* In Terminal */
      console.log('Skipping updates in development mode.');
      // initiateUpdateProcess('v1.2.3');
    }, 10000);
  }
});

