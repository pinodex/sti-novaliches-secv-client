'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

module.exports = ($scope, $rootScope, $timeout, vote) => {
  function init() {
    $scope.voterId = ''

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
  }

  init()

  vote.on('response:auth', data => {
    if (data == null) {
      return init()
    }

    $scope.user = data.user
    $scope.token = data.token
    $scope.state.loggedIn = true

    $timeout(() => {
      $scope.state.ballot = true
    }, 500)
  })
  
  $scope.login = function () {
    $scope.state.login = 1
    
    vote.emit('auth', this.voterId)
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
    return $scope.state.positionIndex == $rootScope.data.positions.length - 1;
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

    return $rootScope.data.candidates.find(item => {
      return vote.candidate == item.id
    })
  }

  $scope.getPosition = positionId => {
    return $rootScope.data.positions.find(item => {
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
    return $scope.userVotes.length == $rootScope.data.positions.length
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

    $timeout(() => {
      $scope.state.finished = true
    }, 1000)
  }
}
