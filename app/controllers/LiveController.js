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
    socketLive.emit('update')
  })

  socketLive.on('update', data => {
    $scope.data = data
  })

  socketLive.on('casted', () => {
    socketLive.emit('update')
  })

  $scope.getLetter = number => {
    return alphabet[number]
  }

  $scope.$on('$destroy', () => {
    socketLive.off('update')
    socketLive.off('casted')
  })
}
