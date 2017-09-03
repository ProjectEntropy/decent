var fs = require('fs')
var path = require('path')
module.exports = {
  _: fs.readFileSync(path.join(__dirname, 'api.md'), 'utf-8'),
  gossip: fs.readFileSync(path.join(__dirname, '../plugins/gossip.md'), 'utf-8'),
  invite: fs.readFileSync(path.join(__dirname, '../plugins/invite.md'), 'utf-8'),
  'private': fs.readFileSync(path.join(__dirname, '../plugins/private.md'), 'utf-8'),
  //replicate: fs.readFileSync(path.join(__dirname, '../plugins/replicate.md'), 'utf-8')
}
