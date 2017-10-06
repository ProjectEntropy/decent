var emojis = require('emoji-named-characters')
var emojiNames = Object.keys(emojis)

exports.needs = { 
  blob_url: 'first' 
}

exports.gives = { 
  emoji_names: true, 
  emoji_url: true,
  suggest_mentions: true
}

exports.create = function (api) {
  return {
    suggest_mentions: function (word) {
      return function (cb) {
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
      }
    },
    emoji_names: function () {
      return emojiNames
    },
    emoji_url: function (emoji) {
      return emoji in emojis &&
        api.blob_url(emoji).replace(/\/blobs\/get/, '/img/emoji') + '.png'
    }
  }
}

