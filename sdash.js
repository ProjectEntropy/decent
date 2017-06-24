var http = require('http')
var fs = require('fs')
var h = require('hyperscript')
var pull = require('pull-stream')
var client = require('ssb-client')
var md = require('ssb-markdown')

var config = require('ssb-config/inject')(process.env.ssb_appname)
var ssbKeys = require('ssb-keys')
var path = require('path')

var title = 'Decent'
var opts = {"modern":true,}
var lite;

var style = fs.readFileSync(__dirname + '/node_modules/sdash/style.css', 'utf8')

exports.name = 'sdash'
exports.manifest = {}
exports.version = require('./package').version

exports.init = function (sbot, config) {

  var viewerUrl = 'http://' + config.host + ':8807/'
  var liteURL = 'http://' + config.host + ':3013/'
  var id = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret')).id

  http.createServer(function (req, res){
    if (req.url === '/') {
      client(function (err, sbot) {
        pull(
          sbot.query.read({query: [{$filter: { value: { author: id, content: {type: 'post'}}}}], limit: 1, reverse: true}),
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
