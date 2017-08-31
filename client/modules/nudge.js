var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')

exports.needs = {
  avatar_name: 'first',
  avatar_link: 'first',
  message_confirm: 'first',
}

exports.gives = {
  message_content: true,
  message_content_mini: true,
  avatar_action: true,
}

exports.create = function (api) {
  var exports = {}

  exports.message_content =
  exports.message_content_mini = function (msg, sbot) {
    if(msg.value.content.type == 'nudge') {
      return h('span', 'nudged ', api.avatar_link(msg.value.content.id, api.avatar_name(msg.value.content.id)))
    }
  }
 
  exports.avatar_action = function (id) {
    return h('a', {href:'#', onclick: function () {
      api.message_confirm({
        type: 'nudge',
        id: id
      })
    }}, h('button', 'Nudge'))
  }

  return exports
}
