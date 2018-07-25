var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '115.68.221.96',
  port     : 3306,
  user     : 'test',
  password : 'eoflal72!@',
  database : 'TEST'
});

connection.connect();

connection.query('SELECT * from topic', function (error, results, fields) {
  if (error){
    console.log('error');
  }
  console.log('The solution is: ', results);
});

connection.end();
