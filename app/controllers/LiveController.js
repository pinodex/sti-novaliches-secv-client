'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Client
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

module.exports = ($scope, $rootScope, $timeout, vote) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  $scope.data = []

  $scope.getLetter = number => {
    return alphabet[number]
  }

  vote.emit('get:update')
  
  vote.on('update', data => {
    $scope.data = data
  })
}
