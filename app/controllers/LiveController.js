'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

module.exports = ($scope, $rootScope, $timeout, socketLive) => {
  $scope.data = []

  socketLive.channel.connect((error, connected) => {
    if (error) {
      alert('Cannot establish server connection')
    }

    if (connected) {
      socketLive.emit('update')

      setInterval(() => socketLive.emit('update'), 5000)
    }
  })

  socketLive.on('update', data => {
    $scope.data = data
  })

  $scope.getLetter = number => {
    return alphabet[number]
  }
}
