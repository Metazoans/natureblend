const mariadb = require('mariadb/callback');
const sqlList = require('./sql.js');

const connectionPool = mariadb.createPool({
  host : process.env.MYSQL_HOST,
  port : process.env.MYSQL_PORT,
  user : process.env.MYSQL_USER,
  password : process.env.MYSQL_PWD,
  database : process.env.MYSQL_DB,
  connectionLimit : process.env.MYSQL_LIMIT,

  //trace : true, //log
  logger: {
    query: (msg) => console.info(msg),
    error: (err) => console.error(err),
  },
  permitSetMultiParamEntries : true, //parameter가 객체일 경우 escape 작업
  insertIdAsNumber : true,           //insertId를 Number 타입으로
  bigIntAsNumber : true,             //bigInt를 자동으로 Number 타입으로
});

const query = (alias, values)=>{
  return new Promise((resolve, reject)=>{
    //let executeSql = sqlList[alias];
    let executeSql = sqlList[alias] + (typeof values == 'string' && values != '' ? values : '');
    connectionPool.query(executeSql, values, (err, results)=>{
      if(err) {
        reject({err});
      }else{
        resolve(results);
      }
    });
  });
};


// const query = async (alias, values) => {
//   let executeSql = sqlList[alias]
//   console.log('executeSql', executeSql)
//   let conn
//   try{
//     conn = await connectionPool.getConnection()
//     return await conn.query(executeSql, values)
//   }catch(err){
//     throw err
//   }finally{
//     if(conn) await conn.release()
//   }
// }

module.exports = {
  query,
}