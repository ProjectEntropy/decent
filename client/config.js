var config = require('./../config/inject.js')(process.env.ssb_appname)

var URL = require('url')

module.exports = function () {

  // set a default ws.remote if there is none, overrideable in the client
  if ((localStorage.remote === undefined) || (localStorage.remote === '')) {
    localStorage.remote = config.ws.remote
  }
  
  var remote = 'undefined' === typeof localStorage
    ? null //'ws://localhost:8989~shs:' + require('./keys')
    : localStorage.remote

  //var remote = config.ws.remote

  //TODO: use _several_ remotes, so if one goes down,
  //      you can still communicate via another...
  //      also, if a blob does not load, use another pub...

  //if we are the light client, get our blobs from the same domain.
  var blobsUrl
  if(remote) {
    var r = URL.parse(remote.split('~')[0])
    //this will work for ws and wss.
    r.protocol = r.protocol.replace('ws', 'http')
    r.pathname = '/blobs/get'
    blobsUrl = URL.format(r)
  }
  else
    blobsUrl = 'http://localhost:8989/blobs/get'

  return {
    remote: remote,
    blobsUrl: blobsUrl
  }
}


