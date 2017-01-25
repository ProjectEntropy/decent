var http = require('http')
var fs = require('fs')
var h = require('hyperscript')
var pull = require('pull-stream')
var client = require('../ssb-client')
var md = require('ssb-markdown')

var title = 'sdash'
var me = '@EVoxY2Hu75dWZxnTMaqxJS8cjeNVpTKjgSlh3lDVjvw=.ed25519'
var viewerUrl = 'http://evbogue.com:3535/'

var liteURL = 'http://decent.evbogue.com/'
var opts = {"modern":true,}
var lite;

var style = fs.readFileSync(__dirname + '/style.css', 'utf8')

exports.name = 'sdash'
exports.manifest = {}
// exports.version = require('./package').version

exports.init = function (sbot, config) {

  http.createServer(function (req, res){
    if (req.url === '/') {
      client(function (err, sbot) {
        pull(
          sbot.query.read({query: [{$filter: { value: { author: me, content: {type: 'post'}}}}], limit: 1, reverse: true}),
            pull.drain(function (data) {
            post = data
            gotPost()
            sbot.close()
          })
        )
      })
      function gotPost() {
        res.end(
        h('html',
          h('head',
            h('title', title),
            h('style', style)
          ),
          h('body',
            h('div.msg', 
              h('script', {src: viewerUrl + encodeURI(post.key) + '.js'})
            )
          )
        ).outerHTML)
      }
    }
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
            h('style', style)
          ),
          h('body',
            h('div.msg',
             h('p', {innerHTML: '<a href="' + liteURL + '#' + lite + '" rel="nofollow" target="_blank">'+ liteURL + '#' + lite + '</a>'})
            )
          )
        ).outerHTML)
      }
    }
  }).listen(1337)
  
}
