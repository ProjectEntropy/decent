var ip = require('ip')
var onWakeup = require('on-wakeup')
var onNetwork = require('on-change-network')
var hasNetwork = require('has-network')
var pull = require('pull-stream')

function stringify(peer) {
  return [peer.host, peer.port, peer.key].join(':')
}

function not (fn) {
  return function (e) { return !fn(e) }
}

function and () {
  var args = [].slice.call(arguments)
  return function (value) {
    return args.every(function (fn) { return fn.call(null, value) })
  }
}

function delay (failures, factor, max) {
  return Math.min(Math.pow(2, failures)*factor, max || Infinity)
}

function maxStateChange (M, e) {
  return Math.max(M, e.stateChange || 0)
}

function peerNext(peer, opts) {
  return (peer.stateChange|0) + delay(peer.failure|0, opts.factor, opts.max)
}

function isOffline (e) {
  if(ip.isLoopback(e.host)) return false
  return !hasNetwork()
}

var isOnline = not(isOffline)

function isLocal (e) {
  //return ip.isPrivate(e.host) && e.type === 'local'
  return ip.isPrivate(e.host) && e.type === 'local'
}

function isUnattempted (e) {
  return !e.stateChange
}

function isInactive (e) {
  //return e.stateChange && e.duration.mean == 0
  return e.stateChange && (!e.duration || e.duration.mean == 0)
}

function isLongterm (e) {
  //return e.ping && e.ping.rtt.mean > 0
  return e.ping && e.ping.rtt && e.ping.rtt.mean > 0
}

function isLegacy (peer) {
  // return peer.duration.mean > 0 && !exports.isLongterm(peer)
  return peer.duration && (peer.duration && peer.duration.mean > 0) && !exports.isLongterm(peer)
}

function isConnect (e) {
  return 'connected' === e.state || 'connecting' === e.state
}

function earliest(peers, n) {
  return peers.sort(function (a, b) {
    return a.stateChange - b.stateChange
  }).slice(0, Math.max(n, 0))
}

function select(peers, ts, filter, opts) {
  if(opts.disable) return []
  //opts: { quota, groupMin, min, factor, max }
  var type = peers.filter(filter)
  var unconnect = type.filter(not(isConnect))
  var count = Math.max(opts.quota - type.filter(isConnect).length, 0)
  var min = unconnect.reduce(maxStateChange, 0) + opts.groupMin
  if(ts < min) return []

  return earliest(unconnect.filter(function (peer) {
    return peerNext(peer, opts) < ts
  }), count)
}

var schedule = exports = module.exports =
function (gossip, config, server) { 

  var min = 60e3, hour = 60*60e3

  onWakeup(gossip.reconnect)
  onNetwork(gossip.reconnect)

  function conf(name, def) {
    if(!config.gossip) return def
    var value = config.gossip[name]
    return (value === undefined || value === '') ? def : value
  }

  function connect (peers, ts, name, filter, opts) {
    var connected = peers.filter(isConnect).filter(filter)
      .filter(function (peer) {
        return peer.stateChange + 10e3 < ts
      })

    if(connected.length > opts.quota) {
      return earliest(connected, connected.length - opts.quota)
        .forEach(function (peer) {
          console.log('Disconnect', name, stringify(peer))
          gossip.disconnect(peer)
        })
    }

    select(peers, ts, and(filter, isOnline), opts)
      .forEach(function (peer) {
        console.log('-Connect', name, stringify(peer))
        gossip.connect(peer)
      })
  }
  function connections () {
    var ts = Date.now()
    var peers = gossip.peers()

    //quota, groupMin, min, factor, max

    connect(peers, ts, 'attempt', exports.isUnattempted, {
      min: 0, quota: 10, factor: 0, max: 0, groupMin: 0,
      disable: !conf('global', true)
    })

    connect(peers, ts, 'retry', exports.isInactive, {
      min: 0,
      quota: 1, factor: 5*60e3, max: 3*60*60e3, groupMin: 5*50e3
    })

    connect(peers, ts, 'legacy', exports.isLegacy, {
      quota: 3, factor: 5*min, max: 3*hour, groupMin: 5*min,
      disable: !conf('global', true)
    })

    connect(peers, ts, 'longterm', exports.isLongterm, {
      quota: 3, factor: 10e3, max: 10*min, groupMin: 5e3,
      disable: !conf('global', true)
    })

    connect(peers, ts, 'local', exports.isLocal, {
      quota: 3, factor: 2e3, max: 10*min, groupMin: 1e3,
      disable: !conf('local', true)
    })
  }

  pull(
    gossip.changes(),
    pull.drain(function (ev) {
      if(ev.type == 'disconnect')
        connections()
    })
  )

  var int = setInterval(connections, 2e3)
  if(int.unref) int.unref()

  connections()
}

exports.isUnattempted = isUnattempted
exports.isInactive = isInactive
exports.isLongterm = isLongterm
exports.isLegacy = isLegacy
exports.isLocal = isLocal
exports.isConnectedOrConnecting = isConnect
exports.select = select
