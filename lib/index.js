var db = require('./db');
var templet = require('./templet.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');
var cookie = require('cookie');
var http = require('http');

function authIsOwner(request, response){
  var isOwner = false;
  var cookies = {}
  if(request.headers.cookie){
    cookies = cookie.parse(request.headers.cookie);
  }
  if(cookies.email === 'test@test.com' && cookies.password === '111111'){
    isOwner = true;
  }
  return isOwner;
}

function authStatusUI(request, response){
  var authStatusUI = '<a href="/login">login</a>';
  if(authIsOwner(request,response)) {
      authStatusUI = '<a href="/logout_process">logout</a>';
  }
  return authStatusUI;
}

exports.home = function(request, response){
  db.query(`SELECT * from topic`, function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var html = templet.html(title, `<h2>${title}</h2>${description}`, '', authStatusUI(request, response));
    response.writeHead(200);
    response.end(html);
  });
}

exports.login = function(request, response){
  db.query(`SELECT * from topic`, function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var html = templet.html(title,
      `
      <form action="/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>
      `, '',authStatusUI(request, response));
    response.writeHead(200);
    response.end(html);
  });
}

exports.login_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body += data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      if(post.email === 'test@test.com' && post.password === '111111'){
        response.writeHead(302, {'Set-Cookie':[
          `email=${post.email}`,
          `password=${post.password}`,
          `nickname=Test`
        ], Location:'/'});
        response.end();
      }
      else {
        response.end('Who?');
      }
    });
}

exports.logout_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body += data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
          response.writeHead(302, {'Set-Cookie':[
          `email=; Max-Age=0`,
          `password=; Max-Age=0`,
          `nickname=; Max-Age=0`
        ], Location:'/'});
        response.end();
    });
}
