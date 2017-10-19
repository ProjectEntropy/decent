'use strict'
var dataurl = require('dataurl-')
var hyperfile = require('hyperfile')
var hypercrop = require('hypercrop')
var hyperlightbox = require('hyperlightbox')
var h = require('hyperscript')
var pull = require('pull-stream')
var id = require('../keys').id

function crop (data, cb) {
  var data

  var canvas = hypercrop(h('img', {src: data}))

  return h('div.column.avatar--profile',
    canvas,
    //canvas.selection,
    h('button.btn.btn-success', {onclick: function () {
      cb(null, canvas.selection.toDataURL())
    }}, 'Select'),
    h('button.btn', {onclick: function () {
      cb(new Error('canceled'), 'Cancel')
    }})
  )
}

exports.needs = {
  message_confirm: 'first',
  sbot_blobs_add: 'first',
  blob_url: 'first',
  sbot_links: 'first',
  avatar_image: 'first'
}

exports.gives = 'avatar_edit'

exports.create = function (api) {
  return function () {

    var img = api.avatar_image(id, 'profile')

    var lb = hyperlightbox()
    var selected = null, selected_data = null

    return h('div.row.profile',
      lb,
      img,
      h('div',
        h('strong', name),
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
        h('button.btn.btn-primary', 'Preview', {onclick: function () {
          if(selected)
            api.message_confirm({
              type: 'about',
              about: id,
              name: name_input.value || undefined,
              image: selected
            })
          else { 
            alert('must select a name or image')
          }
        }})
      )
    )
  }
}
