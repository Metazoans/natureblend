const mysql = require('../database/mapper.js');


// 미지시생산계획 material_order_head
const allmaterial = async ()=>{
  let list = await mysql.query('material_order_head');
  return list;
}

// 발주 필요 자재 조회 need_order_material
const needOrderMaterial = async (plan_code)=>{
  let list = await mysql.query('need_order_material', [plan_code]);
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
let list = await mysql.query('full_client_info', [searchKeyword]);
return list;
}


// 발주서 등록 input_order
// CALL material_input_polist(?, ?, ?, ?, ?, ?, ?, @result);
//CALL material_input_polist(22, 33, 'M032', 150, NOW(), 1500, 30000, @result);
const inputOrder = async (materialObj)=>{
  console.log(materialObj);
  let a1 = 100;
  let a2 = 22;
  let a3 = 'M044';
  let a4 = 300;
  let a5 = '2024-12-31 12:12:12';
  let a6 = 1750;
  let a7 = 35000000;
  //let queryString = ` ${a1}, ${a2}, '${a3}', ${a4}, '${a5}', ${a6}, ${a7} `;
  //console.log('hell', queryString);

  //let list = await mysql.query('input_order', queryString);
  let list = await mysql.query('input_order', [a1, a2, a3, a4, a5, a6, a7] );
  return list;
}


module.exports = {
  allmaterial,
  needOrderMaterial,
  fullClient,
  fullClientInfo,
  inputOrder,
};