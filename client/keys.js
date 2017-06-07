var config = require('../plugins/ssb-config/inject')(process.env.ssb_appname)
var ssbKeys      = require('ssb-keys')
var path         = require('path')
module.exports = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

