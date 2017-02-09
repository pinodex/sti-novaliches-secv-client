'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

module.exports = ($rootScope, $scope, vote) => {

  $rootScope.data = {
    positions: [],
    candidates: []
  }

  $scope.state = -4

  vote.channel.connect((error, connected) => {
    $scope.state = -1

    if (connected) {
      $scope.state = -3

      vote.emit('get:roster')
    }

    $scope.$apply()
  })

  vote.on('positions', data => {
    $rootScope.data.positions = data
  })

  vote.on('candidate', data => {
    data.photo = URL.createObjectURL(new Blob([data.photo]))

    $rootScope.data.candidates.push(data)
  })

  vote.on('done', () => {
    console.log($rootScope.data.candidates)
    $scope.state = 1
  })

  vote.on('disconnect', () => {
    $scope.state = -2
  })
}
