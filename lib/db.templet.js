var mysql = require('mysql');
var db = mysql.createConnection({
  host     : '115.68.221.96',
  port     : 3306,
});
db.connect();
module.exports = db;
