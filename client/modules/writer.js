var h = require('hyperscript')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')

exports.needs = {
  message_compose: 'first'
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
            api.message_compose({type: 'post'}, {placeholder: 'Write here... '})
          )
        )
        return div
      }
    }
  }
}
