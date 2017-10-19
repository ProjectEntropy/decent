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
    var description = h('p', '')
 
    var edit

    console.log('id is: ' + id)
    console.log('self_id is: ' + self_id.id)

    if (id == self_id.id) {
      edit = h('p', h('a', {href: '#Edit'}, h('button.btn.btn-primary', 'Edit profile')))
    } else { edit = api.avatar_action(id)}

    pull(api.sbot_query({query: [{$filter: { value: { author: id, content: {type: 'about', loc: {"$truthy": true}}}}}], limit: 5, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.loc) { 
        loco.appendChild(h('span', h('strong', 'Location: '), data.value.content.loc))
      }
    }))

    pull(api.sbot_query({query: [{$filter: { value: { author: id, content: {type: 'about', description: {"$truthy": true}}}}}], limit: 5, reverse: true}),
    pull.drain(function (data){
      if(data.value.content.description) {
        description.appendChild(h('span', h('strong', 'Description: '), data.value.content.description))
      }
    }))

    return h('div.column',
      h('div.message',
        api.avatar_image(id, 'profile'), 
        api.avatar_name(id),
        loco,
        description,
        h('pre', h('code', id)),
        edit
      )/*,
      h('div.message',
        api.avatar_action(id)
      )*/
    )
  }
}

