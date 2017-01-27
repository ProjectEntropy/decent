var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')
var id = require('../keys').id

exports.needs = {
  publish: 'first'
}

exports.gives = {
  screen_view: true
}

exports.create = function (api) {
  return {
    screen_view: function (path, sbot) {
      if(path === 'Identify') {
        if(process.title === 'browser') {
          var identify = h('input.identify', {placeholder: 'Your Name', name: 'namespace'})
          var div = h('div.scroller__wrapper',
            h('div.column.scroller__content', {style: 'margin-top: 25%;'},
              h('h1', 'You\'re in! Now, you need a name'),
              h('p', {innerHTML: '<p>You\'ve just generated a new public/private keypair: <pre><code>' + localStorage['browser/.ssb/secret'] + '</code></pre> You\'re the only person with access to the private key. If you want to hang onto this identity, save this key somewhere safe.<hr />'}),
              h('p', {innerHTML: 'Right now, you\'re only identified by your public key: <code>' + id + '</code></p><p>Start by giving yourself a name:'},
                h('form',
                  identify,
                  h('button', 'Save', {onclick: function (e) {
                    if(identify.value)
                      api.publish({
                        type: 'about',
                        about: id,
                        name: identify.value || undefined,
                      }),
                      setTimeout(function() { location.hash = '' }, 100),
                      e.preventDefault()
                  }})
                )
              )
            )
          )
          return div
        }
      }
    }
  }
}

