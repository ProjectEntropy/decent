var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')

exports.needs = {
  avatar_name: 'first',
  avatar_link: 'first',
  message_confirm: 'first',
  message_link: 'first',
}

exports.gives = {
  message_content_mini: true,
}

exports.create = function (api) {
  var exports = {}

  exports.message_content_mini = function (msg, sbot) {
    if(msg.value.content.type !== 'nudge') return
    return h('span', 'nudged ', api.avatar_link(msg.value.content.id, api.avatar_name(msg.value.content.id)))
  }
  
	return exports
}
