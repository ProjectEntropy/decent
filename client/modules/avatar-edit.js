'use strict'
var dataurl = require('dataurl-')
var hyperfile = require('hyperfile')
var hypercrop = require('hypercrop')
var hyperlightbox = require('hyperlightbox')
var h = require('hyperscript')
var pull = require('pull-stream')
var id = require('../keys').id

exports.needs = {
  message_confirm: 'first',
  sbot_blobs_add: 'first',
  avatar_image: 'first'
}

exports.gives = 'avatar_edit'

exports.create = function (api) {
  return function () {
    var img = api.avatar_image(id, 'profile')

    var selected = null, selected_data = null

    return h('div.row.profile',
      img,
      h('div',
        h('strong', name),
        hyperfile.asDataURL(function (data) {
          if(data) {
            img.src = data
            var _data = dataurl.parse(data)
            pull(
              pull.once(_data.data),
              api.sbot_blobs_add(function (err, hash) {
                if(err) return alert(err.stack)
                selected = {
                  link: hash,
                  size: _data.data.length,
                  type: _data.mimetype,
                  width: 512,
                  height: 512
                }
              })
            )
          }
        }),
        h('br'),
        h('button.btn.btn-primary', 'Preview Image', {onclick: function() {
          if(selected) {
            api.message_confirm({
              type: 'about',
              about: id,
              image: selected
            })
          } else { alert('select an image before hitting preview')}
        }})
      )
    )
  }
}
