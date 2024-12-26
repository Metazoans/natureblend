const mysql = require('../database/mapper.js');

//입고검사신청
// 조회
const findMeterialOrder = async (mName, startDate, endDate) => {
  let searchList = [];

  if (mName != undefined && mName != null && mName != '') {
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `h.order_date >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `h.order_date <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY h.order_code DESC" : `AND ${querywhere} ORDER BY h.order_code DESC`;
  console.log('selected Query', querywhere);

  let result = await mysql.query('searchMaterialOrderWithConditions', querywhere);
  return result;

};

const findMeterialAllOrder = async () => {
  let sql = 'searchMaterialOrder';
  let list = await mysql.query(sql);
  return list;
}

const requestInspectionForM = async (insertObj) => {
  let sql = 'inputQCMaterial';
  let arr = insertObj;
  let successNum = 0;

  for (let item of arr) {
    let { orderCode, mName, ordQty } = item

    let result = await mysql.query(sql, [orderCode, mName, ordQty]);
    if (result[0][0].result == 'Success!') {
      successNum++;
    }
    //console.log(result[0][0].result);

  }
  return { 'successNum': successNum };

}

//입고검사관리-조회
const findAllRequestForQCM = async () => {
  let sql = 'selectedQCMAll';
  let list = await mysql.query(sql);
  return list;
}
//입고검사관리-선택조회(검색)
const findRequestForQCM = async (mName, startDate, endDate) => {
  let searchList = [];

  if (mName != undefined && mName != null && mName != '') {
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `q.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `q.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY q.qc_material_id DESC" : `AND ${querywhere} ORDER BY q.qc_material_id DESC`;
  console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCMWithConditions', querywhere);
  return result;

};

//입고검사관리-검사완료
const completeQCM = async (qcm, qcmr) => {
  let sql1 = 'updateQCM';
  let sql2 = 'insertQCMR';
  let updatedRows = 0;  // 수정된 수(검사완료처리)
  let successNum = 0;   // 등록된 수 (불량품처리)

  //입고검사-완료 처리
  for (let item of qcm) {
    let { passQnt, rjcQnt, qcMaterialId } = item;

    let result = await mysql.query(sql1, [passQnt, rjcQnt, qcMaterialId]);
    console.log(result.data);
    if (result.affectedRows > 0) {
      updatedRows += result.affectedRows; // 누적
    }
  }
  //입고검사-불량품
  for (let item of qcmr) {
    let { qcMaterialId, faultyCode, qty } = item;

    let result = await mysql.query(sql2, [qcMaterialId, faultyCode, qty]);
    if (result[0][0].result == 'Success!') {
      successNum++;
    }
  }
  return { 'updatedRows': updatedRows, 'defectNum': successNum };


};


//불량코드(1~5)
const findFaultyCodeOneToFive = async () => {
  let sql = 'selectFaultyCodeOneToFive';
  let list = await mysql.query(sql);
  return list;
};

//입고검사기록조회(검사완료 전체조회)
const findQCMComplete = async() => {
  let sql = 'selectQCMAll';
  let list = await mysql.query(sql);
  return list;
}




//입고검사-불량내역조회
const findQCMRAll = async() =>{
  let sql = 'selectQCMR';
  let list = await mysql.query(sql);
  return list;
}
const findQCMR = async(mName, startDate, endDate) =>{
  // let sql = 'selectQCMR';
  // let list = await mysql.query(sql);
  // return list;

  let searchList = [];

  if (mName != undefined && mName != null && mName != '') {
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if (startDate != undefined && startDate != null && startDate != '') {
    let search = `q.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if (endDate != undefined && endDate != null && endDate != '') {
    let search = `q.inspec_start <= \'${endDate} 23:59:59\'`;

    searchList.push(search);
  }

  let querywhere = '';
  for (let i = 0; i < searchList.length; i++) {
    let search = searchList[i];
    querywhere += (i == 0 ? ` ` : `AND `) + search;
  };

  querywhere = searchList.length == 0 ? "ORDER BY r.qc_material_rjc_id DESC " : `WHERE ${querywhere} ORDER BY r.qc_material_rjc_id DESC `;
  console.log('selected Query', querywhere);

  let result = await mysql.query('selectQCMRWithConditions', querywhere);
  return result;
}


module.exports = {
  findMeterialOrder,
  findMeterialAllOrder,
  requestInspectionForM,
  findAllRequestForQCM,
  findRequestForQCM,
  completeQCM,
  findFaultyCodeOneToFive,
  findQCMComplete,
  findQCMRAll,
  findQCMR
};