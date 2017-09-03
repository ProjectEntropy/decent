var fs = require('fs')
var path = require('path')
module.exports = {
  _: fs.readFileSync(path.join(__dirname, 'api.md'), 'utf-8'),
  gossip: fs.readFileSync(path.join(__dirname, '../plugins/gossip.md'), 'utf-8'),
}
