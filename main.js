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
var templet = require('./lib/templet.js');
var db = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');
var index = require('./lib/index');
var cookie = require('cookie');

/*
function authIsOwner(request, response){
  var isOwner = false;
  var cookies = {}
  if(request.headers.cookie){
    cookies = cookie.parse(request.headers.cookie);
  }
  if(cookies.email === 'test@test.com' && cookies.password === '111111'){
    isOwner = true;
  }
    console.log(cookies);
  return isOwner;
}

function authStatusUI(){
  var authStatusUI = '<a href="/login">login</a>';
  if(authIsOwner(request,response)) {
      authStatusUI = '<a href="/logout_process">logout</a>'
  }
  return authStatusUI;
}
*/

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url,true).pathname;

    if (pathName === '/'){
      index.home(request, response);
    } else if (pathName === '/topic' && queryData.page !== 1 && queryData.id === undefined){
      topic.page(request, response);
    } else if (pathName === '/topic' && queryData.id !== undefined){
      topic.pageSelected(request, response);
    } else if (pathName === '/topic' && queryData.page !== undefined){
      topic.home(request, response);
    } else if (pathName === '/topic/create'){
      topic.create(request, response);
    } else if (pathName === '/topic/create_process'){
      topic.create_process(request, response);
    } else if (pathName === '/topic/update'){
      topic.update(request, response);
    } else if (pathName === '/topic/update_process'){
      topic.update_process(request, response);
    } else if (pathName === '/topic/delete_process'){
      topic.delete_process(request, response);
    } else if (pathName === '/author'){
      author.home(request, response);
    } else if (pathName === '/author/create_process'){
      author.create_process(request, response);
    } else if (pathName === '/author/update'){
      author.update(request, response);
    } else if (pathName === '/author/update_process'){
      author.update_process(request, response);
    } else if (pathName === '/author/delete_process'){
      author.delete_process(request, response);
    } else if (pathName === '/login'){
      index.login(request, response);
    } else if (pathName === '/login_process'){
      index.login_process(request, response);
    } else if (pathName === '/logout_process'){
      index.logout_process(request, response);
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
