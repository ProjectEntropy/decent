var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')
var id = require('../keys').id

exports.needs = {
  publish: 'first',
  avatar_edit: 'first'
}

exports.gives = {
  screen_view: true
}

exports.create = function (api) {
  return {
    screen_view: function (path, sbot) {
      if(path === 'Edit') {
        var identify = h('input.identify', {placeholder: 'Your Name', name: 'namespace'})
        var div = h('div.scroller__wrapper',
          h('div.column.scroller__content', {style: 'margin-top: 25%;'},
            h('div.message',
              h('h1', 'Edit Your Profile'),
              h('form',
                identify,
                h('button', 'Publish Name', {onclick: function (e) {
                  if(identify.value)
                    api.publish({
                      type: 'about',
                      about: id,
                      name: identify.value || undefined,
                    }),
                    setTimeout(function() { location.reload() }, 100),
                    e.preventDefault()
                }})
              ),
              api.avatar_edit(id)
            )
          )
        )
        return div
      }  
    }
  }
}

