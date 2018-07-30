/*
const express = require('express')
const app = express();

//route, routing
app.get('/', (req, res) => res.send('Hello WORLD'))

app.get('/page', (req, res) => res.send('This is PAGE'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
*/
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var templet = require('./lib/templet.js')
var db = require('./lib/db')
var topic = require('./lib/topic')
var author = require('./lib/author')
var index = require('./lib/index')

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url,true).pathname;
    if(pathName === '/'){
        index.home(request, response);
    } else if (pathName === '/topic' && queryData.id != undefined){
      topic.page(request, response);
    } else if (pathName === '/topic'){
      topic.home(request, response);
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
