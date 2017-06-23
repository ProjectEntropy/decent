var http = require('http');
var serve = require('ecstatic');
var client = require('ssb-client')

exports.init = function() {
  http.createServer(
    serve({ root: __dirname + '/build/'})
  ).listen(3013);
  
  opts = {"modern": true}
  
  client(function (err, sbot) {  
    if(err) throw err
    sbot.invite.create(opts, function (err, invite) {
      if(err) throw err
      var lite = invite
      console.log('Your lite client is now listening at http://localhost:3013\nHere\'s an invite\nhttp://localhost:3013#' + invite)
    })
  })
}
