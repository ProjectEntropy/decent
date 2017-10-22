var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')

exports.gives = {
  screen_view: true
}

exports.create = function (api) {
  return {
    screen_view: function (path, sbot) {
      if(path === 'Key') {
        if(process.title === 'browser') {
          var importKey = h('textarea.import', {placeholder: 'Import your Decent public/private key', name: 'textarea', style: 'width: 97%; height: 100px;'})
          var importRemote = h('textarea.import', {placeholder: 'Import a new Decent websocket remote', name: 'textarea', style: 'width: 97%;'})
          var content = h('div.row.scroller__content')
          var div = h('div.row.scroller',
            {style: {'overflow':'auto'}},
            h('div.col-md-12',
              h('div.row.scroller__content',
                h('div.card.message',
                  h('h1', 'Your Key'),
                  h('p', {innerHTML: 'Your Decent public/private key is: <pre><code>' + localStorage['browser/.decent/secret'] + '</code></pre>'},
                    h('button.btn.btn-danger', {onclick: function (e){
                      localStorage['browser/.decent/secret'] = ''
                      alert('Your public/private key has been deleted')
                      e.preventDefault()
                      location.hash = ""
                      location.reload()
                    }}, 'Delete Key')
                  ),
                  h('hr'),
                  h('p', {innerHTML: 'Your Decent websocket remote is: <pre>' + localStorage.remote + '</pre>'},
                    h('button.btn.btn-danger', {onclick: function (e){
                      localStorage.remote = ''
                      alert('Your remote pub has been deleted')
                      e.preventDefault()
                      location.hash = ""
                      location.reload()
                    }}, 'Delete Pub')
                  ),
                  h('hr'),
                  h('form',
                    importKey,
                    importRemote,
                    h('button.btn.btn-success', {onclick: function (e){
                      if(importKey.value) {
                        localStorage['browser/.decent/secret'] = importKey.value.replace(/\s+/g, ' ')
                        e.preventDefault()
                        alert('Your public/private key has been updated')
                      }
                      if(importRemote.value) {
                        localStorage.remote = importRemote.value
                        e.preventDefault()
                        alert('Your websocket remote has been updated')
                      }
                      location.hash = ""
                      location.reload()
                    }}, 'Import')
                  )
                )
              )
            )
          )
          return div
        } else { 
          return h('p', 'Your key is saved at .decent/secret')
        }
      }
    }
  }
}

