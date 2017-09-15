/* **********************************************************
* File: e2e.spec.js
*
* Brief: Contains the End to End specifications for testing
*   the mica Application.
*
* Author: Craig Cheney
* Date: 2017.04.26
*
**********************************************************/
import { Application } from 'spectron';
import electronPath from 'electron';
import path from 'path';
/* Set default timeout */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
/* Create an async delay */
const delay = time => new Promise(resolve => setTimeout(resolve, time));
describe('main window', function spec() {
  /* Open a new electron window */
  beforeAll(async () => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..', '..', 'app')],
    });
    return this.app.start();
  });
  /* Close the window when done */
  afterAll(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('should open a window', async () => {
    const { client, browserWindow } = this.app;

    await client.waitUntilWindowLoaded();
    await delay(500);
    const title = await browserWindow.getTitle();
    expect(title).toBe('Hello Electron React!');
  });

  it('should haven\'t any logs in console of main window', async () => {
    const { client } = this.app;
    const logs = await client.getRenderProcessLogs();
    // Print renderer process logs
    logs.forEach(log => {
      console.log(log.message);
      console.log(log.source);
      console.log(log.level);
    });
    expect(logs).toHaveLength(0);
  });
  it('should default to \'/\'', async () => {
    const { client } = this.app;
    const route = await client.getUrl();
    expect(route).toBe('HomePage');
  });
});
