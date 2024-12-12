//const mysql = require('mysql');
const mariadb = require('mariadb/callback');
const sqlList = require('./sql.js');

//const connectionPool = mysql.createPool({
const connectionPool = mariadb.createPool({
  host : process.env.MYSQL_HOST,
  port : process.env.MYSQL_PORT,
  user : process.env.MYSQL_USER,
  password : process.env.MYSQL_PWD,
  database : process.env.MYSQL_DB,
  connectionLimit : process.env.MYSQL_LIMIT,

  trace : true, //log
  permitSetMultiParamEntries : true, //parameter가 객체일 경우 escape 작업
  insertIdAsNumber : true,           //insertId를 Number 타입으로
  bigIntAsNumber : true,             //bigInt를 자동으로 Number 타입으로
});

const query = (alias, values)=>{
  return new Promise((resolve, reject)=>{
    let executeSql = sqlList[alias];
    connectionPool.query(executeSql, values, (err, results)=>{
      if(err) {
        reject({err});
      }else{
        resolve(results);
      }
    });
  });
};

// const query = (alias, values)=>{
//   let executeSql = sqlList[alias];
//   let conn;
//   try{
//     const res = await conn.query('select 1', [2]);
//     console.log(res); // [{ "1": 1 }]
//     return res;
//   }catch(err){
//     console.log
//   } 
// };

module.exports = {
  query,
}