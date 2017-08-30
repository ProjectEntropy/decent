var http = require('http');
var serve = require('ecstatic');
var client = require('./plugins/ssb-client')
var h = require('hyperscript')

exports.serve = function() {

  host = 'http://localhost:3001'
  title = 'decent'
  opts = {"modern": true}

  http.createServer(
    serve({ root: __dirname + '/build/'})
  ).listen(3001)

  http.createServer(function (req, res){
    if (req.url === '/invite/') {
      client(function (err, sbot) {
        sbot.invite.create(opts, function (err, invite) {
          if(err) throw err
          lite = invite
          gotInvite()
          sbot.close()
        })
      })
      function gotInvite() {
        res.end(
        h('html',
          h('head',
            h('title', title),
          ),
          h('body',
            h('div.msg',
             h('p', {innerHTML: '<a href="' + host + '#' + lite + '" rel="nofollow" target="_blank">'+ host + '#' + lite + '</a>'})
            )
          )
        ).outerHTML)
      }
    }
  }).listen(3002)
}
