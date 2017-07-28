var h = require('hyperscript')
var u = require('minbase/util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')
var id = require('minbase/keys').id

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
      if(path === 'Help') {
        if(process.title === 'browser') {
          var identify = h('input.identify', {placeholder: 'Your Name', name: 'namespace'})
          var div = h('div.column.scroller', {style: 'overflow: auto;'},
            h('div.scroller__wrapper',
              h('div.column.scroller__content',
                h('div.message',
                  h('h3', 'What is Decent?'),
                  h('p', 'Decent is a lite client for Scuttlebot distributed social network. You can use it on your desktop, over the Internet, or as a social replacement for your website'),
                  h('h3', 'Why isn\'t Decent connecting?'),
                  h('p', 'If the connection status light is red, you\'re not connected. There are a number of reasons why this could happen. The simplest reason is the sbot server you\'re trying to connect to is off. If you\'re using the lite client, you need a invite to get started. On your local, an invite will be generated for you. If you\'re using the lite client over the Internet, here is an invite:'),
                  h('iframe', {src: 'http://evbogue.com:1337/invite/', style: 'width: 100%; border: none; height: 4.5em;'}),
                  h('h3', 'Tech support'),
                  h('p', 'If nothing works, don\'t hesitate to file an issue, so we can help you get on the network.'),
                  h('ul',
                    h('li', {innerHTML: 'minbase [<a href="http://gitmx.com/%25%2BtyUthD1L689osLUj8LNLV4smRKpO7Wu07DB%2BLMd7TQ%3D.sha256">Gitmx</a>] [<a href="http://github.com/evbogue/minbase">Github</a>]'}),
                    h('li', {innerHTML: 'decent [<a href="http://gitmx.com/%25Wq%2FvobdcDedC0FBO2UdowxhPcqokSwtf9Og1mjYvQGE%3D.sha256">Gitmx</a>] [<a href="http://github.com/evbogue.com/decent">Github</a>]'}),
                    h('li', {innerHTML: 'scuttlebot [<a href="http://gitmx.com/%25M0TrM%2BoJT2i%2FphUJO%2FfZ2wkK2AN2FB1xK0tqR7SNj58%3D.sha256">Gitmx</a>] [<a href="http://github.com/ssbc/scuttlebot">Github</a>]'})
                  ),
                  h('p', {innerHTML: 'If all else fails, email <a href="mailto:ev@evbogue.com">ev@evbogue.com</a>'})
               
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

