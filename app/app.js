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

app.config([
  '$locationProvider', '$routeProvider',
  
  ($locationProvider, $routeProvider) => {
    $routeProvider
      .when('/', { templateUrl: 'pages/vote.html' })
  }
])

app.factory('socket', function ($rootScope) {
  return Ws('http://localhost:3333', {
    transports: ['websocket'],
    upgrade: false
  })
})

app.factory('vote', function ($rootScope, socket) {
  const channel = socket.channel('vote')

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
