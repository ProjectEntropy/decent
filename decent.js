var fs = require('fs')
var http = require('http')
var serve = require('ecstatic')
var path = require('path')
var ssbKeys = require('ssb-keys')
var stringify = require('pull-stringify')
var config = require('./plugins/ssb-config/inject')(process.env.ssb_appname)

var keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

var manifestFile = path.join(config.path, 'manifest.json')

var createSbot = require('./lib')
  .use(require('./plugins/master'))
  .use(require('./plugins/gossip'))
  .use(require('./plugins/replicate'))
  .use(require('ssb-friends'))
  .use(require('ssb-blobs'))
  .use(require('./plugins/local'))
  .use(require('ssb-query'))
  .use(require('ssb-links'))
  .use(require('./plugins/ssb-ws'))
  .use(require('ssb-ebt'))

config.keys = keys
var server = createSbot(config)

fs.writeFileSync(
  manifestFile, JSON.stringify(server.getManifest(), null, 2)
)

http.createServer(
  serve({ root: __dirname + '/build'})
).listen(3001)

