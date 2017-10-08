var pull = require('pull-stream')

function isImage (filename) {
  return /\.(gif|jpg|png|svg)$/i.test(filename)
}

exports.needs = {
  sbot_links2: 'first',
  blob_url: 'first',
  emoji_names: 'first',
  emoji_url: 'first',
  signified: 'first',
  builtin_tabs: 'map'
}

exports.gives = {
  suggest_mentions: true,
  suggest_search: true
}

exports.create = function (api) {

  return {
    suggest_mentions: function (word) {
      return function (cb) {
        //emoji

        if (word[0] !== ':' || word.length < 2) return cb()
        word = word.substr(1)
        if (word[word.length-1] === ':') word = word.substr(0, word.length-1)
        cb(null, api.emoji_names().filter(function (name) {
          return name.substr(0, word.length) === word
        }).slice(0, 50).map(function (emoji) {
          return {
            image: api.emoji_url(emoji),
            title: emoji,
            subtitle: emoji,
            value: ':' + emoji + ':'
          }
        }))


        // names, repos, etc
        if(!/^[%&@]\w/.test(word)) return cb()

        api.signified(word, function (err, names) {
          if(err) cb(err)
          else cb(null, names.map(function (e) {
            return {
              title: e.name + ': ' + e.id.substring(0,10)+' ('+e.rank+')',
              value: '['+e.name+']('+e.id+')',
              rank: e.rank,
              //TODO: avatar images...
            }
          }))
        })
      }
    },

    suggest_search: function (query) {
      return function (cb) {
        if(/^[@%]\w/.test(query)) {
          api.signified(query, function (_, names) {
            cb(null, names.map(function (e) {
              return {
                title: e.name + ':'+e.id.substring(0, 10),
                value: e.id,
                subtitle: e.rank,
                rank: e.rank
              }
            }))
          })

        } else if(/^\//.test(query)) {
          var tabs = [].concat.apply([], api.builtin_tabs())
          cb(null, tabs.filter(function (name) {
            return name.substr(0, query.length) === query
          }).map(function (name) {
            return {
              title: name,
              value: name,
            }
          }))
        } else cb()
      }
    }
  }
}
