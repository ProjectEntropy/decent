var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')
var id = require('../keys').id
var getAvatar = require('ssb-avatar')

exports.needs = {
  message_confirm: 'first',
  message_compose: 'first',
  sbot_links: 'first'
}

exports.gives = {
  screen_view: true
}

exports.create = function (api) {
  return {
    screen_view: function (path, sbot) {
      if(path === 'Hello') {
        if(process.title === 'browser') {
          getAvatar({links: api.sbot_links}, id, id, function (err, avatar) {
            if (err) return err 
            name = avatar.name
          })          
          var div = h('div.scroller__wrapper',
            h('div.column.scroller__content', {style: 'margin-top: 25%;'},
              h('h1', 'Hello, ' + name),
              h('p', 'If you want, you can introduce yourself.'),
              api.message_compose({type: 'post'}, {placeholder: 'Hello World!'}),
              h('p', {innerHTML: 'Once you\'re done (or you want to skip), visit your <a href="/">Public Feed</a>'})
            )
          )
          return div
        }
      }
    }
  }
}

