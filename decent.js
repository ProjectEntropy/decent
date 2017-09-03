var fs           = require('fs')
var path         = require('path')
var pull         = require('pull-stream')
var toPull       = require('stream-to-pull-stream')
var File         = require('pull-file')
var explain      = require('explain-error')
var ssbKeys      = require('ssb-keys')
var stringify    = require('pull-stringify')
var createHash   = require('multiblob/util').createHash
var minimist     = require('minimist')
var muxrpcli     = require('muxrpcli')

var argv = process.argv.slice(2)
var i = argv.indexOf('--')
var conf = argv.slice(i+1)
argv = ~i ? argv.slice(0, i) : argv

var config = require('./plugins/ssb-config/inject')(process.env.ssb_appname, minimist(conf))

var keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

var manifestFile = path.join(config.path, 'manifest.json')


  var createSbot = require('./lib')
    .use(require('./plugins/master'))
    .use(require('./plugins/gossip'))
    .use(require('./plugins/replicate'))
    .use(require('ssb-friends'))
    .use(require('ssb-blobs'))
    .use(require('./plugins/invite'))
    .use(require('./plugins/local'))
    .use(require('./plugins/logging'))
    .use(require('./plugins/private'))
    .use(require('ssb-query'))
    .use(require('ssb-links'))
    .use(require('./plugins/ssb-ws'))
    .use(require('ssb-ebt'))
    .use(require('./plugins/serve'))

  // add third-party plugins

  // start server

  config.keys = keys
  var server = createSbot(config)

  // write RPC manifest to ~/.ssb/manifest.json
  fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))





