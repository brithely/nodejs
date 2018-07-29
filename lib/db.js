var mysql = require('mysql');
var db = mysql.createConnection({
  host     : '115.68.221.96',
  port     : 3306,
  user     : 'test',
  password : 'eoflal72!@',
  database : 'TEST'
});
db.connect();
module.exports = db;
