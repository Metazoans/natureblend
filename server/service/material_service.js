const mysql = require('../database/mapper.js');


//material_order_head


// 전체조회
const allmaterial = async ()=>{
  let list = await mysql.query('material_order_head');
  return list;
}

module.exports = {
  allmaterial,

};