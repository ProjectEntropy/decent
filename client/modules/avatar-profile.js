var h = require('hyperscript')
var pull = require('pull-stream')

exports.needs = {
  avatar_image: 'first',
  avatar_name: 'first',
  avatar_action: 'map',
  sbot_query: 'first'
}

exports.gives = 'avatar_profile'

exports.create = function (api) {

  return function (id) {
    var loco = h('p', '')
    var desc = h('p', '')

    pull(api.sbot_query({query: [{$filter: { value: { author: id, content: {type: 'about', loc: {"$truthy": true}}}}}], limit: 1, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.loc) { 
        loco.appendChild(h('span', data.value.content.loc))
      }
    }))

    pull(api.sbot_query({query: [{$filter: { value: { author: id, content: {type: 'about', description: {"$truthy": true}}}}}], limit: 1, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.description) {
        description.appendChild(h('span', data.value.content.description))
      }
    }))

    return h('div.column',
      h('div.message',
        api.avatar_image(id, 'profile'), 
        api.avatar_name(id),
        loco,
        desc,
        h('pre', h('code', id)),
        h('a', {href: '#Edit'}, 'Edit profile')
      ),
      h('div.message',
        api.avatar_action(id)
      )
    )
  }
}

