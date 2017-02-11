'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const shuffle = require('shuffle-array')

module.exports = ($scope, $rootScope, $timeout, socketVote) => {
  $scope.data = {
    positions: [],
    candidates: []
  }

  function init() {
    $scope.state = {
      login: 0,
      loggedIn: false,
      ballot: false,
      summary: false,
      finished: false,
      actionButton: false,
      positionIndex: 0
    }

    $scope.user = null
    $scope.token = null
    $scope.userVotes = []

    $scope.$broadcast('emptyVoterId')
    $scope.$broadcast('focusVoterId')
  }

  init()

  socketVote.channel.connect((error, connected) => {
    $scope.state.login = -1

    $scope.data = {
      positions: [],
      candidates: []
    }

    socketVote.emit('get:roster')
  })

  socketVote.on('positions', data => {
    $scope.data.positions = data
  })

  socketVote.on('candidate', data => {
    data.photo = URL.createObjectURL(new Blob([data.photo]))

    $scope.data.candidates.push(data)
  })

  socketVote.on('done', () => {
    $scope.state.login = 0
  })

  socketVote.on('auth', data => {
    $scope.user = data.user
    $scope.token = data.token
    $scope.state.loggedIn = true

    $timeout(() => {
      $scope.state.ballot = true
    }, 500)
  })

  socketVote.on('auth:error', message => {
    init()

    alert(message)
  })

  socketVote.on('cast', () => {
    $scope.state.finished = true
  })

  $scope.$on('$destroy', () => {
    socketVote.channel.off('positions')
    socketVote.channel.off('candidate')
    socketVote.channel.off('done')
    socketVote.channel.off('auth')
    socketVote.channel.off('auth:error')
    socketVote.channel.off('cast')
  })
  
  $scope.login = function () {
    $scope.state.login = 1
    
    socketVote.emit('auth', this.voterId)

    shuffle($scope.data.candidates)
  }

  $scope.logout = () => {
    init()
  }

  $scope.changePosition = (index) => {
    $scope.state.positionIndex = index
  }

  $scope.nextPosition = () => {
    $scope.state.positionIndex++
  }

  $scope.isLastPosition = () => {
    return $scope.state.positionIndex == $scope.data.positions.length - 1;
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
    $scope.state.ballot = false
    $scope.state.summary = true
  }

  $scope.hideVoteSummary = () => {
    $scope.state.summary = false
    $scope.state.ballot = true
    $scope.state.positionIndex = 0
  }

  $scope.submitVotes = () => {
    $scope.state.actionButton = true

    let chosenCandidates = []

    for (var i = 0; i < $scope.userVotes.length; i++) {
      chosenCandidates.push($scope.userVotes[i].candidate)
    }

    socketVote.emit('cast', {
      token: $scope.token,
      ballot: chosenCandidates
    })
  }
}
