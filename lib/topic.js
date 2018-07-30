var db = require('./db');
var templet = require('./templet.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');

exports.home = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT id, title, description, DATE_FORMAT(created, '%Y-%m-%d %H:%i:%S') as 'created', author_id from topic ORDER BY id DESC LIMIT 3`, function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = templet.list(topics);
    var html = templet.topic(title, list,
    `
    <h2>${title}</h2>${description}
    `,
    `
    <a href="/topic?page=${parseInt(queryData.page)+1}">Next</a>
    <a href="/topic/create">create</a>
    `);
    response.writeHead(200);
    response.end(html);
  });
}


exports.page = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT id, title, description, DATE_FORMAT(created, '%Y-%m-%d %H:%i:%S') as 'created', author_id from topic ORDER BY id DESC LIMIT 3 OFFSET ?`, [(parseInt(queryData.page)*3)-3], function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = templet.list(topics);
    var html = templet.topic(title, list,
    `
    <h2>${title}</h2>${description}
    `,
    `
    <a href="/topic?page=${parseInt(queryData.page)+1}">Next</a>
    <a href="/topic/create">create</a>
    `);
    response.writeHead(200);
    response.end(html);
  });
}

exports.pageSelected = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT id, title, description, DATE_FORMAT(created, '%Y-%m-%d %H:%i:%S') as 'created', author_id from topic ORDER BY id DESC LIMIT 3 OFFSET ?`, [(parseInt(queryData.page)*3)-3], function(error, topics){
    if(error){
      throw error
    }
    var query = db.query(`SELECT * from topic LEFT JOIN author ON topic.author_id = author.id where topic.id=?`,[queryData.id], function(error2, topic){
      var title = topic[0].title;
      var description = topic[0].description;
      var list = templet.list(topics);
      var html = templet.topic(title, list, `
        <h2>${sanitizeHTML(title)}</h2>${sanitizeHTML(description)}
        <p>by ${sanitizeHTML(topic[0].name)}</p>`,
        `
        <a href="/topic?page=${parseInt(queryData.page)+1}">Next</a>
        <a href="/topic/create">create</a>
        <a href="/topic/update?id=${queryData.id}">update</a>
        `);
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create = function(request, response){
  db.query(`SELECT * from topic`, function(error, topics){
    db.query(`SELECT * FROM author`,function(error2,authors){
      var title = 'Create';
      var list = templet.list(topics);
      var html = templet.topic(sanitizeHTML(title), list, `
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
      `, `<a href="/topic/create">create</a>`);
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
    INSERT INTO topic (title, description, created, author_id)
    VALUES (?, ?, NOW(),?)`, [post.title, post.description, post.author], function(error, result){
      console.log(post.title);
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/topic?id=${result.insertId}`});
      response.end();
    });
  });
}

exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
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
        var html = templet.topic(sanitizeHTML(title), list, `
        <form action="/topic/update_process" method="post">
        <input type="hidden" name ="id" value="${queryData.id}"
        <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(title)}"></p>
        <p>
          <textarea name="description" placeholder = "description">${sanitizeHTML(description)}</textarea>
        </p>
        <p>
        ${templet.authorSelect(authors, topic[0].author_id)}
        </p>
        <p>
          <input type="submit">
        </p>
        </form>
        `, `<a href="/topic/create">create</a>
        <a href="/topic/update?id=${queryData.id}">update</a>`);
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
        db.query(`
          UPDATE topic set title = ?, description = ?, author_id = ? where id = ?`, [post.title, post.description, post.author, post.id], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/topic?id=${post.id}`});
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
      db.query(`DELETE FROM topic where id = ?`,[post.id],function(error,result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/topic`});
        response.end();
      });
  });
}
