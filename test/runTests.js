/* @flow */
/* **********************************************************
* File: test/jestSetup.js
*
* Brief: Sets up the Jest environment. Runs before each test
* suite. Passed as argument to runTest.js
*
* Authors: Craig Cheney
*
* 2017.11.06 CC - Document updated from boilerplate, adding
*   a test setup file and snapshot update support
*
********************************************************* */
const spawn = require('cross-spawn');
const path = require('path');

/* Chose end-to-end test or not */
const s = `\\${path.sep}`;
const pattern = process.argv[2] === 'e2e'
  ? `test${s}e2e${s}.+\\.spec\\.js`
  : `test${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;
/* Jest config file */
const setupFile = path.resolve('test/jestSetup.js');
const setupArg = `--setupTestFrameworkScriptFile=${setupFile}`;

/* Create the arguments for the command */
const jestPath = path.normalize('./node_modules/.bin/jest');
let jestArgs = [pattern, setupArg];

/* Update Snapshot */
if (process.argv[2] === 'update') {
  jestArgs.push('-u');
}
/* Look for files that have changed - this is very fragile */
if (process.argv[2] === 'changed') {
  jestArgs.push('--onlyChanged');
  /* remove the pattern */
  jestArgs = jestArgs.slice(1);
}

/* Echo the argument executed */
let jestCommand = `> ${jestPath}`;
jestArgs.forEach(val => {
  jestCommand += ` ${val}`;
});
console.log(jestCommand);

/* Run the command in a new process */
spawn.sync(
  jestPath,
  jestArgs,
  { stdio: 'inherit' }
);

/* [] - END OF FILE */
