'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

module.exports = ($scope, $timeout) => {
  function init() {
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
    return $scope.positionIndex == $rootScope.data.positions.length - 1;
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
}
