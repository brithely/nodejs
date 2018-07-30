var db = require('./db');
var templet = require('./templet.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');

exports.home = function(request, response){
  db.query(`SELECT * from topic`, function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var html = templet.html(title, `<h2>${title}</h2>${description}`, '');
    response.writeHead(200);
    response.end(html);
  });
}
