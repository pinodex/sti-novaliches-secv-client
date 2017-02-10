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

const config = require('../config')

const app = Angular.module('secApp', [
  AngularRoute,
  AngularAnimate
])

const socketFactory = ($rootScope, channel) => {
  return {
    channel: channel,

    on: function (eventName, callback) {
      channel.on(eventName, function () {
        const args = arguments

        $rootScope.$apply(function () {
          callback.apply(channel, args)
        })
      })
    },

    emit: function (eventName, data, callback) {
      channel.emit(eventName, data, function () {
        const args = arguments

        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(channel, args)
          }
        })
      })
    }
  }
}

app.config([
  '$locationProvider', '$routeProvider',
  
  ($locationProvider, $routeProvider) => {
    $routeProvider
      .when('/', { templateUrl: 'pages/vote.html' })
      .when('/live', { templateUrl: 'pages/live.html' })
  }
])

app.factory('socket', function ($rootScope) {
  return Ws(config.server, {
    transports: ['websocket'],
    upgrade: false
  })
})

app.factory('socketMain', function ($rootScope, socket) {
  return socketFactory($rootScope, socket.channel('main'))
})

app.factory('socketVote', function ($rootScope, socket) {
  return socketFactory($rootScope, socket.channel('vote'))
})

app.factory('socketLive', function ($rootScope, socket) {
  return socketFactory($rootScope, socket.channel('live'))
})

app.directive('focusOn', function ($timeout) {
  return {
    restrict: 'A',
    
    link: function (scope, element, attrs) {
      scope.$on(attrs.focusOn, function (e) {
        $timeout((function () {
          element[0].focus();
        }), 10);
      });
    }
  };
});

app.directive('emptyOn', function ($timeout) {
  return {
    restrict: 'A',
    
    link: function (scope, element, attrs) {
      scope.$on(attrs.focusOn, function (e) {
        $timeout((function () {
          element[0].value = '';
        }), 10);
      });
    }
  };
});

app.controller('UIController', require('./controllers/MainController'))
app.controller('VoteController', require('./controllers/VoteController'))
app.controller('LiveController', require('./controllers/LiveController'))
