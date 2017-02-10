'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

module.exports = ($rootScope, $scope, socketMain) => {
  $rootScope.state = -4

  socketMain.channel.connect((error, connected) => {
    $rootScope.state = -1

    if (connected) {
      $rootScope.state = 1
    }

    $scope.$apply()
  })

  socketMain.on('disconnect', () => {
    $rootScope.state = -2

    $rootScope.data = {
      positions: [],
      candidates: []
    }
  })
}
