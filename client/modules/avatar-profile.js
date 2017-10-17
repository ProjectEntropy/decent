var h = require('hyperscript')
var pull = require('pull-stream')
var self_id = require('../keys')

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
 
    var edit

    console.log('id is: ' + id)
    console.log('self_id is: ' + self_id.id)

    if (id == self_id.id) {
      edit = h('p', h('a', {href: '#Edit'}, 'Edit profile'))
    } 

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
        edit
      ),
      h('div.message',
        api.avatar_action(id)
      )
    )
  }
}

