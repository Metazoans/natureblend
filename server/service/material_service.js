const mysql = require('../database/mapper.js');


// 미지시생산계획 material_order_head
const allmaterial = async ()=>{
  let list = await mysql.query('material_order_head');
  return list;
}

// 발주 필요 자재 조회 need_order_material
const needOrderMaterial = async (plan_code)=>{
  let list = await mysql.query('need_order_material', plan_code);
  //let info = list[0];
  return list;
}

//거래처 전체
const fullClient = async ()=>{
  let list = await mysql.query('full_client');
  return list;
}

//거래처 전체 조회 full_client
const fullClientInfo = async (clientKeyWord)=>{
  searchKeyword = '%'+clientKeyWord+'%';
let list = await mysql.query('full_client_info', searchKeyword);
return list;
}


module.exports = {
  allmaterial,
  needOrderMaterial,
  fullClient,
  fullClientInfo,
};