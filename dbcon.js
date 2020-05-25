var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_colbethj',
  password        : '3329',
  database        : 'cs340_colbethj'
});
module.exports.pool = pool;