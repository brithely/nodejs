var db = require('./db')
var templet = require('./templet.js')
var qs = require('querystring')
var url = require('url');
var sanitizeHTML = require('sanitize-html');

exports.home = function(request, response){
  db.query(`SELECT * from topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error2, authors){
      var title = 'Author';
      var list = templet.list(topics);
      var html = templet.html(title, list,
        `
        ${templet.authorTable(authors)}
        <style>
          table{
            border-collapse: collapse;
          }
          td{
            border:1px solid black;
          }
        </style>
        <form action="/author/create_process" method = "post">
          <p>
            <input type="text" name="name" placeholder="name">
          </p>
          <p>
            <textarea name="profile" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          </p>
        `
        ,'');
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body += data;
  });
  request.on('data', function(data){
  var post = qs.parse(body);
  db.query(`
    INSERT INTO author (name, profile) VALUES (?, ?)`, [post.name, post.profile], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/author`});
      response.end();
    });
  });
}

exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * from topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error2, authors){
      db.query(`SELECT * FROM author where id = ?`,[queryData.id], function(error3, author){
        var title = 'Author';
        var list = templet.list(topics);
        var html = templet.html(title, list,
          `
          ${templet.authorTable(authors)}
          <style>
            table{
              border-collapse: collapse;
            }
            td{
              border:1px solid black;
            }
          </style>
          <form action="/author/update_process" method = "post">
          <p>
            <input type="hidden" name="id" value="${queryData.id}">
          </p>
            <p>
              <input type="text" name="name" placeholder="${sanitizeHTML(author[0].name)}" value="${sanitizeHTML(author[0].name)}">
            </p>
            <p>
              <textarea name="profile" placeholder="description">${sanitizeHTML(author[0].profile)}</textarea>
            </p>
            <p>
              <input type="submit" value="update">
            </p>
          `
          ,'');
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

exports.update_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body += data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
        console.log(post);
        db.query(`
          UPDATE author set name = ?, profile = ? where id = ?`, [post.name, post.profile, post.id], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end();
          });
      });
}

exports.delete_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body += data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`DELETE FROM topic where author_id = ?`, [post.id],
      function(error1,result1){
        if(error1) throw error1;
        db.query(`DELETE FROM author where id = ?`, [post.id], function(error2,result2){
          if(error2){
            throw error2;
          }
          response.writeHead(302, {Location: `/author`});
          response.end();
        });
      });

  });
}
