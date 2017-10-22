var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')

exports.needs = {
  message_content: 'first',
  message_content_mini: 'first',
  avatar: 'first',
  avatar_name: 'first',
  avatar_link: 'first',
  avatar_image_link: 'first',
  message_meta: 'map',
  message_action: 'map',
  message_link: 'first'
}

exports.gives = 'message_render'

function message_content_mini_fallback(msg)  {
  return h('code', msg.value.content.type)
}

exports.create = function (api) {

  function mini(msg, el) {
    var div = h('div.media.message.message--mini.col-sm-12',
      h('div.media-body.w-100',
        h('h6.mt-0.col-sm-3', api.avatar_link(msg.value.author, api.avatar_name(msg.value.author)),
        h('span.font-weight-light.text-muted.float-right', api.message_meta(msg))),
        el

      )
    )
    // div.setAttribute('tabindex', '0')
    return div
  }

  return function (msg, sbot) {
    var el = api.message_content_mini(msg)
    if(el) return mini(msg, el)

    var el = api.message_content(msg)
    if(!el) return mini(msg, message_content_mini_fallback(msg))
    //if(!el) return

    var links = []
    for(var k in CACHE) {
      var _msg = CACHE[k]
      if(Array.isArray(_msg.content.mentions)) {
        for(var i = 0; i < _msg.content.mentions.length; i++)
          if(_msg.content.mentions[i].link == msg.key)
          links.push(k)
      }
    }

    var backlinks = h('div.backlinks')
    if(links.length)
      backlinks.appendChild(h('label', 'backlinks:',
        h('div', links.map(function (key) {
          return api.message_link(key)
        }))
      ))

    var msg = h('div.media.w-100',
      h('div.col-sm-1.rounded', api.avatar_image_link(msg.value.author, 'img-fluid.thumbnail')),
      h('div.media-body.col-sm-11',
        h('h6.mt-0', api.avatar_link(msg.value.author, api.avatar_name(msg.value.author)),
        h('small.font-weight-light.text-muted.float-right', api.message_meta(msg))),

        h('div.message_content', el),
        h('div.small.w-100.message_actions.text-right.pull-right',
          api.message_action(msg),
          h('a', {href: '#' + msg.key}, 'Reply')
        ),
        backlinks,
      ),


      {onkeydown: function (ev) {
        //on enter, hit first meta.
        if(ev.keyCode == 13) {

          // unless in an input
          if (ev.target.nodeName === 'INPUT'
            || ev.target.nodeName === 'TEXTAREA') return

          msg.querySelector('.enter').click()
        }
      }}
    )

    // ); hyperscript does not seem to set attributes correctly.
    //msg.setAttribute('tabindex', '0')

    return msg
  }
}
