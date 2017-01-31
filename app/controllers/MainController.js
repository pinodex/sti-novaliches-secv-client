'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

module.exports = ($rootScope, $scope) => {
  $rootScope.data = {}
  $scope.state = -4

  voteChannel.connect((error, connected) => {
    $scope.state = -1

    if (connected) {
      $scope.state = 1

      voteChannel.emit('data:request', 'roster')

      voteChannel.on('data:response:roster', (data) => {
        $rootScope.data = data
      })
    }

    $scope.$apply()
  })

  voteChannel.on('disconnect', () => {
    $scope.state = -2
    $scope.$apply()
  })
}
