const mysql = require('../database/mapper.js');

// 전체조회
const findMeterialOrder = async (keywords)=>{
  let sql = Object.keys(keywords).length == 0 ? 'searchMaterialOrder' : 'searchMaterialOrderWithName';
  let list = await mysql.query(sql, keywords);
  return list;
}


module.exports = {
  findMeterialOrder,

};