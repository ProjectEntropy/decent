var h = require('hyperscript')

function idLink (id) {
  return h('a', {href:'#'+id}, id.substring(0, 10)+'...')
}

exports.needs = {
  blob_url: 'first'
}

exports.gives = 'message_content'

exports.create = function (api) {
  return function (msg) {
    if(msg.value.content.type == 'about') {
      var about = msg.value.content
      var id = msg.value.content.about
      return h('p', 
        about.about === msg.value.author
          ? h('span', 'self-identifies ')
          : h('span', 'identifies ', idLink(id)),
        ' as ',
        h('a', {href:"#"+about.about},
          about.name || null,
          about.image
          ? h('img.avatar--large', {src: api.blob_url(about.image)})
          : null
        )
      )
    } 
  }
}
