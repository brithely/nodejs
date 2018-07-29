var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var templet = require('./lib/templet.js')
var db = require('./lib/db')
var topic = require('./lib/topic')
var author = require('./lib/author')

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url,true).pathname;
    if(pathName === '/'){
      if(queryData.id === undefined) {
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
    } else if (pathName === '/create'){
      topic.create(request, response);
    } else if (pathName === '/create_process'){
      topic.create_process(request, response);
    } else if(pathName === '/update'){
      topic.update(request, response);
    } else if(pathName === '/update_process'){
      topic.update_process(request, response);
    } else if(pathName === '/delete_process'){
      topic.delete_process(request, response);
    } else if(pathName === '/author'){
      author.home(request, response);
    } else if(pathName === '/author/create_process'){
      author.create_process(request, response);
    } else if(pathName === '/author/update'){
      author.update(request, response);
    } else if(pathName === '/author/update_process'){
      author.update_process(request, response);
    } else if(pathName === '/author/delete_process'){
      author.delete_process(request, response);
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
