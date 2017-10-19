var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')
var id = require('../keys').id
var ref = require('ssb-ref')

exports.needs = {
  message_confirm: 'first',
  avatar_edit: 'first'
}

exports.gives = {
  screen_view: true
}

exports.create = function (api) {
  return {
    screen_view: function (path, sbot) {
      if(path === 'Edit') {
        var nameInput = h('input', {placeholder: 'New name'})

        var locInput = h('input', {placeholder: 'New location'})

        var descInput = h('textarea', {placeholder: 'New description', style: 'width: 97%;'})

        var div = h('div.column.scroller', {style: 'overflow: auto;'},
          h('div.scroller__wrapper',
            h('div.column.scroller__content',
              h('div.message',
                h('h1', 'Edit profile'),
                nameInput,
                h('button.btn.btn-primary', 'Preview', {onclick: function () {
                  if(nameInput.value) {
                    api.message_confirm({
                      type: 'about',
                      about: id,
                      name: nameInput.value || undefined
                    })
                  }
                }}),
                h('hr'),
                locInput,
                h('button.btn.btn-primary', 'Preview', {onclick: function () {
                  if(locInput.value) {
                    api.message_confirm({
                      type: 'about',
                      about: id,
                      loc: locInput.value || undefined
                    })
                  }
                }}),
                h('hr'),
                descInput,
                h('button.btn.btn-primary', 'Preview', {onclick: function (){
                  if(descInput.value) {
                    api.message_confirm({
                      type: 'about',
                      about: id,
                      description: descInput.value || undefined      
                    })
                  }
                }}),
                h('hr'),
                api.avatar_edit 
              )
            )
          )
        )
        return div
      }
    }
  }
}

