var h = require('hyperscript')
var pull = require('pull-stream')

exports.needs = {
  avatar_image: 'first',
  avatar_name: 'first',
  avatar_action: 'map',
}

exports.gives = 'avatar_profile'

exports.create = function (api) {
  return function (id) {
    return h('div.column',
      h('div.message',
        api.avatar_image(id, 'profile'), 
        api.avatar_name(id), 
        h('pre', h('code', id))
      ),
      h('div.message',
        api.avatar_action(id)
      )
    )
  }
}

