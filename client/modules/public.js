var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')

exports.needs = {
  message_render: 'first',
  message_compose: 'first',
  sbot_log: 'first',
}

exports.gives = {
  screen_view: true
}

exports.create = function (api) {

  return {
    
    screen_view: function (path, sbot) {
      if(path === 'Public') {

        var content = h('div.row.scroller__content')
        var div = h('div.row.scroller',
          {style: {'overflow':'auto'}},
          h('div.col-md-12',
            api.message_compose({type: 'post'}, {placeholder: 'What are you doing right now?'}),
            content
          )
        )

        pull(
          u.next(api.sbot_log, {old: false, limit: 100}),
          Scroller(div, content, api.message_render, true, false)
        )

        pull(
          u.next(api.sbot_log, {reverse: true, limit: 100, live: false}),
          Scroller(div, content, api.message_render, false, false)
        )

        return div
      }
    }
  }
}
