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
    for (var i = 0; i < data.length; i++) {
      for (var x = 0; x < data[i].candidates.length; x++) {
        if (data[i].candidates[x].photo != null) {
          data[i].candidates[x].photo = URL.createObjectURL(new Blob(
            [data[i].candidates[x].photo]
          ))
        }
      }
    }

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
