# MICA react-electron

The MICA desktop application is the best way to stream data from a MICA cube. The application is written almost exclusively in JavaScript, with just a sprinkling of HTML and CSS, using the [Electron Framework](https://electron.atom.io/). All frontend code is written with [React](https://facebook.github.io/react/), state management is handled by [Redux](http://redux.js.org/), and the application is tested using [Jest](https://facebook.github.io/jest/) and type checked with [Flow](https://flow.org/). This app is a fork of [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate).

## App Structure

All files for the app are in the `/app/` directory, while the electron files are in the top level folder `/`. Developers will modify the following folders to make changes to the application:

```
	app/

		actions/  - Redux actions

		components/ - React Components

		containers/ - React Containers

		reducers/ - Redux reducers

		types/ - Flow types

```

Every file should have an accompanying test file named with the scheme `<fileName>.spec.js`. The test files reside in the top level `/test/` folder. 

## Commands
All commands are run from the top level folder unless otherwise stated. 

* Starting the application: `$ npm run dev`
* Testing: `$ npm run test`

A full list of scripts can be found in `/package.json`

## Theory of Operation

### Boot up

 * The electron app is first created from `main.js`
 * `app.html` is then opened by `main.js`, which serves as the base HTML for the app.
 * At some point `index.js` is triggered, which loads the global css, loads the root container, configures the app state through `configureStore` and sets up the hot swapping in development mode. 
 * `containers/Root.js` Sets up the router, and then loads all of the routes
 * The default state is passed in from `/reducers/index.js` from combine reducers

 ### Page routing

 * `routes.js` is the first place where developers should need to make changes.
 * Page containers are loaded in from `containers/`, and sync'ed with their appropriate path

 ### React 
 
 * `containers/` has all of the page containers, which is where component props are mapped to the redux state, and where actions are passed into the component 
 * `components/` contains all of the react components
 * `actions/` is all of the redux actions and action creators. 
 * `reducers/` contains all of the action reducers, which specify how the action change the state. 

 ### External CSS
Using `font-awesome` and `react-fontawesome`. Must hook up stylesheet in app.global.css

## React components
https://github.com/brillout/awesome-react-components#ui-layout

Menu - https://github.com/alexkuz/react-dock 
Modals - https://github.com/marcio/react-skylight
Graphs - https://github.com/esnet/react-timeseries-charts
Grid system - https://github.com/jxnblk/rgx
Window manager - https://github.com/stayradiated/reactwm
Table - https://github.com/tannerlinsley/react-table
Tooltip - https://github.com/wwayne/react-tooltip

Bootstrap - https://github.com/react-bootstrap/react-bootstrap


## Electron
updating to 1.6.7 was done by
`$ yarn install`

## Noble
Installing noble in the app/ package. Rebuild for current version: 
 The electron target number of `postinstall` in /app/ must match the
 electron package version.

DEPRECATED: 

`$ npm rebuild --runtime=electron --target=1.4.13 --disturl=https://atom.io/download/atom-shell --abi=50`

`$ npm rebuild --runtime=electron --target=1.6.6 --disturl=https://atom.io/download/atom-shell --abi=51`

`$ npm rebuild --runtime=electron --target=1.6.7 --disturl=https://atom.io/download/atom-shell --abi=51`

`$ npm rebuild jest --runtime=electron --target=1.6.7 --disturl=https://atom.io/download/atom-shell --abi=53`

## Logging

### Winston
To avoid errors about colors, put winston in dependencies in /app


### xpc-connection
 Issues during testing of xpc-connection
 bash
 ```
 $ cd app/
 $ npm rebuild xpc-connection
 ```

# Left off:

# Short term: 
 * Rename tabs to DEVICES, SETTINGS, COLLECT, ANALYZE
		* Programs, Applications instead of 
	* Measure and Perform as the two categories (not SEN GEN)
 * Reorganize the file structure 
 * Change copyright to the MICA
 * Add color to the Data Channels button on 
 * Sensors and Generators tabs don't scale correctly 
 * add cube LED control

## TODO: Long term
* Write operating system for MICA Cube
	* Dynamically load programs from MICA app 
	* Use programs to solve problems/challenges
	* Operating system purposely exposes security flaws in lower level cubes
	* Users patch security flaws as they level up
* Programs are used to complete challenges on the cube	
	* Software tasks interact with the OS/another program
	* Electrical tasks interact with the embedded hardware
	* Mechanical tasks are accomplished through the MICA cube controlling a machine or robot

