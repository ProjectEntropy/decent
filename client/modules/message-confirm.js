var lightbox = require('hyperlightbox')
var h = require('hyperscript')
var u = require('../util')
var self_id = require('../keys').id

exports.needs = {
  publish: 'first', message_content: 'first', avatar: 'first',
  message_meta: 'map'
}

exports.gives = 'message_confirm'

exports.create = function (api) {
  return function (content, cb) {

    cb = cb || function () {}

    var lb = lightbox()
    document.body.appendChild(lb)

    var msg = {
      key: "DRAFT",
      value: {
        author: self_id,
        previous: null,
        sequence: null,
        timestamp: Date.now(),
        content: content
      }
    }

    var okay = h('button.btn.btn-primary', 'Publish', {onclick: function () {
      lb.remove()
      api.publish(content, cb)
    }})

    var cancel = h('button.btn', 'Cancel', {onclick: function () {
      lb.remove()
      cb(null)
    }})

    okay.addEventListener('keydown', function (ev) {
      if(ev.keyCode === 27) cancel.click() //escape
    })

    lb.show(h('div.column.message-confirm',
      h('div.card.message', 
        h('div.title.row',
          h('div.avatar', api.avatar(msg.value.author, 'thumbnail')),
          h('div.card.message_meta.row', api.message_meta(msg))
        ),
        h('div.card.message_content', 
          api.message_content(msg) || h('pre', JSON.stringify(msg, null, 2))), 
        h('div.row.message-confirm__controls', okay, cancel)
      )
    ))

    okay.focus()
  }
}

