var path = require('path')
var home = require('os-homedir')

var nonPrivate = require('non-private-ip')
var merge = require('deep-extend')

var id = require('ssb-keys')

console.log(id)

var RC = require('rc')

var SEC = 1e3
var MIN = 60*SEC

module.exports = function (name, override) {
  //name = name || 'ssb'
  name = name || 'decent'
  var HOME = home() || 'browser' //most probably browser
  return RC(name, merge({
    //just use an ipv4 address by default.
    //there have been some reports of seemingly non-private
    //ipv6 addresses being returned and not working.
    //https://github.com/ssbc/scuttlebot/pull/102
    host: nonPrivate.v4 || '',
    port: 3333,
    timeout: 0,
    pub: true,
    local: true,
    friends: {
      dunbar: 150,
      hops: 3
    },
    ws: {
      port: 3939,
      remote: 'ws://decent.evbogue.com:3939~shs:hvITDG3iM3iJEy91XmlBKKf4VHgzU+0LLH/VD+AVhOE='
    },
    gossip: {
      connections: 3
    },
    path: path.join(HOME, '.' + name),
    timers: {
      connection: 0,
      reconnect: 5*SEC,
      ping: 5*MIN,
      handshake: 5*SEC
    },
    caps: { 
      shs: 'EVRctE2Iv8GrO/BpQCF34e2FMPsDJot9x0j846LjVtc=',
      //shs: '1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=',
      sign: null
    },
    master: [],
    party: true //disable quotas
  }, override || {}))
}
