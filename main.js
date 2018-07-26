var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var templet = require('./lib/templet.js')
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
  host     : '115.68.221.96',
  port     : 3306,
  user     : 'test',
  password : 'eoflal72!@',
  database : 'TEST'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url,true).pathname;
    if(pathName === '/'){
      if(queryData.id === undefined) {
        db.query(`SELECT * from topic`, function(error, topics){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templet.list(topics);
          var html = templet.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      }
      else {
      db.query(`SELECT * from topic`, function(error, topics){
        if(error){
          throw error
        }
        db.query(`SELECT * from topic LEFT JOIN author ON topic.author_id = author.id where topic.id=?`,[queryData.id], function(error2, topic){
          var title = topic[0].title;
          var description = topic[0].description;
          var list = templet.list(topics);
          var html = templet.html(title, list, `<h2>${title}</h2>${description}
            <p>by ${topic[0].name}</p>`, `<a href="/create">create</a>
          <a href="/update?id=${queryData.id}">update</a>
                      <form action="delete_process" method='post'>
                        <input type='hidden' name='id' value=${queryData.id}>
                        <input type='submit' value='delete'>
                      </form>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }
    else if (pathName === '/create'){
        db.query(`SELECT * from topic`, function(error, topics){
          db.query(`SELECT * FROM author`,function(error2,authors){
            var title = 'Create';
            var list = templet.list(topics);
            var html = templet.html(title, list, `
            <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder = "description"></textarea>
            </p>
            <p>
            ${templet.authorSelect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `, `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
          });

        });

    } else if (pathName === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('data', function(data){
        var post = qs.parse(body);
        db.query(`
          INSERT INTO topic (title, description, created, author_id)
          VALUES (?, ?, NOW(),?)`, [post.title, post.description, post.author], function(error, result){
            console.log(post.title);
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          });
        });
    } else if(pathName === '/update'){
      db.query(`SELECT * from topic`, function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * from topic where id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          db.query(`SELECT * from author`, function(error3, authors){
            var title = topic[0].title;
            var description = topic[0].description;
            var list = templet.list(topics);
            var html = templet.html(title, list, `
            <form action="/update_process" method="post">
            <input type="hidden" name ="id" value="${queryData.id}"
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder = "description">${description}</textarea>
            </p>
            <p>
            ${templet.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `, `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>`);
            response.writeHead(200);
            response.end(html);
          });
        });
      });
    } else if(pathName === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body += data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
            db.query(`
              UPDATE topic set title = ?, description = ?, author_id = ? where id = ?`, [post.title, post.description, post.author, post.id], function(error, result){
                if(error){
                  throw error;
                }
                response.writeHead(302, {Location: `/?id=${post.id}`});
                response.end();
              });
          });
    }
    else if(pathName === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body += data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`DELETE FROM topic where id = ?`,[post.id],function(error,result){
            if(error){
              throw error;
            }
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
