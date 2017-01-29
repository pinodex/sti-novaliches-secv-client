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
      SocketIO = require('socket.io-client')

let app = Angular.module('secApp', [
  AngularRoute,
  AngularAnimate
])

//let socket = SocketIO('http://localhost:3333')

app.config(['$locationProvider', '$routeProvider', ($locationProvider, $routeProvider) => {
  $routeProvider
    .when('/', { templateUrl: 'pages/index.html' })
    .when('/vote', { templateUrl: 'pages/vote.html' })
}])

app.controller('UIController', ($scope) => {
  
})

app.controller('VoteController', ($scope, $timeout) => {
  function init() {
    $scope.data = {
      positions: [
        { id: 1, name: 'President' },
        { id: 2, name: 'Vice President' },
        { id: 3, name: 'Secretary' },
        { id: 4, name: 'Treasurer' },
        { id: 5, name: 'P.R.O.' },
        { id: 6, name: 'Auditor' }
      ],

      candidates: [
        { id: 1, name: 'Candidate 1', position_id: 1 },
        { id: 2, name: 'Candidate 2', position_id: 1 },
        { id: 3, name: 'Candidate 3', position_id: 2 },
        { id: 4, name: 'Candidate 4', position_id: 2 },
        { id: 5, name: 'Candidate 5', position_id: 3 },
        { id: 6, name: 'Candidate 6', position_id: 3 },
        { id: 7, name: 'Candidate 7', position_id: 4 },
        { id: 8, name: 'Candidate 8', position_id: 4 },
        { id: 9, name: 'Candidate 9', position_id: 5 },
        { id: 10, name: 'Candidate 10', position_id: 5 },
        { id: 11, name: 'Candidate 11', position_id: 6 },
        { id: 12, name: 'Candidate 1', position_id: 6 }
      ]
    }

    $scope.state = 1
    $scope.loggedIn = false
    $scope.showBallot = false
    $scope.showSummary = false
    $scope.showFinished = false
    $scope.disableActionButton = false
    $scope.positionIndex = 0

    $scope.userVotes = []
  }

  init()

  $scope.login = () => {
    $scope.loggedIn = true

    $timeout(() => {
      $scope.showBallot = true
    }, 500)
  }

  $scope.logout = () => {
    init()
  }

  $scope.changePosition = (index) => {
    $scope.positionIndex = index
  }

  $scope.nextPosition = () => {
    $scope.positionIndex++
  }

  $scope.isLastPosition = () => {
    return $scope.positionIndex == $scope.data.positions.length - 1;
  }

  $scope.getVoteFromPosition = (positionId, getValue) => {
    getValue = getValue || true

    let vote = $scope.userVotes.find(item => {
      return item.position == positionId
    })

    if (vote === undefined) {
      return undefined
    }

    if (!getValue) {
      return vote
    }

    return $scope.data.candidates.find(item => {
      return vote.candidate == item.id
    })
  }

  $scope.getPosition = positionId => {
    return $scope.data.positions.find(item => {
      return item.id == positionId
    })
  }

  $scope.putVote = (positionId, candidateId) => {
    let vote = {
      position: positionId,
      candidate: candidateId
    }

    for (let i = 0; i < $scope.userVotes.length; i++) {
      if ($scope.userVotes[i].position == positionId) {
        $scope.userVotes[i] = vote
        return
      }
    }

    $scope.userVotes.push(vote)
  }

  $scope.isVoted = (positionId, candidateId) => {
    return $scope.userVotes.find(item => {
      return item.position == positionId && item.candidate == candidateId
    }) !== undefined
  }

  $scope.canFinish = () => {
    return $scope.userVotes.length == $scope.data.positions.length
  }

  $scope.showVoteSummary = () => {
    $scope.showBallot = false
    $scope.showSummary = true
  }

  $scope.hideVoteSummary = () => {
    $scope.showSummary = false
    $scope.showBallot = true
    $scope.positionIndex = 0
  }

  $scope.submitVotes = () => {
    $scope.disableActionButton = true

    $timeout(() => {
      $scope.showFinished = true
    }, 1000)
  }
})
