var h = require('hyperscript')
var pull = require('pull-stream')
var getAvatar = require('ssb-avatar')
var visualize = require('visualize-buffer')
var ref = require('ssb-ref')

exports.needs = {
  avatar_action: 'map',
  avatar_name: 'first',
  sbot_links: 'first',
  blob_url: 'first'
}

exports.gives = 'avatar_profile'

exports.create = function (api) {
  return function (id) {
    var img = visualize(new Buffer(id.substring(1), 'base64'), 256)
    img.classList.add('avatar--profile')
    var name = api.avatar_name(id)
    
    getAvatar({links: api.sbot_links}, id, id, function (err, avatar) {
      if (err) return console.error(err)
      //name = avatar.name
      if(ref.isBlob(avatar.image))
        img.src = api.blob_url(avatar.image)
    })

    return h('div.column.profile',
      h('div.message',
        h('a', {href: '#' + id}, img, 
          h('h1', name)
        ),
        api.avatar_action(id)
      )
    )
  }
}

