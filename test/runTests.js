const spawn = require('cross-spawn');
const path = require('path');
// const enzyme = require('enzyme');
// const Adapter = require('enzyme-adapter-react-16');

// enzyme.configure({ adapter: new Adapter() });

const s = `\\${path.sep}`;
const pattern = process.argv[2] === 'e2e'
  ? `test${s}e2e${s}.+\\.spec\\.js`
  : `test${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;

spawn.sync(path.normalize('./node_modules/.bin/jest'), [pattern], { stdio: 'inherit' });
