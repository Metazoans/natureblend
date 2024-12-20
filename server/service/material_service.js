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


// 자재 입고 및 로트 부여 및 발주바디 상태 입고완료로 변경
//inputLotInfoGo  ///material/inputMaterial
//CALL material_lot_input('19Z24004', 'PO241218004', '식용색소', 999000, 'W001', 1000, 'W002', 1, @v_result)
//CALL material_lot_input(?, ?, ?, ?, ?, ?, ?, ?, @v_result)
const inputLotInfoGo = async (materialObj)=>{
  console.log(materialObj);
  let a1 = materialObj.lot_code;
  let a2 = materialObj.order_code;
  let a3 = materialObj.material_name;
  let a4 = materialObj.pass_qnt;
  let a5 = materialObj.warehouse1;
  let a6 = materialObj.rjc_qnt;
  let a7 = materialObj.warehouse2;
  let a8 = materialObj.emp_num;
  let list = await mysql.query('input_lot_material', [a1, a2, a3, a4, a5, a6, a7, a8] );
  console.log(list);
  return list;
}


//자재 발주 리스트 조회 (현재 사용안함 삭제 해도됨)
// material_order_list 쿼리 문 // materialOrderList 함수명
const materialOrderList = async ()=>{
  let list = await mysql.query('material_order_list');
  return list;
}

//자재 발주 리스트 조회 ( 조건문 넣어서 )
const materialOrderList2 = async (materialCode, clientName, POListCode, startDate, endDate)=>{
  console.log(materialCode);
  console.log(clientName);
  console.log(POListCode);
  console.log(startDate);
  console.log(endDate);
  let searchList = [];
  if(materialCode  != undefined && materialCode != null && materialCode != ''){
    let search = `mat.material_name LIKE \'%${materialCode}%\' `;
    searchList.push(search);
  }

  if(clientName  != undefined && clientName != null && clientName != ''){
    let search = `cli.com_name LIKE \'%${clientName}%\' `;
    searchList.push(search);
  }

  if(POListCode  != undefined && POListCode != null && POListCode != ''){
    let search = `mob.order_code LIKE \'%${POListCode}%\' `;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `moh.order_date >= \'${startDate}\' `;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `moh.order_date <= \'${endDate}\' `;
    searchList.push(search);
  }

  // 조건을 기반으로 WHERE절 최종 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:` AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  querywhere += ` ORDER BY mob.body_num DESC `;
  console.log('selected Query', querywhere);

  let result = await mysql.query('material_order_list',querywhere);
  return result;
}

// 발주 전체취소 또는 개별취소
const poListDelete = async (deleteNum, body_num, order_code)=>{
  let querywhere = '';
  if(deleteNum == 2){
    querywhere += ` WHERE body_num = \'${body_num}\' `;
  }else{
    querywhere += ` WHERE order_code = \'${order_code}\' `;
  }
  //console.log(querywhere);
  let result = await mysql.query('material_cance',querywhere);
  return result;
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
  inputLotInfoGo,
  materialOrderList,
  materialOrderList2,
  poListDelete,

};