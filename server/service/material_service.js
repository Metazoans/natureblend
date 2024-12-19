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
const inputOrder = async (materialObj)=>{
  console.log(materialObj);
  let a1 = materialObj.clientNum;
  let a2 = materialObj.empNum;
  let a3 = materialObj.materialCode;
  let a4 = materialObj.ordQty;
  let a5 = materialObj.limitDate;
  let a6 = materialObj.unitPrice;
  let a7 = materialObj.totalPrice;
  let list = await mysql.query('input_order', [a1, a2, a3, a4, a5, a6, a7] );
  return list;
}


// 자재 입고 처리 페이지 리스트
// material_input_qc_list
const materialInputQcList = async ()=>{
  let list = await mysql.query('material_input_qc_list');
  return list;
}

// 가능 창고리스트 조회
//allwarehouseList  // warehouse_list
const allwarehouseList = async ()=>{
  let list = await mysql.query('warehouse_list');
  return list;
}

//로트번호 생성하기
const lotNumInfo = async ()=>{
  let list = await mysql.query('material_lot_num');
  return list;
}


module.exports = {
  allmaterial,
  needOrderMaterial,
  fullClient,
  fullClientInfo,
  inputOrder,
  materialInputQcList,
  allwarehouseList,
  lotNumInfo,

};