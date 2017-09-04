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
      if(path === 'Compose') {

        var content = h('div.column.scroller__content')
        var div = h('div.column.scroller',
          {style: {'overflow':'auto'}},
          h('div.scroller__wrapper',
            api.message_compose({type: 'post'}, {placeholder: 'Write here... '}),
            content
          )
        )

        return div
      }
    }
  }
}
