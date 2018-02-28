module.exports = (function (e) { function n(t) { if (o[t]) return o[t].exports; const r = o[t] = { i: t, l: !1, exports: {} }; return e[t].call(r.exports, r, r.exports, n), r.l = !0, r.exports; } var o = {}; return n.m = e, n.c = o, n.d = function (e, o, t) { n.o(e, o) || Object.defineProperty(e, o, { configurable: !1, enumerable: !0, get: t }); }, n.n = function (e) { const o = e && e.__esModule ? function () { return e.default; } : function () { return e; }; return n.d(o, 'a', o), o; }, n.o = function (e, n) { return Object.prototype.hasOwnProperty.call(e, n); }, n.p = '', n(n.s = './app/main.dev.js'); }({ './app/main.dev.js': function (e, n, o) {
  function t(e) {
    return function () {
      const n = e.apply(this, arguments); return new Promise(((e, o) => {
        function t(r, a) {
          try {
            var s = n[r](a),
              i = s.value;
          } catch (e) { return void o(e); } return s.done ? void e(i) : Promise.resolve(i).then((e) => { t('next', e); }, (e) => { t('throw', e); });
        } return t('next');
      }));
    };
  } let r = o('electron'),
    a = o('./app/menu.js'),
    s = (function (e) { return e && e.__esModule ? e : { default: e }; }(a)); let i = null; { const e = o('./node_modules/source-map-support/source-map-support.js'); e.install(); }(() => {
    const e = t(function*() {
      const e = o('./node_modules/electron-devtools-installer/dist/index.js'),
        n = !!process.env.UPGRADE_EXTENSIONS; return Promise.all(['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'].map((o) => e.default(e[o], n))).catch(console.log);
    }); return function () { return e.apply(this, arguments); };
  })(); r.app.on('window-all-closed', () => { process.platform !== 'darwin' && r.app.quit(); }), r.app.on('ready', t(function*() { !1, i = new r.BrowserWindow({ show: !1, width: 1024, height: 728 }), i.loadURL(`file://${__dirname}/app.html`), i.webContents.on('did-finish-load', () => { if (!i) throw new Error('"mainWindow" is not defined'); i.show(), i.focus(); }), i.on('closed', () => { i = null; }); const e = new s.default(i); e.buildMenu(); }));
},
'./app/menu.js': function (e, n, o) {
  Object.defineProperty(n, '__esModule', { value: !0 }); const t = o('electron'); n.default = class {
    constructor(e) { this.mainWindow = e; }buildMenu() { const e = process.platform === 'darwin' ? this.buildDarwinTemplate() : this.buildDefaultTemplate(); const n = t.Menu.buildFromTemplate(e); return t.Menu.setApplicationMenu(n), n; }setupDevelopmentEnvironment() { this.mainWindow.openDevTools(), this.mainWindow.webContents.on('context-menu', (n, e) => { const { x: o, y: r } = e; t.Menu.buildFromTemplate([{ label: 'Inspect element', click: () => { this.mainWindow.inspectElement(o, r); } }]).popup(this.mainWindow); }); }buildDarwinTemplate() {
      const e = { label: 'Help', submenu: [{ label: 'Learn More', click() { t.shell.openExternal('http://electron.atom.io'); } }, { label: 'Documentation', click() { t.shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme'); } }, { label: 'Community Discussions', click() { t.shell.openExternal('https://discuss.atom.io/c/electron'); } }, { label: 'Search Issues', click() { t.shell.openExternal('https://github.com/atom/electron/issues'); } }] },
        n = { label: 'View', submenu: [{ label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } }] }; return [{ label: 'Electron', submenu: [{ label: 'About ElectronReact', selector: 'orderFrontStandardAboutPanel:' }, { type: 'separator' }, { label: 'Services', submenu: [] }, { type: 'separator' }, { label: 'Hide ElectronReact', accelerator: 'Command+H', selector: 'hide:' }, { label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' }, { label: 'Show All', selector: 'unhideAllApplications:' }, { type: 'separator' }, { label: 'Quit', accelerator: 'Command+Q', click: () => { t.app.quit(); } }] }, { label: 'Edit', submenu: [{ label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' }, { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' }, { type: 'separator' }, { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' }, { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' }, { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' }, { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }] }, n, { label: 'Window', submenu: [{ label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' }, { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' }, { type: 'separator' }, { label: 'Bring All to Front', selector: 'arrangeInFront:' }] }, e];
    }buildDefaultTemplate() { const e = [{ label: '&File', submenu: [{ label: '&Open', accelerator: 'Ctrl+O' }, { label: '&Close', accelerator: 'Ctrl+W', click: () => { this.mainWindow.close(); } }] }, { label: '&View', submenu: [{ label: 'Toggle &Full Screen', accelerator: 'F11', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } }] }, { label: 'Help', submenu: [{ label: 'Learn More', click() { t.shell.openExternal('http://electron.atom.io'); } }, { label: 'Documentation', click() { t.shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme'); } }, { label: 'Community Discussions', click() { t.shell.openExternal('https://discuss.atom.io/c/electron'); } }, { label: 'Search Issues', click() { t.shell.openExternal('https://github.com/atom/electron/issues'); } }] }]; return e; }
  }, e.exports = n.default;
},
'./node_modules/7zip/index.js': function (e, n, o) {
  let t = o('path').resolve,
    r = o('./node_modules/7zip/package.json').bin; e.exports = (function (e, n) { return Object.keys(e).reduce((o, t) => o[t] = n(e[t]), o, {}); }(r, (e) => t(__dirname, e)));
},
'./node_modules/7zip/package.json': function (e) { e.exports = { name: '7zip', version: '0.0.6', description: '7zip Windows Package via Node.js', keywords: ['7z', '7zip', '7-zip', 'windows', 'install'], repository: 'git@github.com:fritx/win-7zip.git', bin: { '7z': '7zip-lite/7z.exe' }, main: 'index.js', scripts: { test: 'mocha' }, license: 'GNU LGPL' }; },
'./node_modules/brace-expansion/index.js': function (e, n, o) {
  function t(e) { return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0); } function r(e) {
    return e.split('\\\\').join(i).split('\\{').join(c)
      .split('\\}')
      .join(E)
      .split('\\,')
      .join(m)
      .split('\\.')
      .join(_);
  } function a(e) {
    return e.split(i).join('\\').split(c).join('{')
      .split(E)
      .join('}')
      .split(m)
      .join(',')
      .split(_)
      .join('.');
  } function s(e) {
    if (!e) return ['']; let n = [],
      o = f('{', '}', e); if (!o) return e.split(','); let t = o.pre,
      r = o.body,
      a = o.post,
      i = t.split(','); i[i.length - 1] += `{${r}}`; const l = s(a); return a.length && (i[i.length - 1] += l.shift(), i.push(...l)), n.push(...i), n;
  } function l(e) { return `{${e}}`; } function d(e) { return /^-?0\d/.test(e); } function p(e, n) { return e <= n; } function u(e, n) { return e >= n; } function g(e, o) {
    let r = [],
      a = f('{', '}', e); if (!a || /\$$/.test(a.pre)) return [e]; let _ = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(a.body),
      b = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(a.body),
      S = _ || b,
      R = a.body.indexOf(',') >= 0; if (!S && !R) return a.post.match(/,.*\}/) ? (e = `${a.pre}{${a.body}${E}${a.post}`, g(e)) : [e]; let A; if (S)A = a.body.split(/\.\./); else if (A = s(a.body), A.length === 1 && (A = g(A[0], !1).map(l), A.length === 1)) { var n = a.post.length ? g(a.post, !1) : ['']; return n.map((e) => a.pre + A[0] + e); } var O,
      C = a.pre,
      n = a.post.length ? g(a.post, !1) : ['']; if (S) {
      let L = t(A[0]),
        I = t(A[1]),
        y = Math.max(A[0].length, A[1].length),
        N = A.length == 3 ? Math.abs(t(A[2])) : 1,
        x = p; I < L && (N *= -1, x = u); const v = A.some(d); O = []; for (let T = L; x(T, I); T += N) { var i; if (b)i = String.fromCharCode(T), i === '\\' && (i = ''); else if (i = `${T}`, v) { const c = y - i.length; if (c > 0) { const M = Array(c + 1).join('0'); i = T < 0 ? `-${M}${i.slice(1)}` : M + i; } }O.push(i); }
    } else O = h(A, (e) => g(e, !1)); for (let D = 0; D < O.length; D++) for (var j, w = 0; w < n.length; w++)j = C + O[D] + n[w], (!o || S || j) && r.push(j); return r;
  } var h = o('./node_modules/concat-map/index.js'),
    f = o('./node_modules/brace-expansion/node_modules/balanced-match/index.js'); e.exports = function (e) { return e ? (e.substr(0, 2) === '{}' && (e = `\\{\\}${e.substr(2)}`), g(r(e), !0).map(a)) : []; }; var i = `\0SLASH${Math.random()}\0`,
    c = `\0OPEN${Math.random()}\0`,
    E = `\0CLOSE${Math.random()}\0`,
    m = `\0COMMA${Math.random()}\0`,
    _ = `\0PERIOD${Math.random()}\0`;
},
'./node_modules/brace-expansion/node_modules/balanced-match/index.js': function (e) {
  function n(e, n, a) { e instanceof RegExp && (e = o(e, a)), n instanceof RegExp && (n = o(n, a)); const s = t(e, n, a); return s && { start: s[0], end: s[1], pre: a.slice(0, s[0]), body: a.slice(s[0] + e.length, s[1]), post: a.slice(s[1] + n.length) }; } function o(e, n) { const o = n.match(e); return o ? o[0] : null; } function t(e, n, o) {
    let t,
      r,
      a,
      s,
      l,
      d = o.indexOf(e),
      c = o.indexOf(n, d + 1),
      p = d; if (d >= 0 && c > 0) { for (t = [], a = o.length; p >= 0 && !l;)p == d ? (t.push(p), d = o.indexOf(e, p + 1)) : t.length == 1 ? l = [t.pop(), c] : (r = t.pop(), r < a && (a = r, s = c), c = o.indexOf(n, p + 1)), p = d < c && d >= 0 ? d : c; t.length && (l = [a, s]); } return l;
  }e.exports = n, n.range = t;
},
'./node_modules/concat-map/index.js': function (e) { e.exports = function (e, o) { for (var t, r = [], a = 0; a < e.length; a++)t = o(e[a], a), n(t) ? r.push(...t) : r.push(t); return r; }; var n = Array.isArray || function (e) { return Object.prototype.toString.call(e) === '[object Array]'; }; },
'./node_modules/cross-unzip/index.js': function (e, n, o) {
  function t(e, n, o) { o = r(o); const t = a(e, n, { stdio: 'ignore' }); t.on('error', (e) => { o(e); }), t.on('exit', (e) => { o(e ? new Error(`Exited with code ${e}`) : null); }); } function r(e) { let n = !1; return function () { n || (n = !0, e.apply(this, s.call(arguments))); }; } var a = o('child_process').spawn,
    s = Array.prototype.slice,
    i = process.platform === 'win32' ? function (e, n, r) { const a = o('./node_modules/7zip/index.js')['7z']; t(a, ['x', e, '-y', `-o${n}`], r); } : function (e, n, o) { t('unzip', ['-o', e, '-d', n], o); }; i.unzip = i, e.exports = i;
},
'./node_modules/electron-devtools-installer/dist/downloadChromeExtension.js': function (e, n, o) {
  function t(e) { return e && e.__esModule ? e : { default: e }; }Object.defineProperty(n, '__esModule', { value: !0 }); let r = o('fs'),
    a = t(r),
    s = o('path'),
    i = t(s),
    l = o('./node_modules/rimraf/rimraf.js'),
    d = t(l),
    c = o('./node_modules/cross-unzip/index.js'),
    p = t(c),
    u = o('./node_modules/electron-devtools-installer/dist/utils.js'); n.default = function e(n, o) {
    let t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 5,
      r = (0, u.getPath)(); a.default.existsSync(r) || a.default.mkdirSync(r); const s = i.default.resolve(`${r}/${n}`); return new Promise(((r, l) => { !a.default.existsSync(s) || o ? (function () { a.default.existsSync(s) && d.default.sync(s); const c = i.default.resolve(`${s}.crx`); (0, u.downloadFile)(`https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D${n}%26uc&prodversion=32`, c).then(() => { (0, p.default)(c, s, (e) => (e && !a.default.existsSync(i.default.resolve(s, 'manifest.json')) ? l(e) : void r(s))); }).catch((a) => console.log(`Failed to fetch extension, trying ${t - 1} more times`), t <= 1 ? l(a) : void setTimeout(() => { e(n, o, t - 1).then(r).catch(l); }, 200)); }()) : r(s); }));
  };
},
'./node_modules/electron-devtools-installer/dist/index.js': function (e, n, o) {
  function t(e) { return e && e.__esModule ? e : { default: e }; } function r(e, n, o) { return n in e ? Object.defineProperty(e, n, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = o, e; }Object.defineProperty(n, '__esModule', { value: !0 }), n.CYCLEJS_DEVTOOL = n.REACT_PERF = n.REDUX_DEVTOOLS = n.VUEJS_DEVTOOLS = n.ANGULARJS_BATARANG = n.JQUERY_DEBUGGER = n.BACKBONE_DEBUGGER = n.REACT_DEVELOPER_TOOLS = n.EMBER_INSPECTOR = void 0; let a = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (e) { return typeof e; } : function (e) { return e && typeof Symbol === 'function' && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e; },
    s = o('electron'),
    i = t(s),
    l = o('fs'),
    d = t(l),
    c = o('path'),
    p = t(c),
    u = o('./node_modules/semver/semver.js'),
    m = t(u),
    g = o('./node_modules/electron-devtools-installer/dist/downloadChromeExtension.js'),
    h = t(g),
    f = o('./node_modules/electron-devtools-installer/dist/utils.js'),
    E = s.remote || i.default,
    _ = E.BrowserWindow,
    y = {},
    b = p.default.resolve((0, f.getPath)(), 'IDMap.json'); d.default.existsSync(b) && (y = JSON.parse(d.default.readFileSync(b, 'utf8'))); n.default = function e(n) {
    const o = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]; if (Array.isArray(n)) return Promise.all(n.map((n) => e(n, o))); let t; if ((typeof n === 'undefined' ? 'undefined' : a(n)) === 'object' && n.id) { if (t = n.id, !m.default.satisfies(process.versions.electron, n.electron)) return Promise.reject(new Error(`Version of Electron: ${process.versions.electron} does not match required range ${n.electron} for extension ${t}`)); } else if (typeof n === 'string')t = n; else return Promise.reject(new Error(`Invalid extensionReference passed in: "${n}"`)); let s = y[t],
      i = s && _.getDevToolsExtensions && _.getDevToolsExtensions()[s]; return !o && i ? Promise.resolve(y[t]) : (0, h.default)(t, o).then((e) => { i && _.removeDevToolsExtension(s); const n = _.addDevToolsExtension(e); return d.default.writeFileSync(b, JSON.stringify(Object.assign(y, r({}, t, n)))), Promise.resolve(n); });
  }; let S = n.EMBER_INSPECTOR = { id: 'bmdblncegkenkacieihfhpjfppoconhi', electron: '^1.2.1' },
    R = n.REACT_DEVELOPER_TOOLS = { id: 'fmkadmapgofadopljbjfkapdkoienihi', electron: '^1.2.1' },
    A = n.BACKBONE_DEBUGGER = { id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd', electron: '^1.2.1' },
    O = n.JQUERY_DEBUGGER = { id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi', electron: '^1.2.1' },
    C = n.ANGULARJS_BATARANG = { id: 'ighdmehidhipcmcojjgiloacoafjmpfk', electron: '^1.2.1' },
    L = n.VUEJS_DEVTOOLS = { id: 'nhdogjmejiglipccpnnnanhbledajbpd', electron: '^1.2.1' },
    I = n.REDUX_DEVTOOLS = { id: 'lmhkpmbekcpmknklioeibfkpmmfibljd', electron: '^1.2.1' },
    N = n.REACT_PERF = { id: 'hacmcodfllhbnekmghgdlplbdnahmhmm', electron: '^1.2.6' },
    x = n.CYCLEJS_DEVTOOL = { id: 'dfgplfmhhmdekalbpejekgfegkonjpfp', electron: '^1.2.1' };
},
'./node_modules/electron-devtools-installer/dist/utils.js': function (e, n, o) {
  function t(e) { return e && e.__esModule ? e : { default: e }; }Object.defineProperty(n, '__esModule', { value: !0 }), n.downloadFile = n.getPath = void 0; let r = o('electron'),
    a = t(r),
    s = o('fs'),
    i = t(s),
    l = o('path'),
    d = t(l),
    c = o('https'),
    p = t(c),
    u = n.getPath = function () { const e = (r.remote || a.default).app.getPath('userData'); return d.default.resolve(`${e}/extensions`); },
    m = r.remote || a.default,
    g = m.net,
    h = g ? g.request : p.default.get,
    f = n.downloadFile = function e(n, o) { return new Promise(((t, r) => { const a = h(n); a.on('response', (n) => (n.statusCode >= 300 && n.statusCode < 400 && n.headers.location ? e(n.headers.location, o).then(t).catch(r) : void n.pipe(i.default.createWriteStream(o)).on('close', t))), a.on('error', r), a.end(); })); };
},
'./node_modules/fs.realpath/index.js': function (e, n, o) {
  function t(e) { return e && e.syscall === 'realpath' && (e.code === 'ELOOP' || e.code === 'ENOMEM' || e.code === 'ENAMETOOLONG'); } function r(e, n, o) { return c ? i(e, n, o) : void (typeof n === 'function' && (o = n, n = null), i(e, n, (r, a) => { t(r) ? u.realpath(e, n, o) : o(r, a); })); } function a(e, n) { if (c) return l(e, n); try { return l(e, n); } catch (o) { if (t(o)) return u.realpathSync(e, n); throw o; } }e.exports = r, r.realpath = r, r.sync = a, r.realpathSync = a, r.monkeypatch = function () { s.realpath = r, s.realpathSync = a; }, r.unmonkeypatch = function () { s.realpath = i, s.realpathSync = l; }; var s = o('fs'),
    i = s.realpath,
    l = s.realpathSync,
    d = process.version,
    c = /^v[0-5]\./.test(d),
    u = o('./node_modules/fs.realpath/old.js');
},
'./node_modules/fs.realpath/old.js': function (e, n, o) {
  function t() { function e(e) { e && (t.message = e.message, e = t, n(e)); } function n(e) { if (e) if (process.throwDeprecation) throw e; else if (!process.noDeprecation) { const n = `fs: missing callback ${e.stack || e.message}`; process.traceDeprecation ? console.trace(n) : console.error(n); } } let o; if (l) { var t = new Error(); o = e; } else o = n; return o; } function r(e) { return typeof e === 'function' ? e : t(); } var a = o('path'),
    s = process.platform === 'win32',
    i = o('fs'),
    l = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG),
    d = a.normalize; if (s) var c = /(.*?)(?:[\/\\]+|$)/g; else var c = /(.*?)(?:[\/]+|$)/g; if (s) var u = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/; else var u = /^[\/]*/; n.realpathSync = function (e, n) {
    function o() { const n = u.exec(e); t = n[0].length, r = n[0], l = n[0], d = '', s && !g[l] && (i.lstatSync(l), g[l] = !0); } if (e = a.resolve(e), n && Object.prototype.hasOwnProperty.call(n, e)) return n[e]; var t,
      r,
      l,
      d,
      p = e,
      m = {},
      g = {}; for (o(); t < e.length;) { c.lastIndex = t; const h = c.exec(e); if (d = r, r += h[0], l = d + h[1], t = c.lastIndex, !(g[l] || n && n[l] === l)) { var f; if (n && Object.prototype.hasOwnProperty.call(n, l))f = n[l]; else { const E = i.lstatSync(l); if (!E.isSymbolicLink()) { g[l] = !0, n && (n[l] = l); continue; } let _ = null; if (!s) { var y = `${E.dev.toString(32)}:${E.ino.toString(32)}`; m.hasOwnProperty(y) && (_ = m[y]); }_ === null && (i.statSync(l), _ = i.readlinkSync(l)), f = a.resolve(d, _), n && (n[l] = f), s || (m[y] = _); }e = a.resolve(f, e.slice(t)), o(); } } return n && (n[p] = e), e;
  }, n.realpath = function (e, n, o) {
    function t() { const n = u.exec(e); g = n[0].length, h = n[0], f = n[0], E = '', s && !b[f] ? i.lstat(f, (e) => (e ? o(e) : void (b[f] = !0, l()))) : process.nextTick(l); } function l() { if (g >= e.length) return n && (n[_] = e), o(null, e); c.lastIndex = g; const t = c.exec(e); return E = h, h += t[0], f = E + t[1], g = c.lastIndex, b[f] || n && n[f] === f ? process.nextTick(l) : n && Object.prototype.hasOwnProperty.call(n, f) ? m(n[f]) : i.lstat(f, d); } function d(e, t) { if (e) return o(e); if (!t.isSymbolicLink()) return b[f] = !0, n && (n[f] = f), process.nextTick(l); if (!s) { var r = `${t.dev.toString(32)}:${t.ino.toString(32)}`; if (y.hasOwnProperty(r)) return p(null, y[r], f); }i.stat(f, (e) => (e ? o(e) : void i.readlink(f, (e, n) => { s || (y[r] = n), p(e, n); }))); } function p(e, t, r) { if (e) return o(e); const s = a.resolve(E, t); n && (n[r] = s), m(s); } function m(n) { e = a.resolve(n, e.slice(g)), t(); } if (typeof o !== 'function' && (o = r(n), n = null), e = a.resolve(e), n && Object.prototype.hasOwnProperty.call(n, e)) return process.nextTick(o.bind(null, null, n[e])); var g,
      h,
      f,
      E,
      _ = e,
      y = {},
      b = {}; t();
  };
},
'./node_modules/glob/common.js': function (e, n, o) {
  function t(e, n) { return Object.prototype.hasOwnProperty.call(e, n); } function r(e, n) { return e.toLowerCase().localeCompare(n.toLowerCase()); } function a(e, n) { return e.localeCompare(n); } function s(e, n) { e.ignore = n.ignore || [], Array.isArray(e.ignore) || (e.ignore = [e.ignore]), e.ignore.length && (e.ignore = e.ignore.map(i)); } function i(e) { let n = null; if (e.slice(-3) === '/**') { const o = e.replace(/(\/\*\*)+$/, ''); n = new m(o, { dot: !0 }); } return { matcher: new m(e, { dot: !0 }), gmatcher: n }; } function l(e, n) { let o = n; return o = n.charAt(0) === '/' ? c.join(e.root, n) : u(n) || n === '' ? n : e.changedCwd ? c.resolve(e.cwd, n) : c.resolve(n), process.platform === 'win32' && (o = o.replace(/\\/g, '/')), o; } function d(e, n) { return !!e.ignore.length && e.ignore.some((e) => e.matcher.match(n) || !!(e.gmatcher && e.gmatcher.match(n))); }n.alphasort = a, n.alphasorti = r, n.setopts = function (e, n, o) { if (o || (o = {}), o.matchBase && n.indexOf('/') === -1) { if (o.noglobstar) throw new Error('base matching requires globstar'); n = `**/${n}`; }e.silent = !!o.silent, e.pattern = n, e.strict = !1 !== o.strict, e.realpath = !!o.realpath, e.realpathCache = o.realpathCache || Object.create(null), e.follow = !!o.follow, e.dot = !!o.dot, e.mark = !!o.mark, e.nodir = !!o.nodir, e.nodir && (e.mark = !0), e.sync = !!o.sync, e.nounique = !!o.nounique, e.nonull = !!o.nonull, e.nosort = !!o.nosort, e.nocase = !!o.nocase, e.stat = !!o.stat, e.noprocess = !!o.noprocess, e.absolute = !!o.absolute, e.maxLength = o.maxLength || Infinity, e.cache = o.cache || Object.create(null), e.statCache = o.statCache || Object.create(null), e.symlinks = o.symlinks || Object.create(null), s(e, o), e.changedCwd = !1; const r = process.cwd(); t(o, 'cwd') ? (e.cwd = c.resolve(o.cwd), e.changedCwd = e.cwd !== r) : e.cwd = r, e.root = o.root || c.resolve(e.cwd, '/'), e.root = c.resolve(e.root), process.platform === 'win32' && (e.root = e.root.replace(/\\/g, '/')), e.cwdAbs = u(e.cwd) ? e.cwd : l(e, e.cwd), process.platform === 'win32' && (e.cwdAbs = e.cwdAbs.replace(/\\/g, '/')), e.nomount = !!o.nomount, o.nonegate = !0, o.nocomment = !0, e.minimatch = new m(n, o), e.options = e.minimatch.options; }, n.ownProp = t, n.makeAbs = l, n.finish = function (n) {
    for (var e, o = n.nounique, t = o ? [] : Object.create(null), s = 0, i = n.matches.length; s < i; s++) if (e = n.matches[s], e && Object.keys(e).length !== 0) { const c = Object.keys(e); o ? t.push(...c) : c.forEach((e) => { t[e] = !0; }); } else if (n.nonull) { const p = n.minimatch.globSet[s]; o ? t.push(p) : t[p] = !0; } if (o || (t = Object.keys(t)), n.nosort || (t = t.sort(n.nocase ? r : a)), n.mark) {
      for (var s = 0; s < t.length; s++)t[s] = n._mark(t[s]); n.nodir && (t = t.filter((o) => {
        let e = !/\/$/.test(o),
          t = n.cache[o] || n.cache[l(n, o)]; return e && t && (e = t !== 'DIR' && !Array.isArray(t)), e;
      }));
    }n.ignore.length && (t = t.filter((e) => !d(n, e))), n.found = t;
  }, n.mark = function (e, n) {
    let o = l(e, n),
      t = e.cache[o],
      r = n; if (t) {
      let a = t === 'DIR' || Array.isArray(t),
        s = n.slice(-1) === '/'; if (a && !s ? r += '/' : !a && s && (r = r.slice(0, -1)), r !== n) { const i = l(e, r); e.statCache[i] = e.statCache[o], e.cache[i] = e.cache[o]; }
    } return r;
  }, n.isIgnored = d, n.childrenIgnored = function (e, n) { return !!e.ignore.length && e.ignore.some((e) => !!(e.gmatcher && e.gmatcher.match(n))); }; var c = o('path'),
    p = o('./node_modules/minimatch/minimatch.js'),
    u = o('./node_modules/path-is-absolute/index.js'),
    m = p.Minimatch;
},
'./node_modules/glob/glob.js': function (e, n, o) {
  function t(e, n, o) { if (typeof n === 'function' && (o = n, n = {}), n || (n = {}), n.sync) { if (o) throw new TypeError('callback provided to sync glob'); return f(e, n); } return new a(e, n, o); } function r(e, n) { if (n === null || typeof n !== 'object') return e; for (let o = Object.keys(n), t = o.length; t--;)e[o[t]] = n[o[t]]; return e; } function a(e, o, t) { function r() { --n._processing, n._processing <= 0 && (l ? process.nextTick(() => { n._finish(); }) : n._finish()); } if (typeof o === 'function' && (t = o, o = null), o && o.sync) { if (t) throw new TypeError('callback provided to sync glob'); return new I(e, o); } if (!(this instanceof a)) return new a(e, o, t); b(this, e, o), this._didRealPath = !1; const s = this.minimatch.set.length; this.matches = Array(s), typeof t === 'function' && (t = L(t), this.on('error', t), this.on('end', (e) => { t(null, e); })); var n = this; if (this._processing = 0, this._emitQueue = [], this._processQueue = [], this.paused = !1, this.noprocess) return this; if (s === 0) return r(); for (var l = !0, d = 0; d < s; d++) this._process(this.minimatch.set[d], d, !1, r); l = !1; } function s(e, n, o) { return function (t, r) { t ? e._readdirError(n, t, o) : e._readdirEntries(n, r, o); }; }e.exports = t; var i = o('fs'),
    l = o('./node_modules/fs.realpath/index.js'),
    d = o('./node_modules/minimatch/minimatch.js'),
    c = d.Minimatch,
    p = o('./node_modules/inherits/inherits.js'),
    u = o('events').EventEmitter,
    m = o('path'),
    g = o('assert'),
    h = o('./node_modules/path-is-absolute/index.js'),
    f = o('./node_modules/glob/sync.js'),
    E = o('./node_modules/glob/common.js'),
    _ = E.alphasort,
    y = E.alphasorti,
    b = E.setopts,
    S = E.ownProp,
    R = o('./node_modules/inflight/inflight.js'),
    A = o('util'),
    O = E.childrenIgnored,
    C = E.isIgnored,
    L = o('./node_modules/once/once.js'); t.sync = f; var I = t.GlobSync = f.GlobSync; t.glob = t, t.hasMagic = function (e, n) {
    const o = r({}, n); o.noprocess = !0; let t = new a(e, o),
      s = t.minimatch.set; if (!e) return !1; if (s.length > 1) return !0; for (let i = 0; i < s[0].length; i++) if (typeof s[0][i] !== 'string') return !0; return !1;
  }, t.Glob = a, p(a, u), a.prototype._finish = function () { return g(this instanceof a), this.aborted ? void 0 : this.realpath && !this._didRealpath ? this._realpath() : void (E.finish(this), this.emit('end', this.found)); }, a.prototype._realpath = function () { function e() { --o == 0 && n._finish(); } if (!this._didRealpath) { this._didRealpath = !0; var o = this.matches.length; if (o === 0) return this._finish(); for (var n = this, t = 0; t < this.matches.length; t++) this._realpathSet(t, e); } }, a.prototype._realpathSet = function (e, o) {
    const t = this.matches[e]; if (!t) return o(); let r = Object.keys(t),
      a = this,
      s = r.length; if (s === 0) return o(); const n = this.matches[e] = Object.create(null); r.forEach((t) => { t = a._makeAbs(t), l.realpath(t, a.realpathCache, (r, i) => { r ? r.syscall === 'stat' ? n[t] = !0 : a.emit('error', r) : n[i] = !0, --s == 0 && (a.matches[e] = n, o()); }); });
  }, a.prototype._mark = function (e) { return E.mark(this, e); }, a.prototype._makeAbs = function (e) { return E.makeAbs(this, e); }, a.prototype.abort = function () { this.aborted = !0, this.emit('abort'); }, a.prototype.pause = function () { this.paused || (this.paused = !0, this.emit('pause')); }, a.prototype.resume = function () { if (this.paused) { if (this.emit('resume'), this.paused = !1, this._emitQueue.length) { const n = this._emitQueue.slice(0); this._emitQueue.length = 0; for (var o, e = 0; e < n.length; e++)o = n[e], this._emitMatch(o[0], o[1]); } if (this._processQueue.length) { const t = this._processQueue.slice(0); this._processQueue.length = 0; for (var r, e = 0; e < t.length; e++)r = t[e], this._processing--, this._process(r[0], r[1], r[2], r[3]); } } }, a.prototype._process = function (e, o, t, r) {
    if (g(this instanceof a), g(typeof r === 'function'), !this.aborted) {
      if (this._processing++, this.paused) return void this._processQueue.push([e, o, t, r]); for (var s = 0; typeof e[s] === 'string';)s++; let n; switch (s) { case e.length: return void this._processSimple(e.join('/'), o, r); case 0: n = null; break; default: n = e.slice(0, s).join('/'); } let i,
        l = e.slice(s); n === null ? i = '.' : h(n) || h(e.join('/')) ? ((!n || !h(n)) && (n = `/${n}`), i = n) : i = n; const c = this._makeAbs(i); if (O(this, i)) return r(); const p = l[0] === d.GLOBSTAR; p ? this._processGlobStar(n, i, c, l, o, t, r) : this._processReaddir(n, i, c, l, o, t, r);
    }
  }, a.prototype._processReaddir = function (e, n, o, t, r, a, s) { const i = this; this._readdir(o, a, (l, d) => i._processReaddir2(e, n, o, t, r, a, d, s)); }, a.prototype._processReaddir2 = function (n, o, t, r, a, s, l, d) { if (!l) return d(); for (var c, e = r[0], p = !!this.minimatch.negate, u = e._glob, g = this.dot || u.charAt(0) === '.', h = [], f = 0; f < l.length; f++) if (c = l[f], c.charAt(0) !== '.' || g) { var i; i = p && !n ? !c.match(e) : c.match(e), i && h.push(c); } const E = h.length; if (E === 0) return d(); if (r.length === 1 && !this.mark && !this.stat) { this.matches[a] || (this.matches[a] = Object.create(null)); for (var c, f = 0; f < E; f++)c = h[f], n && (n === '/' ? c = n + c : c = `${n}/${c}`), c.charAt(0) !== '/' || this.nomount || (c = m.join(this.root, c)), this._emitMatch(a, c); return d(); }r.shift(); for (var f = 0; f < E; f++) { var c = h[f]; n && (n === '/' ? c = n + c : c = `${n}/${c}`), this._process([c].concat(r), a, s, d); }d(); }, a.prototype._emitMatch = function (n, o) { if (!this.aborted && !C(this, o)) { if (this.paused) return void this._emitQueue.push([n, o]); const e = h(o) ? o : this._makeAbs(o); if (this.mark && (o = this._mark(o)), this.absolute && (o = e), !this.matches[n][o]) { if (this.nodir) { const t = this.cache[e]; if (t === 'DIR' || Array.isArray(t)) return; } this.matches[n][o] = !0; const r = this.statCache[e]; r && this.emit('stat', o, r), this.emit('match', o); } } }, a.prototype._readdirInGlobStar = function (e, n) {
    function o(o, r) { if (o && o.code === 'ENOENT') return n(); const a = r && r.isSymbolicLink(); t.symlinks[e] = a, a || !r || r.isDirectory() ? t._readdir(e, !1, n) : (t.cache[e] = 'FILE', n()); } if (!this.aborted) {
      if (this.follow) return this._readdir(e, !1, n); var t = this,
        r = R(`lstat\0${e}`, o); r && i.lstat(e, r);
    }
  }, a.prototype._readdir = function (e, n, o) { if (!this.aborted && (o = R(`readdir\0${e}\0${n}`, o), !!o)) { if (n && !S(this.symlinks, e)) return this._readdirInGlobStar(e, o); if (S(this.cache, e)) { const t = this.cache[e]; if (!t || t === 'FILE') return o(); if (Array.isArray(t)) return o(null, t); } this; i.readdir(e, s(this, e, o)); } }, a.prototype._readdirEntries = function (n, o, t) { if (!this.aborted) { if (!this.mark && !this.stat) for (var r, e = 0; e < o.length; e++)r = o[e], r = n === '/' ? n + r : `${n}/${r}`, this.cache[r] = !0; return this.cache[n] = o, t(null, o); } }, a.prototype._readdirError = function (e, n, o) { if (!this.aborted) { switch (n.code) { case 'ENOTSUP': case 'ENOTDIR': var t = this._makeAbs(e); if (this.cache[t] = 'FILE', t === this.cwdAbs) { const r = new Error(`${n.code} invalid cwd ${this.cwd}`); r.path = this.cwd, r.code = n.code, this.emit('error', r), this.abort(); } break; case 'ENOENT': case 'ELOOP': case 'ENAMETOOLONG': case 'UNKNOWN': this.cache[this._makeAbs(e)] = !1; break; default: this.cache[this._makeAbs(e)] = !1, this.strict && (this.emit('error', n), this.abort()), this.silent || console.error('glob error', n); } return o(); } }, a.prototype._processGlobStar = function (e, n, o, t, r, a, s) { const i = this; this._readdir(o, a, (l, d) => { i._processGlobStar2(e, n, o, t, r, a, d, s); }); }, a.prototype._processGlobStar2 = function (n, o, t, r, a, s, l, d) {
    if (!l) return d(); let c = r.slice(1),
      p = n ? [n] : [],
      u = p.concat(c); this._process(u, a, !1, d); let m = this.symlinks[t],
      g = l.length; if (m && s) return d(); for (var h, e = 0; e < g; e++) if (h = l[e], h.charAt(0) !== '.' || this.dot) { const i = p.concat(l[e], c); this._process(i, a, !0, d); const f = p.concat(l[e], r); this._process(f, a, !0, d); }d();
  }, a.prototype._processSimple = function (e, n, o) { const t = this; this._stat(e, (r, a) => { t._processSimple2(e, n, r, a, o); }); }, a.prototype._processSimple2 = function (e, n, o, t, r) { if (this.matches[n] || (this.matches[n] = Object.create(null)), !t) return r(); if (e && h(e) && !this.nomount) { const a = /[\/\\]$/.test(e); e.charAt(0) === '/' ? e = m.join(this.root, e) : (e = m.resolve(this.root, e), a && (e += '/')); }process.platform === 'win32' && (e = e.replace(/\\/g, '/')), this._emitMatch(n, e), r(); }, a.prototype._stat = function (e, n) {
    let o = this._makeAbs(e),
      t = e.slice(-1) === '/'; if (e.length > this.maxLength) return n(); if (!this.stat && S(this.cache, o)) { let r = this.cache[o]; if (Array.isArray(r) && (r = 'DIR'), !t || r === 'DIR') return n(null, r); if (t && r === 'FILE') return n(); } const a = this.statCache[o]; if (void 0 !== a) { if (!1 === a) return n(null, a); const s = a.isDirectory() ? 'DIR' : 'FILE'; return t && s == 'FILE' ? n() : n(null, s, a); } let l = this,
      d = R(`stat\0${o}`, (t, r) => (r && r.isSymbolicLink() ? i.stat(o, (t, a) => { t ? l._stat2(e, o, null, r, n) : l._stat2(e, o, t, a, n); }) : void l._stat2(e, o, t, r, n))); d && i.lstat(o, d);
  }, a.prototype._stat2 = function (e, n, o, t, r) { if (o && (o.code === 'ENOENT' || o.code === 'ENOTDIR')) return this.statCache[n] = !1, r(); const a = e.slice(-1) === '/'; if (this.statCache[n] = t, n.slice(-1) === '/' && t && !t.isDirectory()) return r(null, !1, t); let s = !0; return t && (s = t.isDirectory() ? 'DIR' : 'FILE'), this.cache[n] = this.cache[n] || s, a && s === 'FILE' ? r() : r(null, s, t); };
},
'./node_modules/glob/sync.js': function (e, n, o) {
  function t(e, n) { if (typeof n === 'function' || arguments.length === 3) throw new TypeError('callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167'); return new r(e, n).found; } function r(e, o) { if (!e) throw new Error('must provide pattern'); if (typeof o === 'function' || arguments.length === 3) throw new TypeError('callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167'); if (!(this instanceof r)) return new r(e, o); if (E(this, e, o), this.noprocess) return this; const t = this.minimatch.set.length; this.matches = Array(t); for (let n = 0; n < t; n++) this._process(this.minimatch.set[n], n, !1); this._finish(); }e.exports = t, t.GlobSync = r; var a = o('fs'),
    s = o('./node_modules/fs.realpath/index.js'),
    i = o('./node_modules/minimatch/minimatch.js'),
    l = i.Minimatch,
    d = o('./node_modules/glob/glob.js').Glob,
    c = o('util'),
    p = o('path'),
    u = o('assert'),
    m = o('./node_modules/path-is-absolute/index.js'),
    g = o('./node_modules/glob/common.js'),
    h = g.alphasort,
    f = g.alphasorti,
    E = g.setopts,
    _ = g.ownProp,
    y = g.childrenIgnored,
    b = g.isIgnored; r.prototype._finish = function () { if (u(this instanceof r), this.realpath) { const e = this; this.matches.forEach((n, o) => { const t = e.matches[o] = Object.create(null); for (let r in n) try { r = e._makeAbs(r); const a = s.realpathSync(r, e.realpathCache); t[a] = !0; } catch (n) { if (n.syscall === 'stat')t[e._makeAbs(r)] = !0; else throw n; } }); }g.finish(this); }, r.prototype._process = function (e, o, t) {
    u(this instanceof r); for (var a = 0; typeof e[a] === 'string';)a++; let n; switch (a) { case e.length: return void this._processSimple(e.join('/'), o); case 0: n = null; break; default: n = e.slice(0, a).join('/'); } let s,
      l = e.slice(a); n === null ? s = '.' : m(n) || m(e.join('/')) ? ((!n || !m(n)) && (n = `/${n}`), s = n) : s = n; const d = this._makeAbs(s); if (!y(this, s)) { const c = l[0] === i.GLOBSTAR; c ? this._processGlobStar(n, s, d, l, o, t) : this._processReaddir(n, s, d, l, o, t); }
  }, r.prototype._processReaddir = function (n, o, t, r, a, s) {
    const l = this._readdir(t, s); if (l) {
      for (var d, e = r[0], c = !!this.minimatch.negate, u = e._glob, g = this.dot || u.charAt(0) === '.', h = [], f = 0; f < l.length; f++) if (d = l[f], d.charAt(0) !== '.' || g) { var i; i = c && !n ? !d.match(e) : d.match(e), i && h.push(d); } const m = h.length; if (m !== 0) {
        if (r.length === 1 && !this.mark && !this.stat) { this.matches[a] || (this.matches[a] = Object.create(null)); for (var d, f = 0; f < m; f++)d = h[f], n && (n.slice(-1) === '/' ? d = n + d : d = `${n}/${d}`), d.charAt(0) !== '/' || this.nomount || (d = p.join(this.root, d)), this._emitMatch(a, d); return; }r.shift(); for (var f = 0; f < m; f++) {
          var E,
            d = h[f]; E = n ? [n, d] : [d], this._process(E.concat(r), a, s);
        }
      }
    }
  }, r.prototype._emitMatch = function (n, o) { if (!b(this, o)) { const e = this._makeAbs(o); if (this.mark && (o = this._mark(o)), this.absolute && (o = e), !this.matches[n][o]) { if (this.nodir) { const t = this.cache[e]; if (t === 'DIR' || Array.isArray(t)) return; } this.matches[n][o] = !0, this.stat && this._stat(o); } } }, r.prototype._readdirInGlobStar = function (e) {
    if (this.follow) return this._readdir(e, !1); let n,
      o; try { o = a.lstatSync(e); } catch (e) { if (e.code === 'ENOENT') return null; } const t = o && o.isSymbolicLink(); return this.symlinks[e] = t, t || !o || o.isDirectory() ? n = this._readdir(e, !1) : this.cache[e] = 'FILE', n;
  }, r.prototype._readdir = function (e, n) { if (n && !_(this.symlinks, e)) return this._readdirInGlobStar(e); if (_(this.cache, e)) { const o = this.cache[e]; if (!o || o === 'FILE') return null; if (Array.isArray(o)) return o; } try { return this._readdirEntries(e, a.readdirSync(e)); } catch (n) { return this._readdirError(e, n), null; } }, r.prototype._readdirEntries = function (n, o) { if (!this.mark && !this.stat) for (var t, e = 0; e < o.length; e++)t = o[e], t = n === '/' ? n + t : `${n}/${t}`, this.cache[t] = !0; return this.cache[n] = o, o; }, r.prototype._readdirError = function (e, n) { switch (n.code) { case 'ENOTSUP': case 'ENOTDIR': var o = this._makeAbs(e); if (this.cache[o] = 'FILE', o === this.cwdAbs) { const t = new Error(`${n.code} invalid cwd ${this.cwd}`); throw t.path = this.cwd, t.code = n.code, t; } break; case 'ENOENT': case 'ELOOP': case 'ENAMETOOLONG': case 'UNKNOWN': this.cache[this._makeAbs(e)] = !1; break; default: if (this.cache[this._makeAbs(e)] = !1, this.strict) throw n; this.silent || console.error('glob error', n); } }, r.prototype._processGlobStar = function (n, o, t, r, a, s) {
    const l = this._readdir(t, s); if (l) {
      let d = r.slice(1),
        c = n ? [n] : [],
        p = c.concat(d); this._process(p, a, !1); let u = l.length,
        m = this.symlinks[t]; if (!(m && s)) for (var g, e = 0; e < u; e++) if (g = l[e], g.charAt(0) !== '.' || this.dot) { const i = c.concat(l[e], d); this._process(i, a, !0); const h = c.concat(l[e], r); this._process(h, a, !0); }
    }
  }, r.prototype._processSimple = function (e, n) { const o = this._stat(e); if (this.matches[n] || (this.matches[n] = Object.create(null)), !!o) { if (e && m(e) && !this.nomount) { const t = /[\/\\]$/.test(e); e.charAt(0) === '/' ? e = p.join(this.root, e) : (e = p.resolve(this.root, e), t && (e += '/')); }process.platform === 'win32' && (e = e.replace(/\\/g, '/')), this._emitMatch(n, e); } }, r.prototype._stat = function (e) {
    let n = this._makeAbs(e),
      o = e.slice(-1) === '/'; if (e.length > this.maxLength) return !1; if (!this.stat && _(this.cache, n)) { var t = this.cache[n]; if (Array.isArray(t) && (t = 'DIR'), !o || t === 'DIR') return t; if (o && t === 'FILE') return !1; } let r = this.statCache[n]; if (!r) { let s; try { s = a.lstatSync(n); } catch (e) { if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return this.statCache[n] = !1, !1; } if (s && s.isSymbolicLink()) try { r = a.statSync(n); } catch (e) { r = s; } else r = s; } this.statCache[n] = r; var t = !0; return r && (t = r.isDirectory() ? 'DIR' : 'FILE'), this.cache[n] = this.cache[n] || t, o && t === 'FILE' ? !1 : t;
  }, r.prototype._mark = function (e) { return g.mark(this, e); }, r.prototype._makeAbs = function (e) { return g.makeAbs(this, e); };
},
'./node_modules/inflight/inflight.js': function (e, n, o) {
  function t(e) {
    return i(function n() {
      let o = s[e],
        t = o.length,
        a = r(arguments); try { for (let l = 0; l < t; l++)o[l].apply(null, a); } finally { o.length > t ? (o.splice(0, t), process.nextTick(() => { n(...a); })) : delete s[e]; }
    });
  } function r(e) { for (var n = e.length, o = [], t = 0; t < n; t++)o[t] = e[t]; return o; } var a = o('./node_modules/wrappy/wrappy.js'),
    s = Object.create(null),
    i = o('./node_modules/once/once.js'); e.exports = a((e, n) => (s[e] ? (s[e].push(n), null) : (s[e] = [n], t(e))));
},
'./node_modules/inherits/inherits.js': function (e, n, o) { try { const t = o('util'); if (typeof t.inherits !== 'function') throw ''; e.exports = t.inherits; } catch (n) { e.exports = o('./node_modules/inherits/inherits_browser.js'); } },
'./node_modules/inherits/inherits_browser.js': function (e) { e.exports = typeof Object.create === 'function' ? function (e, n) { e.super_ = n, e.prototype = Object.create(n.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }); } : function (e, n) { e.super_ = n; const o = function () {}; o.prototype = n.prototype, e.prototype = new o(), e.prototype.constructor = e; }; },
'./node_modules/minimatch/minimatch.js': function (e, n, o) {
  function t(e, n) { e = e || {}, n = n || {}; const o = {}; return Object.keys(n).forEach((e) => { o[e] = n[e]; }), Object.keys(e).forEach((n) => { o[n] = e[n]; }), o; } function r(e, n, o) { if (typeof n !== 'string') throw new TypeError('glob pattern string required'); return o || (o = {}), (o.nocomment || n.charAt(0) !== '#') && (n.trim() === '' ? e === '' : new a(n, o).match(e)); } function a(e, n) { if (!(this instanceof a)) return new a(e, n); if (typeof e !== 'string') throw new TypeError('glob pattern string required'); n || (n = {}), e = e.trim(), d.sep !== '/' && (e = e.split(d.sep).join('/')), this.options = n, this.set = [], this.pattern = e, this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.make(); } function s(e, n) { if (n || (this instanceof a ? n = this.options : n = {}), e = typeof e === 'undefined' ? this.pattern : e, typeof e === 'undefined') throw new TypeError('undefined pattern'); return n.nobrace || !e.match(/\{.*\}/) ? [e] : c(e); } function l(e) { return e.replace(/\\(.)/g, '$1'); } function i(e) { return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); }e.exports = r, r.Minimatch = a; var d = { sep: '/' }; try { d = o('path'); } catch (e) {} var u = r.GLOBSTAR = a.GLOBSTAR = {},
    c = o('./node_modules/brace-expansion/index.js'),
    p = { '!': { open: '(?:(?!(?:', close: '))[^/]*?)' }, '?': { open: '(?:', close: ')?' }, '+': { open: '(?:', close: ')+' }, '*': { open: '(?:', close: ')*' }, '@': { open: '(?:', close: ')' } },
    m = '[^/]',
    g = `${m}*?`,
    h = (function (e) { return e.split('').reduce((e, n) => e[n] = !0, e, {}); }('().*{}+?[]^$\\!')),
    E = /\/+/; r.filter = function (e, n) { return n = n || {}, function (o) { return r(o, e, n); }; }, r.defaults = function (e) {
    if (!e || !Object.keys(e).length) return r; let n = r,
      o = function (o, r, a) { return n.minimatch(o, r, t(e, a)); }; return o.Minimatch = function (o, r) { return new n.Minimatch(o, t(e, r)); }, o;
  }, a.defaults = function (e) { return e && Object.keys(e).length ? r.defaults(e).Minimatch : a; }, a.prototype.debug = function () {}, a.prototype.make = function () {
    if (!this._made) {
      let e = this.pattern,
        n = this.options; if (!n.nocomment && e.charAt(0) === '#') return void (this.comment = !0); if (!e) return void (this.empty = !0); this.parseNegate(); let o = this.globSet = this.braceExpand(); n.debug && (this.debug = console.error), this.debug(this.pattern, o), o = this.globParts = o.map((e) => e.split(E)), this.debug(this.pattern, o), o = o.map(function (e) { return e.map(this.parse, this); }, this), this.debug(this.pattern, o), o = o.filter((e) => e.indexOf(!1) === -1), this.debug(this.pattern, o), this.set = o;
    }
  }, a.prototype.parseNegate = function () {
    let e = this.pattern,
      n = !1,
      o = this.options,
      t = 0; if (!o.nonegate) { for (let r = 0, a = e.length; r < a && e.charAt(r) === '!'; r++)n = !n, t++; t && (this.pattern = e.substr(t)), this.negate = n; }
  }, r.braceExpand = function (e, n) { return s(e, n); }, a.prototype.braceExpand = s, a.prototype.parse = function (e, o) {
    function r() { s && (s === '*' ? (c += g, E = !0) : s === '?' ? (c += m, E = !0) : c += `\\${s}`, C.debug('clearStateChar %j %j', s, c), s = !1); } if (e.length > 65536) throw new TypeError('pattern is too long'); const a = this.options; if (!a.noglobstar && e === '**') return u; if (e === '') return ''; for (var s, d, c = '', E = !!a.nocase, _ = !1, y = [], b = [], S = !1, R = -1, A = -1, O = e.charAt(0) === '.' ? '' : a.dot ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)', C = this, L = 0, i = e.length; L < i && (d = e.charAt(L)); L++) { if (this.debug('%s\t%s %s %j', e, L, c, d), _ && h[d]) { c += `\\${d}`, _ = !1; continue; } switch (d) { case '/': return !1; case '\\': r(), _ = !0; continue; case '?': case '*': case '+': case '@': case '!': if (this.debug('%s\t%s %s %j <-- stateChar', e, L, c, d), S) { this.debug('  in class'), d === '!' && L === A + 1 && (d = '^'), c += d; continue; }C.debug('call clearStateChar %j', s), r(), s = d, a.noext && r(); continue; case '(': if (S) { c += '('; continue; } if (!s) { c += '\\('; continue; }y.push({ type: s, start: L - 1, reStart: c.length, open: p[s].open, close: p[s].close }), c += s === '!' ? '(?:(?!(?:' : '(?:', this.debug('plType %j %j', s, c), s = !1; continue; case ')': if (S || !y.length) { c += '\\)'; continue; }r(), E = !0; var I = y.pop(); c += I.close, I.type === '!' && b.push(I), I.reEnd = c.length; continue; case '|': if (S || !y.length || _) { c += '\\|', _ = !1; continue; }r(), c += '|'; continue; case '[': if (r(), S) { c += `\\${d}`; continue; }S = !0, A = L, R = c.length, c += d; continue; case ']': if (L === A + 1 || !S) { c += `\\${d}`, _ = !1; continue; } if (S) { var N = e.substring(A + 1, L); try { RegExp(`[${N}]`); } catch (e) { var x = this.parse(N, f); c = `${c.substr(0, R)}\\[${x[0]}\\]`, E = E || x[1], S = !1; continue; } }E = !0, S = !1, c += d; continue; default: r(), _ ? _ = !1 : h[d] && !(d === '^' && S) && (c += '\\'), c += d; } } for (S && (N = e.substr(A + 1), x = this.parse(N, f), c = `${c.substr(0, R)}\\[${x[0]}`, E = E || x[1]), I = y.pop(); I; I = y.pop()) { let v = c.slice(I.reStart + I.open.length); this.debug('setting tail', c, I), v = v.replace(/((?:\\{2}){0,64})(\\?)\|/g, (e, n, o) => o || (o = '\\'), `${n + n + o}|`), this.debug('tail=%j\n   %s', v, v, I, c); const j = I.type === '*' ? g : I.type === '?' ? m : `\\${I.type}`; E = !0, c = `${c.slice(0, I.reStart) + j}\\(${v}`; }r(), _ && (c += '\\\\'); let t = !1; switch (c.charAt(0)) { case '.': case '[': case '(': t = !0; } for (let T = b.length - 1; T > -1; T--) {
      let n = b[T],
        M = c.slice(0, n.reStart),
        k = c.slice(n.reStart, n.reEnd - 8),
        D = c.slice(n.reEnd - 8, n.reEnd),
        w = c.slice(n.reEnd); D += w; let P = M.split('(').length - 1,
        G = w; for (L = 0; L < P; L++)G = G.replace(/\)[+*?]?/, ''); w = G; let F = ''; w === '' && o !== f && (F = '$'); const U = M + k + w + F + D; c = U;
    } if (c !== '' && E && (c = `(?=.)${c}`), t && (c = O + c), o === f) return [c, E]; if (!E) return l(e); const B = a.nocase ? 'i' : ''; try { var X = new RegExp(`^${c}$`, B); } catch (e) { return /$./; } return X._glob = e, X._src = c, X;
  }; var f = {}; r.makeRe = function (e, n) { return new a(e, n || {}).makeRe(); }, a.prototype.makeRe = function () {
    if (this.regexp || !1 === this.regexp) return this.regexp; const e = this.set; if (!e.length) return this.regexp = !1, this.regexp; let n = this.options,
      o = n.noglobstar ? g : n.dot ? '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?' : '(?:(?!(?:\\/|^)\\.).)*?',
      t = n.nocase ? 'i' : '',
      r = e.map((e) => e.map((e) => (e === u ? o : typeof e === 'string' ? i(e) : e._src)).join('\\/')).join('|'); r = `^(?:${r})$`, this.negate && (r = `^(?!${r}).*$`); try { this.regexp = new RegExp(r, t); } catch (e) { this.regexp = !1; } return this.regexp;
  }, r.match = function (e, n, o) { o = o || {}; const t = new a(n, o); return e = e.filter((e) => t.match(e)), t.options.nonull && !e.length && e.push(n), e; }, a.prototype.match = function (e, n) {
    if (this.debug('match', e, this.pattern), this.comment) return !1; if (this.empty) return e === ''; if (e === '/' && n) return !0; const o = this.options; d.sep !== '/' && (e = e.split(d.sep).join('/')), e = e.split(E), this.debug(this.pattern, 'split', e); const t = this.set; this.debug(this.pattern, 'set', t); let r,
      a; for (a = e.length - 1; a >= 0 && (r = e[a], !r); a--);for (a = 0; a < t.length; a++) {
      let s = t[a],
        i = e; o.matchBase && s.length === 1 && (i = [r]); const l = this.matchOne(i, s, n); if (l) return !!o.flipNegate || !this.negate;
    } return !o.flipNegate && this.negate;
  }, a.prototype.matchOne = function (e, n, o) {
    const t = this.options; this.debug('matchOne', { this: this, file: e, pattern: n }), this.debug('matchOne', e.length, n.length); for (var r = 0, a = 0, s = e.length, i = n.length; r < s && a < i; r++, a++) {
      this.debug('matchOne loop'); let l = n[a],
        d = e[r]; if (this.debug(n, l, d), !1 === l) return !1; if (l === u) {
        this.debug('GLOBSTAR', [n, l, d]); let c = r,
          m = a + 1; if (m === i) { for (this.debug('** at the end'); r < s; r++) if (e[r] === '.' || e[r] === '..' || !t.dot && e[r].charAt(0) === '.') return !1; return !0; } for (;c < s;) { const g = e[c]; if (this.debug('\nglobstar while', e, c, n, m, g), this.matchOne(e.slice(c), n.slice(m), o)) return this.debug('globstar found match!', c, s, g), !0; if (g === '.' || g === '..' || !t.dot && g.charAt(0) === '.') { this.debug('dot detected!', e, c, n, m); break; } this.debug('globstar swallow a segment, and continue'), c++; } return o && (this.debug('\n>>> no match, partial?', e, c, n, m), c === s);
      } var h; if (typeof l === 'string' ? (h = t.nocase ? d.toLowerCase() === l.toLowerCase() : d === l, this.debug('string match', l, d, h)) : (h = d.match(l), this.debug('pattern match', l, d, h)), !h) return !1;
    } if (r === s && a === i) return !0; if (r === s) return o; if (a === i) { const f = r === s - 1 && e[r] === ''; return f; } throw new Error('wtf?');
  };
},
'./node_modules/once/once.js': function (e, n, o) {
  function t(e) { var n = function () { return n.called ? n.value : (n.called = !0, n.value = e.apply(this, arguments)); }; return n.called = !1, n; } function r(e) {
    var n = function () { if (n.called) throw new Error(n.onceError); return n.called = !0, n.value = e.apply(this, arguments); },
      o = e.name || 'Function wrapped with `once`'; return n.onceError = `${o} shouldn't be called more than once`, n.called = !1, n;
  } const a = o('./node_modules/wrappy/wrappy.js'); e.exports = a(t), e.exports.strict = a(r), t.proto = t(() => { Object.defineProperty(Function.prototype, 'once', { value() { return t(this); }, configurable: !0 }), Object.defineProperty(Function.prototype, 'onceStrict', { value() { return r(this); }, configurable: !0 }); });
},
'./node_modules/path-is-absolute/index.js': function (e) {
  function n(e) { return e.charAt(0) === '/'; } function o(e) {
    let n = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/,
      o = n.exec(e),
      t = o[1] || '',
      r = !!(t && t.charAt(1) !== ':'); return !!(o[2] || r);
  }e.exports = process.platform === 'win32' ? o : n, e.exports.posix = n, e.exports.win32 = o;
},
'./node_modules/rimraf/rimraf.js': function (e, n, o) {
  function t(e) { ['unlink', 'chmod', 'stat', 'lstat', 'rmdir', 'readdir'].forEach((n) => { e[n] = e[n] || p[n], n += 'Sync', e[n] = e[n] || p[n]; }), e.maxBusyTries = e.maxBusyTries || 3, e.emfileWait = e.emfileWait || 1e3, !1 === e.glob && (e.disableGlob = !0), e.disableGlob = e.disableGlob || !1, e.glob = e.glob || _; } function r(e, o, r) {
    function s(e) { d = d || e, --c == 0 && r(d); } function i(e, n) { return e ? r(e) : (c = n.length, c === 0 ? r() : void n.forEach((e) => { a(e, o, function n(t) { if (t) { if ((t.code === 'EBUSY' || t.code === 'ENOTEMPTY' || t.code === 'EPERM') && l < o.maxBusyTries) { l++; const r = 100 * l; return setTimeout(() => { a(e, o, n); }, r); } if (t.code === 'EMFILE' && y < o.emfileWait) return setTimeout(() => { a(e, o, n); }, y++); t.code === 'ENOENT' && (t = null); }y = 0, s(t); }); })); } typeof o === 'function' && (r = o, o = {}), g(e, 'rimraf: missing path'), g.equal(typeof e, 'string', 'rimraf: path should be a string'), g.equal(typeof r, 'function', 'rimraf: callback function required'), g(o, 'rimraf: invalid options argument provided'), g.equal(typeof o, 'object', 'rimraf: options should be object'), t(o); var l = 0,
      d = null,
      c = 0; return o.disableGlob || !f.hasMagic(e) ? i(null, [e]) : void o.lstat(e, (n) => (n ? void f(e, o.glob, i) : i(null, [e])));
  } function a(e, n, o) { g(e), g(n), g(typeof o === 'function'), n.lstat(e, (t, r) => (t && t.code === 'ENOENT' ? o(null) : (t && t.code === 'EPERM' && b && s(e, n, t, o), r && r.isDirectory() ? l(e, n, t, o) : void n.unlink(e, (t) => { if (t) { if (t.code === 'ENOENT') return o(null); if (t.code === 'EPERM') return b ? s(e, n, t, o) : l(e, n, t, o); if (t.code === 'EISDIR') return l(e, n, t, o); } return o(t); })))); } function s(e, n, o, t) { g(e), g(n), g(typeof t === 'function'), o && g(o instanceof Error), n.chmod(e, E, (r) => { r ? t(r.code === 'ENOENT' ? null : o) : n.stat(e, (r, a) => { r ? t(r.code === 'ENOENT' ? null : o) : a.isDirectory() ? l(e, n, o, t) : n.unlink(e, t); }); }); } function i(e, n, o) { g(e), g(n), o && g(o instanceof Error); try { n.chmodSync(e, E); } catch (e) { if (e.code === 'ENOENT') return; throw o; } try { var t = n.statSync(e); } catch (e) { if (e.code === 'ENOENT') return; throw o; }t.isDirectory() ? u(e, n, o) : n.unlinkSync(e); } function l(e, n, o, t) { g(e), g(n), o && g(o instanceof Error), g(typeof t === 'function'), n.rmdir(e, (r) => { r && (r.code === 'ENOTEMPTY' || r.code === 'EEXIST' || r.code === 'EPERM') ? d(e, n, t) : r && r.code === 'ENOTDIR' ? t(o) : t(r); }); } function d(e, o, t) { g(e), g(o), g(typeof t === 'function'), o.readdir(e, (a, s) => { if (a) return t(a); let i = s.length; if (i === 0) return o.rmdir(e, t); let n; s.forEach((a) => { r(h.join(e, a), o, (r) => (n ? void 0 : r ? t(n = r) : void (--i == 0 && o.rmdir(e, t)))); }); }); } function c(e, n) { n = n || {}, t(n), g(e, 'rimraf: missing path'), g.equal(typeof e, 'string', 'rimraf: path should be a string'), g(n, 'rimraf: missing options'), g.equal(typeof n, 'object', 'rimraf: options should be object'); let o; if (n.disableGlob || !f.hasMagic(e))o = [e]; else try { n.lstatSync(e), o = [e]; } catch (t) { o = f.sync(e, n.glob); } if (o.length) for (var e, r = 0; r < o.length; r++) { e = o[r]; try { var a = n.lstatSync(e); } catch (o) { if (o.code === 'ENOENT') return; o.code === 'EPERM' && b && i(e, n, o); } try { a && a.isDirectory() ? u(e, n, null) : n.unlinkSync(e); } catch (o) { if (o.code === 'ENOENT') return; if (o.code === 'EPERM') return b ? i(e, n, o) : u(e, n, o); if (o.code !== 'EISDIR') throw o; u(e, n, o); } } } function u(e, n, o) { g(e), g(n), o && g(o instanceof Error); try { n.rmdirSync(e); } catch (t) { if (t.code === 'ENOENT') return; if (t.code === 'ENOTDIR') throw o; (t.code === 'ENOTEMPTY' || t.code === 'EEXIST' || t.code === 'EPERM') && m(e, n); } } function m(e, n) {
    g(e), g(n), n.readdirSync(e).forEach((o) => { c(h.join(e, o), n); }); let o = b ? 100 : 1,
      t = 0; do { let r = !0; try { const a = n.rmdirSync(e, n); return r = !1, a; } finally { if (++t < o && r) continue; } } while (!0);
  }e.exports = r, r.sync = c; var g = o('assert'),
    h = o('path'),
    p = o('fs'),
    f = o('./node_modules/glob/glob.js'),
    E = 0o666,
    _ = { nosort: !0, silent: !0 },
    y = 0,
    b = process.platform === 'win32';
},
'./node_modules/semver/semver.js': function (e, n) {
  function o(e, n) { if (e instanceof t) return e; if (typeof e !== 'string') return null; if (e.length > j) return null; const o = n ? M[Q] : M[z]; if (!o.test(e)) return null; try { return new t(e, n); } catch (e) { return null; } } function t(e, n) { if (e instanceof t) { if (e.loose === n) return e; e = e.version; } else if (typeof e !== 'string') throw new TypeError(`Invalid Version: ${e}`); if (e.length > j) throw new TypeError(`version is longer than ${j} characters`); if (!(this instanceof t)) return new t(e, n); v('SemVer', e, n), this.loose = n; const o = e.trim().match(n ? M[Q] : M[z]); if (!o) throw new TypeError(`Invalid Version: ${e}`); if (this.raw = e, this.major = +o[1], this.minor = +o[2], this.patch = +o[3], this.major > T || this.major < 0) throw new TypeError('Invalid major version'); if (this.minor > T || this.minor < 0) throw new TypeError('Invalid minor version'); if (this.patch > T || this.patch < 0) throw new TypeError('Invalid patch version'); this.prerelease = o[4] ? o[4].split('.').map((e) => { if (/^[0-9]+$/.test(e)) { const n = +e; if (n >= 0 && n < T) return n; } return e; }) : [], this.build = o[5] ? o[5].split('.') : [], this.format(); } function r(e, n) {
    let o = i.test(e),
      t = i.test(n); return o && t && (e = +e, n = +n), o && !t ? -1 : t && !o ? 1 : e < n ? -1 : e > n ? 1 : 0;
  } function s(e, n, o) { return new t(e, o).compare(new t(n, o)); } function l(e, n, o) { return s(e, n, o) > 0; } function d(e, n, o) { return s(e, n, o) < 0; } function c(e, n, o) { return s(e, n, o) === 0; } function p(e, n, o) { return s(e, n, o) !== 0; } function u(e, n, o) { return s(e, n, o) >= 0; } function m(e, n, o) { return s(e, n, o) <= 0; } function a(e, n, o, t) { let r; switch (n) { case '===': typeof e === 'object' && (e = e.version), typeof o === 'object' && (o = o.version), r = e === o; break; case '!==': typeof e === 'object' && (e = e.version), typeof o === 'object' && (o = o.version), r = e !== o; break; case '': case '=': case '==': r = c(e, o, t); break; case '!=': r = p(e, o, t); break; case '>': r = l(e, o, t); break; case '>=': r = u(e, o, t); break; case '<': r = d(e, o, t); break; case '<=': r = m(e, o, t); break; default: throw new TypeError(`Invalid operator: ${n}`); } return r; } function g(e, n) { if (e instanceof g) { if (e.loose === n) return e; e = e.value; } return this instanceof g ? void (v('comparator', e, n), this.loose = n, this.parse(e), this.value = this.semver === _e ? '' : this.operator + this.semver.version, v('comp', this)) : new g(e, n); } function h(e, n) { if (e instanceof h) return e.loose === n ? e : new h(e.raw, n); if (e instanceof g) return new h(e.value, n); if (!(this instanceof h)) return new h(e, n); if (this.loose = n, this.raw = e, this.set = e.split(/\s*\|\|\s*/).map(function (e) { return this.parseRange(e.trim()); }, this).filter((e) => e.length), !this.set.length) throw new TypeError(`Invalid SemVer Range: ${e}`); this.format(); } function f(e, n) { return v('comp', e), e = b(e, n), v('caret', e), e = _(e, n), v('tildes', e), e = A(e, n), v('xrange', e), e = C(e, n), v('stars', e), e; } function E(e) { return !e || e.toLowerCase() === 'x' || e === '*'; } function _(e, n) { return e.trim().split(/\s+/).map((e) => y(e, n)).join(' '); } function y(e, n) { const o = n ? M[se] : M[ae]; return e.replace(o, (n, o, t, r, a) => { v('tilde', e, n, o, t, r, a); let s; return E(o) ? s = '' : E(t) ? s = `>=${o}.0.0 <${+o + 1}.0.0` : E(r) ? s = `>=${o}.${t}.0 <${o}.${+t + 1}.0` : a ? (v('replaceTilde pr', a), a.charAt(0) !== '-' && (a = `-${a}`), s = `>=${o}.${t}.${r}${a} <${o}.${+t + 1}.0`) : s = `>=${o}.${t}.${r} <${o}.${+t + 1}.0`, v('tilde return', s), s; }); } function b(e, n) { return e.trim().split(/\s+/).map((e) => S(e, n)).join(' '); } function S(e, n) { v('caret', e, n); const o = n ? M[ce] : M[de]; return e.replace(o, (n, o, t, r, a) => { v('caret', e, n, o, t, r, a); let s; return E(o) ? s = '' : E(t) ? s = `>=${o}.0.0 <${+o + 1}.0.0` : E(r) ? o === '0' ? s = `>=${o}.${t}.0 <${o}.${+t + 1}.0` : s = `>=${o}.${t}.0 <${+o + 1}.0.0` : a ? (v('replaceCaret pr', a), a.charAt(0) !== '-' && (a = `-${a}`), s = o === '0' ? t === '0' ? `>=${o}.${t}.${r}${a} <${o}.${t}.${+r + 1}` : `>=${o}.${t}.${r}${a} <${o}.${+t + 1}.0` : `>=${o}.${t}.${r}${a} <${+o + 1}.0.0`) : (v('no pr'), s = o === '0' ? t === '0' ? `>=${o}.${t}.${r} <${o}.${t}.${+r + 1}` : `>=${o}.${t}.${r} <${o}.${+t + 1}.0` : `>=${o}.${t}.${r} <${+o + 1}.0.0`), v('caret return', s), s; }); } function A(e, n) { return v('replaceXRanges', e, n), e.split(/\s+/).map((e) => O(e, n)).join(' '); } function O(e, n) {
    e = e.trim(); const o = n ? M[oe] : M[ne]; return e.replace(o, (n, o, t, r, a, s) => {
      v('xRange', e, n, o, t, r, a, s); let i = E(t),
        l = i || E(r),
        d = l || E(a),
        c = d; return o === '=' && c && (o = ''), i ? o === '>' || o === '<' ? n = '<0.0.0' : n = '*' : o && c ? (l && (r = 0), d && (a = 0), o === '>' ? (o = '>=', l ? (t = +t + 1, r = 0, a = 0) : d && (r = +r + 1, a = 0)) : o === '<=' && (o = '<', l ? t = +t + 1 : r = +r + 1), n = `${o + t}.${r}.${a}`) : l ? n = `>=${t}.0.0 <${+t + 1}.0.0` : d && (n = `>=${t}.${r}.0 <${t}.${+r + 1}.0`), v('xRange return', n), n;
    });
  } function C(e, n) { return v('replaceStars', e, n), e.trim().replace(M[fe], ''); } function L(e, n, o, t, r, a, s, i, l, d, c, p) { return n = E(o) ? '' : E(t) ? `>=${o}.0.0` : E(r) ? `>=${o}.${t}.0` : `>=${n}`, i = E(l) ? '' : E(d) ? `<${+l + 1}.0.0` : E(c) ? `<${l}.${+d + 1}.0` : p ? `<=${l}.${d}.${c}-${p}` : `<=${i}`, (`${n} ${i}`).trim(); } function I(e, n) { for (var o = 0; o < e.length; o++) if (!e[o].test(n)) return !1; if (n.prerelease.length) { for (var o = 0; o < e.length; o++) if (v(e[o].semver), e[o].semver !== _e && e[o].semver.prerelease.length > 0) { const t = e[o].semver; if (t.major === n.major && t.minor === n.minor && t.patch === n.patch) return !0; } return !1; } return !0; } function N(e, n, o) { try { n = new h(n, o); } catch (e) { return !1; } return n.test(e); } function x(e, n, o, r) {
    e = new t(e, r), n = new h(n, r); let a,
      s,
      c,
      p,
      f; switch (o) { case '>': a = l, s = m, c = d, p = '>', f = '>='; break; case '<': a = d, s = u, c = l, p = '<', f = '<='; break; default: throw new TypeError('Must provide a hilo val of "<" or ">"'); } if (N(e, n, r)) return !1; for (let E = 0; E < n.set.length; ++E) {
      var i = n.set[E],
        _ = null,
        y = null; if (i.forEach((e) => { e.semver === _e && (e = new g('>=0.0.0')), _ = _ || e, y = y || e, a(e.semver, _.semver, r) ? _ = e : c(e.semver, y.semver, r) && (y = e); }), _.operator === p || _.operator === f) return !1; if ((!y.operator || y.operator === p) && s(e, y.semver)) return !1; if (y.operator === f && c(e, y.semver)) return !1;
    } return !0;
  }n = e.exports = t; let v; v = typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? function () { const e = Array.prototype.slice.call(arguments, 0); e.unshift('SEMVER'), console.log(...e); } : function () {}, n.SEMVER_SPEC_VERSION = '2.0.0'; var j = 256,
    T = Number.MAX_SAFE_INTEGER || 9007199254740991,
    M = n.re = [],
    k = n.src = [],
    D = 0,
    R = D++; k[R] = '0|[1-9]\\d*'; const w = D++; k[w] = '[0-9]+'; const P = D++; k[P] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'; const G = D++; k[G] = `(${k[R]})\\.(${k[R]})\\.(${k[R]})`; const F = D++; k[F] = `(${k[w]})\\.(${k[w]})\\.(${k[w]})`; const U = D++; k[U] = `(?:${k[R]}|${k[P]})`; const B = D++; k[B] = `(?:${k[w]}|${k[P]})`; const X = D++; k[X] = `(?:-(${k[U]}(?:\\.${k[U]})*))`; const $ = D++; k[$] = `(?:-?(${k[B]}(?:\\.${k[B]})*))`; const q = D++; k[q] = '[0-9A-Za-z-]+'; const V = D++; k[V] = `(?:\\+(${k[q]}(?:\\.${k[q]})*))`; var z = D++,
    W = `v?${k[G]}${k[X]}?${k[V]}?`; k[z] = `^${W}$`; var H = `[v=\\s]*${k[F]}${k[$]}?${k[V]}?`,
    Q = D++; k[Q] = `^${H}$`; const Y = D++; k[Y] = '((?:<|>)?=?)'; const J = D++; k[J] = `${k[w]}|x|X|\\*`; const Z = D++; k[Z] = `${k[R]}|x|X|\\*`; const K = D++; k[K] = `[v=\\s]*(${k[Z]})(?:\\.(${k[Z]})(?:\\.(${k[Z]})(?:${k[X]})?${k[V]}?)?)?`; const ee = D++; k[ee] = `[v=\\s]*(${k[J]})(?:\\.(${k[J]})(?:\\.(${k[J]})(?:${k[$]})?${k[V]}?)?)?`; var ne = D++; k[ne] = `^${k[Y]}\\s*${k[K]}$`; var oe = D++; k[oe] = `^${k[Y]}\\s*${k[ee]}$`; const te = D++; k[te] = '(?:~>?)'; const re = D++; k[re] = `(\\s*)${k[te]}\\s+`, M[re] = new RegExp(k[re], 'g'); var ae = D++; k[ae] = `^${k[te]}${k[K]}$`; var se = D++; k[se] = `^${k[te]}${k[ee]}$`; const ie = D++; k[ie] = '(?:\\^)'; const le = D++; k[le] = `(\\s*)${k[ie]}\\s+`, M[le] = new RegExp(k[le], 'g'); var de = D++; k[de] = `^${k[ie]}${k[K]}$`; var ce = D++; k[ce] = `^${k[ie]}${k[ee]}$`; const pe = D++; k[pe] = `^${k[Y]}\\s*(${H})$|^$`; const ue = D++; k[ue] = `^${k[Y]}\\s*(${W})$|^$`; const me = D++; k[me] = `(\\s*)${k[Y]}\\s*(${H}|${k[K]})`, M[me] = new RegExp(k[me], 'g'); const ge = D++; k[ge] = `^\\s*(${k[K]})\\s+-\\s+(${k[K]})\\s*$`; const he = D++; k[he] = `^\\s*(${k[ee]})\\s+-\\s+(${k[ee]})\\s*$`; var fe = D++; k[fe] = '(<|>)?=?\\s*\\*'; for (let Ee = 0; Ee < D; Ee++)v(Ee, k[Ee]), M[Ee] || (M[Ee] = new RegExp(k[Ee])); n.parse = o, n.valid = function (e, n) { const t = o(e, n); return t ? t.version : null; }, n.clean = function (e, n) { const t = o(e.trim().replace(/^[=v]+/, ''), n); return t ? t.version : null; }, n.SemVer = t, t.prototype.format = function () { return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join('.')}`), this.version; }, t.prototype.toString = function () { return this.version; }, t.prototype.compare = function (e) { return v('SemVer.compare', this.version, this.loose, e), e instanceof t || (e = new t(e, this.loose)), this.compareMain(e) || this.comparePre(e); }, t.prototype.compareMain = function (e) { return e instanceof t || (e = new t(e, this.loose)), r(this.major, e.major) || r(this.minor, e.minor) || r(this.patch, e.patch); }, t.prototype.comparePre = function (e) {
    if (e instanceof t || (e = new t(e, this.loose)), this.prerelease.length && !e.prerelease.length) return -1; if (!this.prerelease.length && e.prerelease.length) return 1; if (!this.prerelease.length && !e.prerelease.length) return 0; let n = 0; do {
      let o = this.prerelease[n],
        a = e.prerelease[n]; if (v('prerelease compare', n, o, a), void 0 === o && void 0 === a) return 0; if (void 0 === a) return 1; if (void 0 === o) return -1; if (o === a) continue; else return r(o, a);
    } while (++n);
  }, t.prototype.inc = function (e, n) { switch (e) { case 'premajor': this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc('pre', n); break; case 'preminor': this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc('pre', n); break; case 'prepatch': this.prerelease.length = 0, this.inc('patch', n), this.inc('pre', n); break; case 'prerelease': this.prerelease.length === 0 && this.inc('patch', n), this.inc('pre', n); break; case 'major': (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = []; break; case 'minor': (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = []; break; case 'patch': this.prerelease.length === 0 && this.patch++, this.prerelease = []; break; case 'pre': if (this.prerelease.length === 0) this.prerelease = [0]; else { for (var o = this.prerelease.length; --o >= 0;) typeof this.prerelease[o] === 'number' && (this.prerelease[o]++, o = -2); o === -1 && this.prerelease.push(0); }n && (this.prerelease[0] === n ? isNaN(this.prerelease[1]) && (this.prerelease = [n, 0]) : this.prerelease = [n, 0]); break; default: throw new Error(`invalid increment argument: ${e}`); } return this.format(), this.raw = this.version, this; }, n.inc = function (e, n, o, r) { typeof o === 'string' && (r = o, o = void 0); try { return new t(e, o).inc(n, r).version; } catch (e) { return null; } }, n.diff = function (e, n) {
    if (c(e, n)) return null; let t = o(e),
      r = o(n); if (t.prerelease.length || r.prerelease.length) { for (var a in t) if ((a == 'major' || a == 'minor' || a == 'patch') && t[a] !== r[a]) return `pre${a}`; return 'prerelease'; } for (var a in t) if ((a == 'major' || a == 'minor' || a == 'patch') && t[a] !== r[a]) return a;
  }, n.compareIdentifiers = r; var i = /^[0-9]+$/; n.rcompareIdentifiers = function (e, n) { return r(n, e); }, n.major = function (e, n) { return new t(e, n).major; }, n.minor = function (e, n) { return new t(e, n).minor; }, n.patch = function (e, n) { return new t(e, n).patch; }, n.compare = s, n.compareLoose = function (e, n) { return s(e, n, !0); }, n.rcompare = function (e, n, o) { return s(n, e, o); }, n.sort = function (e, o) { return e.sort((e, t) => n.compare(e, t, o)); }, n.rsort = function (e, o) { return e.sort((e, t) => n.rcompare(e, t, o)); }, n.gt = l, n.lt = d, n.eq = c, n.neq = p, n.gte = u, n.lte = m, n.cmp = a, n.Comparator = g; var _e = {}; g.prototype.parse = function (e) {
    let n = this.loose ? M[pe] : M[ue],
      o = e.match(n); if (!o) throw new TypeError(`Invalid comparator: ${e}`); this.operator = o[1], this.operator === '=' && (this.operator = ''), this.semver = o[2] ? new t(o[2], this.loose) : _e;
  }, g.prototype.toString = function () { return this.value; }, g.prototype.test = function (e) { return (v('Comparator.test', e, this.loose), this.semver === _e) || (typeof e === 'string' && (e = new t(e, this.loose)), a(e, this.operator, this.semver, this.loose)); }, g.prototype.intersects = function (e, n) {
    if (!(e instanceof g)) throw new TypeError('a Comparator is required'); let o; if (this.operator === '') return o = new h(e.value, n), N(this.value, o, n); if (e.operator === '') return o = new h(this.value, n), N(e.semver, o, n); let t = (this.operator === '>=' || this.operator === '>') && (e.operator === '>=' || e.operator === '>'),
      r = (this.operator === '<=' || this.operator === '<') && (e.operator === '<=' || e.operator === '<'),
      s = this.semver.version === e.semver.version,
      i = (this.operator === '>=' || this.operator === '<=') && (e.operator === '>=' || e.operator === '<='),
      l = a(this.semver, '<', e.semver, n) && (this.operator === '>=' || this.operator === '>') && (e.operator === '<=' || e.operator === '<'),
      d = a(this.semver, '>', e.semver, n) && (this.operator === '<=' || this.operator === '<') && (e.operator === '>=' || e.operator === '>'); return t || r || s && i || l || d;
  }, n.Range = h, h.prototype.format = function () { return this.range = this.set.map((e) => e.join(' ').trim()).join('||').trim(), this.range; }, h.prototype.toString = function () { return this.range; }, h.prototype.parseRange = function (e) {
    const n = this.loose; e = e.trim(), v('range', e, n); const o = n ? M[he] : M[ge]; e = e.replace(o, L), v('hyphen replace', e), e = e.replace(M[me], '$1$2$3'), v('comparator trim', e, M[me]), e = e.replace(M[re], '$1~'), e = e.replace(M[le], '$1^'), e = e.split(/\s+/).join(' '); let t = n ? M[pe] : M[ue],
      r = e.split(' ').map((e) => f(e, n)).join(' ').split(/\s+/); return this.loose && (r = r.filter((e) => !!e.match(t))), r = r.map((e) => new g(e, n)), r;
  }, h.prototype.intersects = function (e, n) { if (!(e instanceof h)) throw new TypeError('a Range is required'); return this.set.some((o) => o.every((o) => e.set.some((e) => e.every((e) => o.intersects(e, n))))); }, n.toComparators = function (e, n) { return new h(e, n).set.map((e) => e.map((e) => e.value).join(' ').trim().split(' ')); }, h.prototype.test = function (e) { if (!e) return !1; typeof e === 'string' && (e = new t(e, this.loose)); for (let n = 0; n < this.set.length; n++) if (I(this.set[n], e)) return !0; return !1; }, n.satisfies = N, n.maxSatisfying = function (e, n, o) {
    let r = null,
      a = null; try { var s = new h(n, o); } catch (e) { return null; } return e.forEach((e) => { s.test(e) && (!r || a.compare(e) === -1) && (r = e, a = new t(r, o)); }), r;
  }, n.minSatisfying = function (e, n, o) {
    let r = null,
      a = null; try { var s = new h(n, o); } catch (e) { return null; } return e.forEach((e) => { s.test(e) && (!r || a.compare(e) === 1) && (r = e, a = new t(r, o)); }), r;
  }, n.validRange = function (e, n) { try { return new h(e, n).range || '*'; } catch (e) { return null; } }, n.ltr = function (e, n, o) { return x(e, n, '<', o); }, n.gtr = function (e, n, o) { return x(e, n, '>', o); }, n.outside = x, n.prerelease = function (e, n) { const t = o(e, n); return t && t.prerelease.length ? t.prerelease : null; }, n.intersects = function (e, n, o) { return e = new h(e, o), n = new h(n, o), e.intersects(n); };
},
'./node_modules/source-map-support/source-map-support.js': function (e, n, o) {
  function t() { return A == 'browser' || A != 'node' && typeof window !== 'undefined' && typeof XMLHttpRequest === 'function' && !(window.require && window.module && window.process && window.process.type === 'renderer'); } function r() { return typeof process === 'object' && process !== null && typeof process.on === 'function'; } function a(e) { return function (n) { for (var o, t = 0; t < e.length; t++) if (o = e[t](n), o) return o; return null; }; } function s(e, n) {
    if (!e) return n; let o = y.dirname(e),
      t = /^\w+:\/\/[^\/]*/.exec(o),
      r = t ? t[0] : ''; return r + y.resolve(o.slice(r.length), n);
  } function i(e) { let n; if (t()) try { const o = new XMLHttpRequest(); o.open('GET', e, !1), o.send(null), n = o.readyState === 4 ? o.responseText : null; const r = o.getResponseHeader('SourceMap') || o.getResponseHeader('X-SourceMap'); if (r) return r; } catch (n) {}n = x(e); for (var a, s, i = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg; s = i.exec(n);)a = s; return a ? a[1] : null; } function l(e) { let n = C[e.source]; if (!n) { const o = v(e.source); o ? (n = C[e.source] = { url: o.url, map: new _(o.map) }, n.map.sourcesContent && n.map.sources.forEach((e, o) => { const t = n.map.sourcesContent[o]; if (t) { const r = s(n.url, e); O[r] = t; } })) : n = C[e.source] = { url: null, map: null }; } if (n && n.map) { const t = n.map.originalPositionFor(e); if (t.source !== null) return t.source = s(n.url, t.source), t; } return e; } function d(e) { let n = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(e); if (n) { const o = l({ source: n[2], line: +n[3], column: n[4] - 1 }); return `eval at ${n[1]} (${o.source}:${o.line}:${o.column + 1})`; } return n = /^eval at ([^(]+) \((.+)\)$/.exec(e), n ? `eval at ${n[1]} (${d(n[2])})` : e; } function c() {
    let e,
      n = ''; if (this.isNative())n = 'native'; else { e = this.getScriptNameOrSourceURL(), !e && this.isEval() && (n = this.getEvalOrigin(), n += ', '), n += e || '<anonymous>'; const o = this.getLineNumber(); if (o != null) { n += `:${o}`; const t = this.getColumnNumber(); t && (n += `:${t}`); } } let r = '',
      a = this.getFunctionName(),
      s = !0,
      i = this.isConstructor(),
      l = !(this.isToplevel() || i); if (l) { let d = this.getTypeName(); d === '[object Object]' && (d = 'null'); const c = this.getMethodName(); a ? (d && a.indexOf(d) != 0 && (r += `${d}.`), r += a, c && a.indexOf(`.${c}`) != a.length - c.length - 1 && (r += ` [as ${c}]`)) : r += `${d}.${c || '<anonymous>'}`; } else i ? r += `new ${a || '<anonymous>'}` : a ? r += a : (r += n, s = !1); return s && (r += ` (${n})`), r;
  } function p(e) { const n = {}; return Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach((o) => { n[o] = /^(?:is|get)/.test(o) ? function () { return e[o].call(e); } : e[o]; }), n.toString = c, n; } function u(e) {
    if (e.isNative()) return e; const n = e.getFileName() || e.getScriptNameOrSourceURL(); if (n) {
      let o = e.getLineNumber(),
        r = e.getColumnNumber() - 1,
        a = 62; o !== 1 || !(r > a) || t() || e.isEval() || (r -= a); const s = l({ source: n, line: o, column: r }); return e = p(e), e.getFileName = function () { return s.source; }, e.getLineNumber = function () { return s.line; }, e.getColumnNumber = function () { return s.column + 1; }, e.getScriptNameOrSourceURL = function () { return s.source; }, e;
    } let i = e.isEval() && e.getEvalOrigin(); return i ? (i = d(i), e = p(e), e.getEvalOrigin = function () { return i; }, e) : e;
  } function m(e, n) { return R && (O = {}, C = {}), e + n.map((e) => `\n    at ${u(e)}`).join(''); } function g(e) {
    const n = /\n {4}at [^(]+ \((.*):(\d+):(\d+)\)/.exec(e.stack); if (n) {
      let o = n[1],
        t = +n[2],
        r = +n[3],
        a = O[o]; if (!a && E && E.existsSync(o)) try { a = E.readFileSync(o, 'utf8'); } catch (e) { a = ''; } if (a) { const s = a.split(/(?:\r\n|\r|\n)/)[t - 1]; if (s) return `${o}:${t}\n${s}\n${Array(r).join(' ')}^`; }
    } return null;
  } function h(e) { const n = g(e); n && (console.error(), console.error(n)), console.error(e.stack), process.exit(1); } function f() {
    const e = process.emit; process.emit = function (n) {
      if (n === 'uncaughtException') {
        let o = arguments[1] && arguments[1].stack,
          t = this.listeners(n).length > 0; if (o && !t) return h(arguments[1]);
      } return e.apply(this, arguments);
    };
  } var E,
    _ = o('./node_modules/source-map/source-map.js').SourceMapConsumer,
    y = o('path'); try { E = o('fs'), E.existsSync && E.readFileSync || (E = null); } catch (e) {} var b = !1,
    S = !1,
    R = !1,
    A = 'auto',
    O = {},
    C = {},
    L = /^data:application\/json[^,]+base64,/,
    I = [],
    N = [],
    x = a(I); I.push((e) => { if (e = e.trim(), e in O) return O[e]; var n = null; if (!E) { const o = new XMLHttpRequest(); o.open('GET', e, !1), o.send(null); var n = null; o.readyState === 4 && o.status === 200 && (n = o.responseText); } else if (E.existsSync(e)) try { n = E.readFileSync(e, 'utf8'); } catch (e) { n = ''; } return O[e] = n; }); var v = a(N); N.push((e) => { let n = i(e); if (!n) return null; let o; if (L.test(n)) { const t = n.slice(n.indexOf(',') + 1); o = new Buffer(t, 'base64').toString(), n = e; } else n = s(e, n), o = x(n); return o ? { url: n, map: o } : null; }), n.wrapCallSite = u, n.getErrorSource = g, n.mapSourcePosition = l, n.retrieveSourceMap = v, n.install = function (e) { if (e = e || {}, e.environment && (A = e.environment, ['node', 'browser', 'auto'].indexOf(A) === -1)) throw new Error(`environment ${A} was unknown. Available options are {auto, browser, node}`); if (e.retrieveFile && (e.overrideRetrieveFile && (I.length = 0), I.unshift(e.retrieveFile)), e.retrieveSourceMap && (e.overrideRetrieveSourceMap && (N.length = 0), N.unshift(e.retrieveSourceMap)), e.hookRequire && !t()) { let n; try { n = o('module'); } catch (e) {} const a = n.prototype._compile; a.__sourceMapSupport || (n.prototype._compile = function (e, n) { return O[n] = e, C[n] = void 0, a.call(this, e, n); }, n.prototype._compile.__sourceMapSupport = !0); } if (R || (R = !!('emptyCacheBetweenOperations' in e) && e.emptyCacheBetweenOperations), b || (b = !0, Error.prepareStackTrace = m), !S) { const s = !('handleUncaughtExceptions' in e) || e.handleUncaughtExceptions; s && r() && (S = !0, f()); } };
},
'./node_modules/source-map/lib/array-set.js': function (e, n, o) {
  function t() { this._array = [], this._set = s ? new Map() : Object.create(null); } var r = o('./node_modules/source-map/lib/util.js'),
    a = Object.prototype.hasOwnProperty,
    s = typeof Map !== 'undefined'; t.fromArray = function (e, n) { for (var o = new t(), r = 0, a = e.length; r < a; r++)o.add(e[r], n); return o; }, t.prototype.size = function () { return s ? this._set.size : Object.getOwnPropertyNames(this._set).length; }, t.prototype.add = function (e, n) {
    let o = s ? e : r.toSetString(e),
      t = s ? this.has(e) : a.call(this._set, o),
      i = this._array.length; (!t || n) && this._array.push(e), t || (s ? this._set.set(e, i) : this._set[o] = i);
  }, t.prototype.has = function (e) { if (s) return this._set.has(e); const n = r.toSetString(e); return a.call(this._set, n); }, t.prototype.indexOf = function (e) { if (s) { const n = this._set.get(e); if (n >= 0) return n; } else { const o = r.toSetString(e); if (a.call(this._set, o)) return this._set[o]; } throw new Error(`"${e}" is not in the set.`); }, t.prototype.at = function (e) { if (e >= 0 && e < this._array.length) return this._array[e]; throw new Error(`No element indexed by ${e}`); }, t.prototype.toArray = function () { return this._array.slice(); }, n.ArraySet = t;
},
'./node_modules/source-map/lib/base64-vlq.js': function (e, n, o) {
  function t(e) { return e < 0 ? (-e << 1) + 1 : (e << 1) + 0; } function r(e) { const n = e >> 1; return (1 & e) == 1 ? -n : n; } let a = o('./node_modules/source-map/lib/base64.js'),
    s = 5,
    i = 1 << s,
    l = i - 1,
    d = i; n.encode = function (e) {
    let n,
      o = '',
      r = t(e); do n = r & l, r >>>= s, r > 0 && (n |= d), o += a.encode(n); while (r > 0);return o;
  }, n.decode = function (e, n, o) {
    let t,
      i,
      c = e.length,
      p = 0,
      u = 0; do { if (n >= c) throw new Error('Expected more digits in base 64 VLQ value.'); if (i = a.decode(e.charCodeAt(n++)), i === -1) throw new Error(`Invalid base64 digit: ${e.charAt(n - 1)}`); t = !!(i & d), i &= l, p += i << u, u += s; } while (t);o.value = r(p), o.rest = n;
  };
},
'./node_modules/source-map/lib/base64.js': function (e, n) {
  const o = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/']; n.encode = function (e) { if (e >= 0 && e < o.length) return o[e]; throw new TypeError(`Must be between 0 and 63: ${e}`); }, n.decode = function (e) {
    let n = 65,
      o = 97,
      t = 48; return n <= e && e <= 90 ? e - n : o <= e && e <= 122 ? e - o + 26 : t <= e && e <= 57 ? e - t + 52 : e == 43 ? 62 : e == 47 ? 63 : -1;
  };
},
'./node_modules/source-map/lib/binary-search.js': function (e, n) {
  function o(e, t, r, a, s, i) {
    let l = Math.floor((t - e) / 2) + e,
      d = s(r, a[l], !0); return d === 0 ? l : d > 0 ? t - l > 1 ? o(l, t, r, a, s, i) : i == n.LEAST_UPPER_BOUND ? t < a.length ? t : -1 : l : l - e > 1 ? o(e, l, r, a, s, i) : i == n.LEAST_UPPER_BOUND ? l : e < 0 ? -1 : e;
  }n.GREATEST_LOWER_BOUND = 1, n.LEAST_UPPER_BOUND = 2, n.search = function (e, t, r, a) { if (t.length === 0) return -1; let s = o(-1, t.length, e, t, r, a || n.GREATEST_LOWER_BOUND); if (s < 0) return -1; for (;s - 1 >= 0 && r(t[s], t[s - 1], !0) === 0;)--s; return s; };
},
'./node_modules/source-map/lib/mapping-list.js': function (e, n, o) {
  function t(e, n) {
    let o = e.generatedLine,
      t = n.generatedLine,
      r = e.generatedColumn,
      s = n.generatedColumn; return t > o || t == o && s >= r || a.compareByGeneratedPositionsInflated(e, n) <= 0;
  } function r() { this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 }; } var a = o('./node_modules/source-map/lib/util.js'); r.prototype.unsortedForEach = function (e, n) { this._array.forEach(e, n); }, r.prototype.add = function (e) { t(this._last, e) ? (this._last = e, this._array.push(e)) : (this._sorted = !1, this._array.push(e)); }, r.prototype.toArray = function () { return this._sorted || (this._array.sort(a.compareByGeneratedPositionsInflated), this._sorted = !0), this._array; }, n.MappingList = r;
},
'./node_modules/source-map/lib/quick-sort.js': function (e, n) {
  function o(e, n, o) { const t = e[n]; e[n] = e[o], e[o] = t; } function t(e, n) { return Math.round(e + Math.random() * (n - e)); } function a(e, n, s, l) {
    if (s < l) {
      let r = t(s, l),
        d = s - 1; o(e, r, l); for (var i = e[l], c = s; c < l; c++)n(e[c], i) <= 0 && (d += 1, o(e, d, c)); o(e, d + 1, c); const p = d + 1; a(e, n, s, p - 1), a(e, n, p + 1, l);
    }
  }n.quickSort = function (e, n) { a(e, n, 0, e.length - 1); };
},
'./node_modules/source-map/lib/source-map-consumer.js': function (e, n, o) {
  function t(e) { let n = e; return typeof e === 'string' && (n = JSON.parse(e.replace(/^\)\]\}'/, ''))), n.sections == null ? new r(n) : new s(n); } function r(e) {
    let n = e; typeof e === 'string' && (n = JSON.parse(e.replace(/^\)\]\}'/, ''))); let o = l.getArg(n, 'version'),
      t = l.getArg(n, 'sources'),
      r = l.getArg(n, 'names', []),
      a = l.getArg(n, 'sourceRoot', null),
      s = l.getArg(n, 'sourcesContent', null),
      i = l.getArg(n, 'mappings'),
      c = l.getArg(n, 'file', null); if (o != this._version) throw new Error(`Unsupported version: ${o}`); t = t.map(String).map(l.normalize).map((e) => (a && l.isAbsolute(a) && l.isAbsolute(e) ? l.relative(a, e) : e)), this._names = d.fromArray(r.map(String), !0), this._sources = d.fromArray(t, !0), this.sourceRoot = a, this.sourcesContent = s, this._mappings = i, this.file = c;
  } function a() { this.generatedLine = 0, this.generatedColumn = 0, this.source = null, this.originalLine = null, this.originalColumn = null, this.name = null; } function s(e) {
    let n = e; typeof e === 'string' && (n = JSON.parse(e.replace(/^\)\]\}'/, ''))); let o = l.getArg(n, 'version'),
      r = l.getArg(n, 'sections'); if (o != this._version) throw new Error(`Unsupported version: ${o}`); this._sources = new d(), this._names = new d(); let a = { line: -1, column: 0 }; this._sections = r.map((e) => {
      if (e.url) throw new Error('Support for url field in sections not implemented.'); let n = l.getArg(e, 'offset'),
        o = l.getArg(n, 'line'),
        r = l.getArg(n, 'column'); if (o < a.line || o === a.line && r < a.column) throw new Error('Section offsets must be ordered and non-overlapping.'); return a = n, { generatedOffset: { generatedLine: o + 1, generatedColumn: r + 1 }, consumer: new t(l.getArg(e, 'map')) };
    });
  } var l = o('./node_modules/source-map/lib/util.js'),
    i = o('./node_modules/source-map/lib/binary-search.js'),
    d = o('./node_modules/source-map/lib/array-set.js').ArraySet,
    c = o('./node_modules/source-map/lib/base64-vlq.js'),
    p = o('./node_modules/source-map/lib/quick-sort.js').quickSort; t.fromSourceMap = function (e) { return r.fromSourceMap(e); }, t.prototype._version = 3, t.prototype.__generatedMappings = null, Object.defineProperty(t.prototype, '_generatedMappings', { get() { return this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__generatedMappings; } }), t.prototype.__originalMappings = null, Object.defineProperty(t.prototype, '_originalMappings', { get() { return this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__originalMappings; } }), t.prototype._charIsMappingSeparator = function (e, n) { const o = e.charAt(n); return o === ';' || o === ','; }, t.prototype._parseMappings = function () { throw new Error('Subclasses must implement _parseMappings'); }, t.GENERATED_ORDER = 1, t.ORIGINAL_ORDER = 2, t.GREATEST_LOWER_BOUND = 1, t.LEAST_UPPER_BOUND = 2, t.prototype.eachMapping = function (e, n, o) {
    let r,
      a = o || t.GENERATED_ORDER; switch (a) { case t.GENERATED_ORDER: r = this._generatedMappings; break; case t.ORIGINAL_ORDER: r = this._originalMappings; break; default: throw new Error('Unknown order of iteration.'); } const s = this.sourceRoot; r.map(function (e) { let n = e.source === null ? null : this._sources.at(e.source); return n != null && s != null && (n = l.join(s, n)), { source: n, generatedLine: e.generatedLine, generatedColumn: e.generatedColumn, originalLine: e.originalLine, originalColumn: e.originalColumn, name: e.name === null ? null : this._names.at(e.name) }; }, this).forEach(e, n || null);
  }, t.prototype.allGeneratedPositionsFor = function (e) {
    let n = l.getArg(e, 'line'),
      o = { source: l.getArg(e, 'source'), originalLine: n, originalColumn: l.getArg(e, 'column', 0) }; if (this.sourceRoot != null && (o.source = l.relative(this.sourceRoot, o.source)), !this._sources.has(o.source)) return []; o.source = this._sources.indexOf(o.source); let t = [],
      r = this._findMapping(o, this._originalMappings, 'originalLine', 'originalColumn', l.compareByOriginalPositions, i.LEAST_UPPER_BOUND); if (r >= 0) { let a = this._originalMappings[r]; if (void 0 === e.column) for (let s = a.originalLine; a && a.originalLine === s;)t.push({ line: l.getArg(a, 'generatedLine', null), column: l.getArg(a, 'generatedColumn', null), lastColumn: l.getArg(a, 'lastGeneratedColumn', null) }), a = this._originalMappings[++r]; else for (let d = a.originalColumn; a && a.originalLine === n && a.originalColumn == d;)t.push({ line: l.getArg(a, 'generatedLine', null), column: l.getArg(a, 'generatedColumn', null), lastColumn: l.getArg(a, 'lastGeneratedColumn', null) }), a = this._originalMappings[++r]; } return t;
  }, n.SourceMapConsumer = t, r.prototype = Object.create(t.prototype), r.prototype.consumer = t, r.fromSourceMap = function (e) {
    let n = Object.create(r.prototype),
      o = n._names = d.fromArray(e._names.toArray(), !0),
      t = n._sources = d.fromArray(e._sources.toArray(), !0); n.sourceRoot = e._sourceRoot, n.sourcesContent = e._generateSourcesContent(n._sources.toArray(), n.sourceRoot), n.file = e._file; for (let s = e._mappings.toArray().slice(), c = n.__generatedMappings = [], u = n.__originalMappings = [], m = 0, i = s.length; m < i; m++) {
      let g = s[m],
        h = new a(); h.generatedLine = g.generatedLine, h.generatedColumn = g.generatedColumn, g.source && (h.source = t.indexOf(g.source), h.originalLine = g.originalLine, h.originalColumn = g.originalColumn, g.name && (h.name = o.indexOf(g.name)), u.push(h)), c.push(h);
    } return p(n.__originalMappings, l.compareByOriginalPositions), n;
  }, r.prototype._version = 3, Object.defineProperty(r.prototype, 'sources', { get() { return this._sources.toArray().map(function (e) { return this.sourceRoot == null ? e : l.join(this.sourceRoot, e); }, this); } }), r.prototype._parseMappings = function (e) { for (var n, o, t, r, s, i = 1, d = 0, u = 0, m = 0, g = 0, h = 0, f = e.length, E = 0, _ = {}, y = {}, b = [], S = []; E < f;) if (e.charAt(E) === ';')i++, E++, d = 0; else if (e.charAt(E) === ',')E++; else { for (n = new a(), n.generatedLine = i, r = E; r < f && !this._charIsMappingSeparator(e, r); r++);if (o = e.slice(E, r), t = _[o], t)E += o.length; else { for (t = []; E < r;)c.decode(e, E, y), s = y.value, E = y.rest, t.push(s); if (t.length === 2) throw new Error('Found a source, but no line and column'); if (t.length === 3) throw new Error('Found a source and line, but no column'); _[o] = t; }n.generatedColumn = d + t[0], d = n.generatedColumn, t.length > 1 && (n.source = g + t[1], g += t[1], n.originalLine = u + t[2], u = n.originalLine, n.originalLine += 1, n.originalColumn = m + t[3], m = n.originalColumn, t.length > 4 && (n.name = h + t[4], h += t[4])), S.push(n), typeof n.originalLine === 'number' && b.push(n); }p(S, l.compareByGeneratedPositionsDeflated), this.__generatedMappings = S, p(b, l.compareByOriginalPositions), this.__originalMappings = b; }, r.prototype._findMapping = function (e, n, o, t, r, a) { if (e[o] <= 0) throw new TypeError(`Line must be greater than or equal to 1, got ${e[o]}`); if (e[t] < 0) throw new TypeError(`Column must be greater than or equal to 0, got ${e[t]}`); return i.search(e, n, r, a); }, r.prototype.computeColumnSpans = function () { for (var e, n = 0; n < this._generatedMappings.length; ++n) { if (e = this._generatedMappings[n], n + 1 < this._generatedMappings.length) { const o = this._generatedMappings[n + 1]; if (e.generatedLine === o.generatedLine) { e.lastGeneratedColumn = o.generatedColumn - 1; continue; } }e.lastGeneratedColumn = Infinity; } }, r.prototype.originalPositionFor = function (e) {
    let n = { generatedLine: l.getArg(e, 'line'), generatedColumn: l.getArg(e, 'column') },
      o = this._findMapping(n, this._generatedMappings, 'generatedLine', 'generatedColumn', l.compareByGeneratedPositionsDeflated, l.getArg(e, 'bias', t.GREATEST_LOWER_BOUND)); if (o >= 0) { const r = this._generatedMappings[o]; if (r.generatedLine === n.generatedLine) { let a = l.getArg(r, 'source', null); a !== null && (a = this._sources.at(a), this.sourceRoot != null && (a = l.join(this.sourceRoot, a))); let s = l.getArg(r, 'name', null); return s !== null && (s = this._names.at(s)), { source: a, line: l.getArg(r, 'originalLine', null), column: l.getArg(r, 'originalColumn', null), name: s }; } } return { source: null, line: null, column: null, name: null };
  }, r.prototype.hasContentsOfAllSources = function () { return !!this.sourcesContent && this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some((e) => e == null); }, r.prototype.sourceContentFor = function (e, n) { if (!this.sourcesContent) return null; if (this.sourceRoot != null && (e = l.relative(this.sourceRoot, e)), this._sources.has(e)) return this.sourcesContent[this._sources.indexOf(e)]; let o; if (this.sourceRoot != null && (o = l.urlParse(this.sourceRoot))) { const t = e.replace(/^file:\/\//, ''); if (o.scheme == 'file' && this._sources.has(t)) return this.sourcesContent[this._sources.indexOf(t)]; if ((!o.path || o.path == '/') && this._sources.has(`/${e}`)) return this.sourcesContent[this._sources.indexOf(`/${e}`)]; } if (n) return null; throw new Error(`"${e}" is not in the SourceMap.`); }, r.prototype.generatedPositionFor = function (e) {
    let n = l.getArg(e, 'source'); if (this.sourceRoot != null && (n = l.relative(this.sourceRoot, n)), !this._sources.has(n)) return { line: null, column: null, lastColumn: null }; n = this._sources.indexOf(n); let o = { source: n, originalLine: l.getArg(e, 'line'), originalColumn: l.getArg(e, 'column') },
      r = this._findMapping(o, this._originalMappings, 'originalLine', 'originalColumn', l.compareByOriginalPositions, l.getArg(e, 'bias', t.GREATEST_LOWER_BOUND)); if (r >= 0) { const a = this._originalMappings[r]; if (a.source === o.source) return { line: l.getArg(a, 'generatedLine', null), column: l.getArg(a, 'generatedColumn', null), lastColumn: l.getArg(a, 'lastGeneratedColumn', null) }; } return { line: null, column: null, lastColumn: null };
  }, n.BasicSourceMapConsumer = r, s.prototype = Object.create(t.prototype), s.prototype.constructor = t, s.prototype._version = 3, Object.defineProperty(s.prototype, 'sources', { get() { for (var e = [], n = 0; n < this._sections.length; n++) for (let o = 0; o < this._sections[n].consumer.sources.length; o++)e.push(this._sections[n].consumer.sources[o]); return e; } }), s.prototype.originalPositionFor = function (e) {
    let n = { generatedLine: l.getArg(e, 'line'), generatedColumn: l.getArg(e, 'column') },
      o = i.search(n, this._sections, (e, n) => { const o = e.generatedLine - n.generatedOffset.generatedLine; return o || e.generatedColumn - n.generatedOffset.generatedColumn; }),
      t = this._sections[o]; return t ? t.consumer.originalPositionFor({ line: n.generatedLine - (t.generatedOffset.generatedLine - 1), column: n.generatedColumn - (t.generatedOffset.generatedLine === n.generatedLine ? t.generatedOffset.generatedColumn - 1 : 0), bias: e.bias }) : { source: null, line: null, column: null, name: null };
  }, s.prototype.hasContentsOfAllSources = function () { return this._sections.every((e) => e.consumer.hasContentsOfAllSources()); }, s.prototype.sourceContentFor = function (e, n) {
    for (let o = 0; o < this._sections.length; o++) {
      let t = this._sections[o],
        r = t.consumer.sourceContentFor(e, !0); if (r) return r;
    } if (n) return null; throw new Error(`"${e}" is not in the SourceMap.`);
  }, s.prototype.generatedPositionFor = function (e) { for (var n, o = 0; o < this._sections.length; o++) if (n = this._sections[o], n.consumer.sources.indexOf(l.getArg(e, 'source')) !== -1) { const t = n.consumer.generatedPositionFor(e); if (t) { const r = { line: t.line + (n.generatedOffset.generatedLine - 1), column: t.column + (n.generatedOffset.generatedLine === t.line ? n.generatedOffset.generatedColumn - 1 : 0) }; return r; } } return { line: null, column: null }; }, s.prototype._parseMappings = function () {
    this.__generatedMappings = [], this.__originalMappings = []; for (let e = 0; e < this._sections.length; e++) {
      for (let n = this._sections[e], o = n.consumer._generatedMappings, t = 0; t < o.length; t++) {
        let r = o[t],
          a = n.consumer._sources.at(r.source); n.consumer.sourceRoot !== null && (a = l.join(n.consumer.sourceRoot, a)), this._sources.add(a), a = this._sources.indexOf(a); let s = n.consumer._names.at(r.name); this._names.add(s), s = this._names.indexOf(s); const i = { source: a, generatedLine: r.generatedLine + (n.generatedOffset.generatedLine - 1), generatedColumn: r.generatedColumn + (n.generatedOffset.generatedLine === r.generatedLine ? n.generatedOffset.generatedColumn - 1 : 0), originalLine: r.originalLine, originalColumn: r.originalColumn, name: s }; this.__generatedMappings.push(i), typeof i.originalLine === 'number' && this.__originalMappings.push(i);
      }
    }p(this.__generatedMappings, l.compareByGeneratedPositionsDeflated), p(this.__originalMappings, l.compareByOriginalPositions);
  }, n.IndexedSourceMapConsumer = s;
},
'./node_modules/source-map/lib/source-map-generator.js': function (e, n, o) {
  function t(e) { e || (e = {}), this._file = a.getArg(e, 'file', null), this._sourceRoot = a.getArg(e, 'sourceRoot', null), this._skipValidation = a.getArg(e, 'skipValidation', !1), this._sources = new s(), this._names = new s(), this._mappings = new i(), this._sourcesContents = null; } var r = o('./node_modules/source-map/lib/base64-vlq.js'),
    a = o('./node_modules/source-map/lib/util.js'),
    s = o('./node_modules/source-map/lib/array-set.js').ArraySet,
    i = o('./node_modules/source-map/lib/mapping-list.js').MappingList; t.prototype._version = 3, t.fromSourceMap = function (e) {
    let n = e.sourceRoot,
      o = new t({ file: e.file, sourceRoot: n }); return e.eachMapping((e) => { const t = { generated: { line: e.generatedLine, column: e.generatedColumn } }; e.source != null && (t.source = e.source, n != null && (t.source = a.relative(n, t.source)), t.original = { line: e.originalLine, column: e.originalColumn }, e.name != null && (t.name = e.name)), o.addMapping(t); }), e.sources.forEach((n) => { const t = e.sourceContentFor(n); t != null && o.setSourceContent(n, t); }), o;
  }, t.prototype.addMapping = function (e) {
    let n = a.getArg(e, 'generated'),
      o = a.getArg(e, 'original', null),
      t = a.getArg(e, 'source', null),
      r = a.getArg(e, 'name', null); this._skipValidation || this._validateMapping(n, o, t, r), t != null && (t += '', !this._sources.has(t) && this._sources.add(t)), r != null && (r += '', !this._names.has(r) && this._names.add(r)), this._mappings.add({ generatedLine: n.line, generatedColumn: n.column, originalLine: o != null && o.line, originalColumn: o != null && o.column, source: t, name: r });
  }, t.prototype.setSourceContent = function (e, n) { let o = e; this._sourceRoot != null && (o = a.relative(this._sourceRoot, o)), n == null ? this._sourcesContents && (delete this._sourcesContents[a.toSetString(o)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null)) : (!this._sourcesContents && (this._sourcesContents = Object.create(null)), this._sourcesContents[a.toSetString(o)] = n); }, t.prototype.applySourceMap = function (e, n, o) {
    let t = n; if (n == null) { if (e.file == null) throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.'); t = e.file; } const r = this._sourceRoot; r != null && (t = a.relative(r, t)); let i = new s(),
      l = new s(); this._mappings.unsortedForEach((n) => { if (n.source === t && n.originalLine != null) { const s = e.originalPositionFor({ line: n.originalLine, column: n.originalColumn }); s.source != null && (n.source = s.source, o != null && (n.source = a.join(o, n.source)), r != null && (n.source = a.relative(r, n.source)), n.originalLine = s.line, n.originalColumn = s.column, s.name != null && (n.name = s.name)); } const d = n.source; d == null || i.has(d) || i.add(d); const c = n.name; c == null || l.has(c) || l.add(c); }, this), this._sources = i, this._names = l, e.sources.forEach(function (n) { const t = e.sourceContentFor(n); t != null && (o != null && (n = a.join(o, n)), r != null && (n = a.relative(r, n)), this.setSourceContent(n, t)); }, this);
  }, t.prototype._validateMapping = function (e, n, o, t) { if (n && typeof n.line !== 'number' && typeof n.column !== 'number') throw new Error('original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.'); if (!(e && 'line' in e && 'column' in e && e.line > 0 && e.column >= 0 && !n && !o && !t) && !(e && 'line' in e && 'column' in e && n && 'line' in n && 'column' in n && e.line > 0 && e.column >= 0 && n.line > 0 && n.column >= 0 && o)) throw new Error(`Invalid mapping: ${JSON.stringify({ generated: e, source: o, original: n, name: t })}`); }, t.prototype._serializeMappings = function () { for (var e, n, o, t, s = 0, l = 1, d = 0, c = 0, p = 0, u = 0, m = '', g = this._mappings.toArray(), h = 0, i = g.length; h < i; h++) { if (n = g[h], e = '', n.generatedLine !== l) for (s = 0; n.generatedLine !== l;)e += ';', l++; else if (h > 0) { if (!a.compareByGeneratedPositionsInflated(n, g[h - 1])) continue; e += ','; }e += r.encode(n.generatedColumn - s), s = n.generatedColumn, n.source != null && (t = this._sources.indexOf(n.source), e += r.encode(t - u), u = t, e += r.encode(n.originalLine - 1 - c), c = n.originalLine - 1, e += r.encode(n.originalColumn - d), d = n.originalColumn, n.name != null && (o = this._names.indexOf(n.name), e += r.encode(o - p), p = o)), m += e; } return m; }, t.prototype._generateSourcesContent = function (e, n) { return e.map(function (e) { if (!this._sourcesContents) return null; n != null && (e = a.relative(n, e)); const o = a.toSetString(e); return Object.prototype.hasOwnProperty.call(this._sourcesContents, o) ? this._sourcesContents[o] : null; }, this); }, t.prototype.toJSON = function () { const e = { version: this._version, sources: this._sources.toArray(), names: this._names.toArray(), mappings: this._serializeMappings() }; return this._file != null && (e.file = this._file), this._sourceRoot != null && (e.sourceRoot = this._sourceRoot), this._sourcesContents && (e.sourcesContent = this._generateSourcesContent(e.sources, e.sourceRoot)), e; }, t.prototype.toString = function () { return JSON.stringify(this.toJSON()); }, n.SourceMapGenerator = t;
},
'./node_modules/source-map/lib/source-node.js': function (e, n, o) {
  function t(e, n, o, t, r) { this.children = [], this.sourceContents = {}, this.line = e == null ? null : e, this.column = n == null ? null : n, this.source = o == null ? null : o, this.name = r == null ? null : r, this[l] = !0, t != null && this.add(t); } var r = o('./node_modules/source-map/lib/source-map-generator.js').SourceMapGenerator,
    a = o('./node_modules/source-map/lib/util.js'),
    s = /(\r?\n)/,
    l = '$$$isSourceNode$$$'; t.fromStringWithSourceMap = function (e, n, o) {
    function r(e, n) { if (e === null || void 0 === e.source)i.add(n); else { const r = o ? a.join(o, e.source) : e.source; i.add(new t(e.originalLine, e.originalColumn, r, n, e.name)); } } var i = new t(),
      l = e.split(s),
      d = 0,
      c = function () {
        function e() { return d < l.length ? l[d++] : void 0; } let n = e(),
          o = e() || ''; return n + o;
      },
      p = 1,
      u = 0,
      m = null; return n.eachMapping((e) => {
      if (m != null) {
        if (p < e.generatedLine)r(m, c()), p++, u = 0; else {
          var n = l[d],
            o = n.substr(0, e.generatedColumn - u); return l[d] = n.substr(e.generatedColumn - u), u = e.generatedColumn, r(m, o), void (m = e);
        }
      } for (;p < e.generatedLine;)i.add(c()), p++; if (u < e.generatedColumn) { var n = l[d]; i.add(n.substr(0, e.generatedColumn)), l[d] = n.substr(e.generatedColumn), u = e.generatedColumn; }m = e;
    }, this), d < l.length && (m && r(m, c()), i.add(l.splice(d).join(''))), n.sources.forEach((e) => { const t = n.sourceContentFor(e); t != null && (o != null && (e = a.join(o, e)), i.setSourceContent(e, t)); }), i;
  }, t.prototype.add = function (e) { if (Array.isArray(e))e.forEach(function (e) { this.add(e); }, this); else if (e[l] || typeof e === 'string')e && this.children.push(e); else throw new TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got ${e}`); return this; }, t.prototype.prepend = function (e) { if (Array.isArray(e)) for (let n = e.length - 1; n >= 0; n--) this.prepend(e[n]); else if (e[l] || typeof e === 'string') this.children.unshift(e); else throw new TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got ${e}`); return this; }, t.prototype.walk = function (e) { for (var n, o = 0, t = this.children.length; o < t; o++)n = this.children[o], n[l] ? n.walk(e) : n !== '' && e(n, { source: this.source, line: this.line, column: this.column, name: this.name }); }, t.prototype.join = function (e) {
    let n,
      o,
      t = this.children.length; if (t > 0) { for (n = [], o = 0; o < t - 1; o++)n.push(this.children[o]), n.push(e); n.push(this.children[o]), this.children = n; } return this;
  }, t.prototype.replaceRight = function (e, n) { const o = this.children[this.children.length - 1]; return o[l] ? o.replaceRight(e, n) : typeof o === 'string' ? this.children[this.children.length - 1] = o.replace(e, n) : this.children.push(''.replace(e, n)), this; }, t.prototype.setSourceContent = function (e, n) { this.sourceContents[a.toSetString(e)] = n; }, t.prototype.walkSourceContents = function (e) { for (var n = 0, o = this.children.length; n < o; n++) this.children[n][l] && this.children[n].walkSourceContents(e); for (var t = Object.keys(this.sourceContents), n = 0, o = t.length; n < o; n++)e(a.fromSetString(t[n]), this.sourceContents[t[n]]); }, t.prototype.toString = function () { let e = ''; return this.walk((n) => { e += n; }), e; }, t.prototype.toStringWithSourceMap = function (e) {
    let n = { code: '', line: 1, column: 0 },
      o = new r(e),
      t = !1,
      a = null,
      s = null,
      i = null,
      l = null; return this.walk((e, r) => { n.code += e, r.source !== null && r.line !== null && r.column !== null ? ((a !== r.source || s !== r.line || i !== r.column || l !== r.name) && o.addMapping({ source: r.source, original: { line: r.line, column: r.column }, generated: { line: n.line, column: n.column }, name: r.name }), a = r.source, s = r.line, i = r.column, l = r.name, t = !0) : t && (o.addMapping({ generated: { line: n.line, column: n.column } }), a = null, t = !1); for (let d = 0, c = e.length; d < c; d++)e.charCodeAt(d) === 10 ? (n.line++, n.column = 0, d + 1 === c ? (a = null, t = !1) : t && o.addMapping({ source: r.source, original: { line: r.line, column: r.column }, generated: { line: n.line, column: n.column }, name: r.name })) : n.column++; }), this.walkSourceContents((e, n) => { o.setSourceContent(e, n); }), { code: n.code, map: o };
  }, n.SourceNode = t;
},
'./node_modules/source-map/lib/util.js': function (e, n) {
  function o(e) { const n = e.match(l); return n ? { scheme: n[1], auth: n[2], host: n[3], port: n[4], path: n[5] } : null; } function t(e) { let n = ''; return e.scheme && (n += `${e.scheme}:`), n += '//', e.auth && (n += `${e.auth}@`), e.host && (n += e.host), e.port && (n += `:${e.port}`), e.path && (n += e.path), n; } function r(e) {
    let r = e,
      a = o(e); if (a) { if (!a.path) return e; r = a.path; } for (var s, l = n.isAbsolute(r), d = r.split(/\/+/), c = 0, p = d.length - 1; p >= 0; p--)s = d[p], s === '.' ? d.splice(p, 1) : s === '..' ? c++ : c > 0 && (s === '' ? (d.splice(p + 1, c), c = 0) : (d.splice(p, 2), c--)); return r = d.join('/'), r === '' && (r = l ? '/' : '.'), a ? (a.path = r, t(a)) : r;
  } function a(e) { return e; } function s(e) { if (!e) return !1; const n = e.length; if (n < 9) return !1; if (e.charCodeAt(n - 1) !== 95 || e.charCodeAt(n - 2) !== 95 || e.charCodeAt(n - 3) !== 111 || e.charCodeAt(n - 4) !== 116 || e.charCodeAt(n - 5) !== 111 || e.charCodeAt(n - 6) !== 114 || e.charCodeAt(n - 7) !== 112 || e.charCodeAt(n - 8) !== 95 || e.charCodeAt(n - 9) !== 95) return !1; for (let o = n - 10; o >= 0; o--) if (e.charCodeAt(o) !== 36) return !1; return !0; } function i(e, n) { return e === n ? 0 : e > n ? 1 : -1; }n.getArg = function (e, n, o) { if (n in e) return e[n]; if (arguments.length === 3) return o; throw new Error(`"${n}" is a required argument.`); }; var l = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/,
    d = /^data:.+\,.+$/; n.urlParse = o, n.urlGenerate = t, n.normalize = r, n.join = function (e, n) {
    e === '' && (e = '.'), n === '' && (n = '.'); let a = o(n),
      s = o(e); if (s && (e = s.path || '/'), a && !a.scheme) return s && (a.scheme = s.scheme), t(a); if (a || n.match(d)) return n; if (s && !s.host && !s.path) return s.host = n, t(s); const i = n.charAt(0) === '/' ? n : r(`${e.replace(/\/+$/, '')}/${n}`); return s ? (s.path = i, t(s)) : i;
  }, n.isAbsolute = function (e) { return e.charAt(0) === '/' || !!e.match(l); }, n.relative = function (e, n) { e === '' && (e = '.'), e = e.replace(/\/$/, ''); for (var o, t = 0; n.indexOf(`${e}/`) !== 0;) { if (o = e.lastIndexOf('/'), o < 0) return n; if (e = e.slice(0, o), e.match(/^([^\/]+:\/)?\/*$/)) return n; ++t; } return Array(t + 1).join('../') + n.substr(e.length + 1); }; const c = (function () { const e = Object.create(null); return !('__proto__' in e); }()); n.toSetString = c ? a : function (e) { return s(e) ? `$${e}` : e; }, n.fromSetString = c ? a : function (e) { return s(e) ? e.slice(1) : e; }, n.compareByOriginalPositions = function (e, n, o) { let t = e.source - n.source; return t == 0 ? (t = e.originalLine - n.originalLine, t != 0) ? t : (t = e.originalColumn - n.originalColumn, t != 0 || o) ? t : (t = e.generatedColumn - n.generatedColumn, t != 0) ? t : (t = e.generatedLine - n.generatedLine, t == 0 ? e.name - n.name : t) : t; }, n.compareByGeneratedPositionsDeflated = function (e, n, o) { let t = e.generatedLine - n.generatedLine; return t == 0 ? (t = e.generatedColumn - n.generatedColumn, t != 0 || o) ? t : (t = e.source - n.source, t != 0) ? t : (t = e.originalLine - n.originalLine, t != 0) ? t : (t = e.originalColumn - n.originalColumn, t == 0 ? e.name - n.name : t) : t; }, n.compareByGeneratedPositionsInflated = function (e, n) { let o = e.generatedLine - n.generatedLine; return o == 0 ? (o = e.generatedColumn - n.generatedColumn, o != 0) ? o : (o = i(e.source, n.source), o !== 0) ? o : (o = e.originalLine - n.originalLine, o !== 0) ? o : (o = e.originalColumn - n.originalColumn, o === 0 ? i(e.name, n.name) : o) : o; };
},
'./node_modules/source-map/source-map.js': function (e, n, o) { n.SourceMapGenerator = o('./node_modules/source-map/lib/source-map-generator.js').SourceMapGenerator, n.SourceMapConsumer = o('./node_modules/source-map/lib/source-map-consumer.js').SourceMapConsumer, n.SourceNode = o('./node_modules/source-map/lib/source-node.js').SourceNode; },
'./node_modules/wrappy/wrappy.js': function (e) {
  function n(e, o) {
    function t() {
      for (var n = Array(arguments.length), o = 0; o < n.length; o++)n[o] = arguments[o]; let t = e.apply(this, n),
        r = n[n.length - 1]; return typeof t === 'function' && t !== r && Object.keys(r).forEach((e) => { t[e] = r[e]; }), t;
    } if (e && o) return n(e)(o); if (typeof e !== 'function') throw new TypeError('need wrapper function'); return Object.keys(e).forEach((n) => { t[n] = e[n]; }), t;
  }e.exports = n;
},
assert(e) { e.exports = require('assert'); },
child_process(e) { e.exports = require('child_process'); },
electron(e) { e.exports = require('electron'); },
events(e) { e.exports = require('events'); },
fs(e) { e.exports = require('fs'); },
https(e) { e.exports = require('https'); },
module(e) { e.exports = require('module'); },
path(e) { e.exports = require('path'); },
util(e) { e.exports = require('util'); } }));
// # sourceMappingURL=main.prod.js.map
