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

        var content = h('div.row.scroller__content')
        var div = h('div.row.scroller',
          {style: {'overflow':'auto'}},
          h('div.col-md-12',
            api.message_compose({type: 'post'}, {placeholder: 'Write here... '})
          )
        )
        return div
      }
    }
  }
}
