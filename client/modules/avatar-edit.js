'use strict'
var dataurl = require('dataurl-')
var hyperfile = require('hyperfile')
var hypercrop = require('hypercrop')
var hyperlightbox = require('hyperlightbox')
var h = require('hyperscript')
var pull = require('pull-stream')
var getAvatar = require('ssb-avatar')
var plugs = require('../plugs')
var ref = require('ssb-ref')
var visualize = require('visualize-buffer')
var self_id = require('../keys').id

function crop (d, cb) {
  var data
  var canvas = hypercrop(h('img', {src: d}))

  return h('div.column.avatar_pic',
    canvas,
    //canvas.selection,
    h('div.row.avatar_pic__controls',
      h('button', 'Select', {onclick: function () {
        cb(null, canvas.selection.toDataURL())
      }}),
      h('button', 'Cancel', {onclick: function () {
        cb(new Error('canceled'))
      }})
    )
  )
}

exports.needs = {
  message_confirm: 'first',
  sbot_blobs_add: 'first',
  blob_url: 'first',
  sbot_links: 'first'
}

exports.gives = 'avatar_edit'

exports.create = function (api) {
  return function (id) {

    var img = visualize(new Buffer(id.substring(1), 'base64'), 256)
    img.classList.add('avatar--profile')

    var lb = hyperlightbox()
    var selected = null, selected_data = null

    getAvatar({links: api.sbot_links}, self_id, id, function (err, avatar) {
      if (err) return console.error(err)
      //don't show user has already selected an avatar.
      if(selected) return
      if(ref.isBlob(avatar.image))
        img.src = api.blob_url(avatar.image)
    })

    return h('div.row.profile',
      lb,
      img,
      h('div.column.profile__info',
        hyperfile.asDataURL(function (data) {
          var el = crop(data, function (err, data) {
            if(data) {
              img.src = data
              var _data = dataurl.parse(data)
              pull(
                pull.once(_data.data),
                api.sbot_blobs_add(function (err, hash) {
                  //TODO. Alerts are EVIL.
                  //I use them only in a moment of weakness.

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
            lb.close()
          })
          lb.show(el)
        }),
        h('button', 'Publish Photo', {
          onclick: function () {
            if(selected) {
              api.message_confirm({
                type: 'about',
                about: id,
                image: selected
              })
            }
            else
              alert('If you\'ve just uploaded an image, give it a second to reach the server. If you haven\'t selected an image or name, please do that first.')
          }
        })
      )
    )
  }
}
