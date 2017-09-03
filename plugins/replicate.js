'use strict'

var Notify = require('pull-notify')

module.exports = {
  name: 'replicate',
  version: '2.0.0',
  manifest: {},
  init: function (sbot, config) {
    var notify = Notify(), upto
    return {
      request: function () {},
      changes: function () { return function (abort, cb) { cb(true) } }
    }
  }
}

