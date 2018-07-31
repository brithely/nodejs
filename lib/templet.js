var sanitizeHTML = require('sanitize-html');

module.exports = {
  html:function(title, body, control, authStatusUI = '<a href="/login">login</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      <a href="/topic?page=1">topic</a>
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  topic:function(title, list, body, control, authStatusUI = '<a href="/login">login</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      <a href="/topic?page=1">topic</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(topics){
    var list = `
    <style>
      table{
        border-collapse: collapse;
      }
      td{
        border:1px solid black;
      }
    </style>
    <table>
    `;
    for(var i = 0; i<topics.length; i++){
      list += `
      <tr>
        <td>${sanitizeHTML(topics[i].id)}</td>
        <td><a href="/topic?id=${topics[i].id}&&page=${parseInt(i/3)+1}">${sanitizeHTML(topics[i].title)}</a></td>
        <td>${sanitizeHTML(topics[i].created)}</td>
        <td>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${topics[i].id}">
            <input type="submit" value="delete">
          </form>
        </td>
      </tr>
      `;
    }
    list += '</table>';
    return list;
  },
  authorSelect:function(authors, author_id){
    var tag = '';
    for(var i = 0; i < authors.length; i++){
      var selected = '';
      if(author_id === authors[i].id){
        selected = 'selected';
      }
      tag += `<option value="${authors[i].id}" ${selected}>${sanitizeHTML(authors[i].name)}</option>`;
    }
    return `
    <select name ="author">
      ${tag}
    </select>
    `
  },
  authorTable:function(authors){
    var tag = '<table>';
    for(var i = 0; i<authors.length; i++){
      tag += `
      <tr>
        <td>${sanitizeHTML(authors[i].name)}</td>
        <td>${sanitizeHTML(authors[i].profile)}</td>
        <td><a href="/author/update?id=${authors[i].id}">update</a></td>
        <td>
          <form action="/author/delete_process" method="post">
            <input type="hidden" name="id" value="${authors[i].id}">
            <input type="submit" value="delete">
          </form>
        </td>
      </tr>
      `;
    }
    tag += '</table>';
    return tag;
  }
}
