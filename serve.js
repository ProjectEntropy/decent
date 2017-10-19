var http = require('http');
var serve = require('ecstatic');

exports.init = function() {
  http.createServer(
    serve({ root: __dirname + '/build/'})
  ).listen(3001)
}
