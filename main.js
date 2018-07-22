var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url,true).pathname;

    if(pathName === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data/', function(error, filelist){
          var title = 'Welcome';
          var list = '<ul>';
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list = list + '</ul>';
          var description = 'Hello, Node.js';
          var templet = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}
            </p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(templet);
        });

      }
      else{
        fs.readdir('./data/', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var list = '<ul>';
            var i = 0;
            while(i < filelist.length){
              list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
              i++;
            }
            list = list + '</ul>';
            var title = queryData.id;
            var templet = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}
              </p>
            </body>
            </html>
            `;
            response.writeHead(200);
            response.end(templet);
            });
          });
        }
    }
    else {
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
