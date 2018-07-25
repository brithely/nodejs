var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var templet = require('./lib/templet.js')
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url,true).pathname;
    if(pathName === '/'){
      if(queryData.id === undefined) {
        fs.readdir('./data/', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templet.list(filelist);
          var html = templet.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      }
      else {
        fs.readdir('./data/', function(error, filelist){
          var filteredID = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredID}`, 'utf8', function(err, description){
            var list = templet.list(filelist);
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']});
            var html = templet.html(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a>
            <a href="/update?id=${sanitizedTitle}">update</a>
            <form action="delete_process" method='post'>
              <input type='hidden' name='id' value=${sanitizedTitle}>
              <input type='submit' value='delete'>
            </form>
              `
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    }
    else if (pathName === '/create'){
      fs.readdir('./data/', function(error, filelist){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templet.list(filelist);
        var html = templet.html(title, list, `
          <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder = "description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
          `, '');
        response.writeHead(200);
        response.end(html);
        });
    } else if (pathName === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
        });
    } else if(pathName === '/update'){
      fs.readdir('./data/', function(error, filelist){
      var filteredID = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredID}`, 'utf8', function(err, description){
          var list = templet.list(filelist);
          var title = queryData.id;
          var html = templet.html(title, list, `
            <form action="/update_process" method="post">
            <input type="hidden" name ="id" value="${title}"
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder = "description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `, '');
          response.writeHead(200);
          response.end(html);
          });
      });
    } else if(pathName === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body += data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(error){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
              })
            })

          });
    }
    else if(pathName === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body += data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredID = path.parse(id).base;
          fs.unlink(`data/${filteredID}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
    }
    else {
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
