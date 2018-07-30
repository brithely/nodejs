var sanitizeHTML = require('sanitize-html');

module.exports = {
  html:function(title, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      <a href="/topic">topic</a>
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  topic:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      <a href="/topic">topic</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="topic?id=${topics[i].id}">${sanitizeHTML(topics[i].title)}</a></li>`;
      i++;
    }
    list = list + '</ul>';
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
