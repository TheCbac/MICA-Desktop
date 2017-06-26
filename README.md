# MICA react-electron

## App Structure

All files for the app are in the `app/` directory. 

### Setup

 * The electron app is first created from `main.js`
 * `app.html` is then opened by `main, which serves as the base HTML for the app.
 * At some point `index.js` is triggered, which loads the global css, load the root container, configures the app state through `configureStore` and sets up the hot swapping in development mode. 
 * `containers/Root.js` Sets up the router, and then loads all of the routes

#### Font Awesome
Using `font-awesome` and `react-fontawesome`. Must hook up stylesheet in app.global.css

 ### Page routing

 * `routes.js` is the first place where developers should need to make changes.
 * Page containers are loaded in from `containers/`, and sync'ed with their appropriate path

 ### React 
 `
 * `containers/` has all of the page containers, which is where component props are mapped to the redux state, and where actions are passed into the component 
 * `components/` contains all of the react components
 * `actions/` is all of the redux actions and action creators. 
 * `reducers/` contains all of the action reducers, which specify how the action change the state. 

## react components
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
`$ npm rebuild --runtime=electron --target=1.4.13 --disturl=https://atom.io/download/atom-shell --abi=50`

`$ npm rebuild --runtime=electron --target=1.6.6 --disturl=https://atom.io/download/atom-shell --abi=51`

`$ npm rebuild --runtime=electron --target=1.6.7 --disturl=https://atom.io/download/atom-shell --abi=51`

npm rebuild jest --runtime=electron --target=1.6.7 --disturl=https://atom.io/download/atom-shell --abi=53


### xpc-connection
 Issues during testing of xpc-connection
 bash
 ```
 $ cd app/
 $ npm rebuild xpc-connection
 ```

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
