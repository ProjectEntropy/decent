var fs = require('fs')
var path = require('path')

fs.writeFileSync(
  path.join(__dirname, '..', 'decent.css.json'),
  JSON.stringify(fs.readFileSync(path.join(__dirname, '..', 'decent.css'), 'utf8'))
)

