'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const {app, BrowserWindow} = require('electron'),
      config = require('./config'),
      path = require('path')

let _window
let entryPage = 'file://' + path.join(__dirname, 'views', 'index.html')

app.on('ready', () => {
  _window = new BrowserWindow({
    title: 'SECV Client',
    kiosk: process.env.NODE_ENV != 'dev'
  })

  _window.on('closed', () => {
    _window = null
  })

  if (config.live) {
    entryPage += '#!/live'
  }

  _window.loadURL(entryPage)
});

app.on('browser-window-created', (e, window) => {
  if (process.env.NODE_ENV != 'dev') {
    window.setMenu(null)
  }
});
