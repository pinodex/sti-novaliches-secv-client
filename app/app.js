'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Angular = require('angular'),
      AngularRoute = require('angular-route'),
      AngularAnimate = require('angular-animate'),
      Ws = require('adonis-websocket-client')

const app = Angular.module('secApp', [
  AngularRoute,
  AngularAnimate
])

window.io = Ws('http://localhost:3333', {
  transports: ['websocket'],
  upgrade: false
})

window.voteChannel = io.channel('vote')

app.config([
  '$locationProvider', '$routeProvider',
  
  ($locationProvider, $routeProvider) => {
    $routeProvider
      .when('/', { templateUrl: 'pages/vote.html' })
  }
])

app.controller('UIController', require('./controllers/MainController'))

app.controller('VoteController', require('./controllers/VoteController'))
