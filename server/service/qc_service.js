const mysql = require('../database/mapper.js');

//입고검사신청
// 조회
const findMeterialOrder = async (mName, startDate, endDate)=>{
  let searchList = [];

  if(mName  != undefined && mName != null && mName != ''){
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `h.order_date >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `h.order_date <= \'${endDate} 23:59:59\'`;
    
    searchList.push(search);
  }

  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "ORDER BY h.order_code" : `AND ${querywhere} ORDER BY h.order_code`;
    console.log('selected Query', querywhere);
  
    let result = await mysql.query('searchMaterialOrderWithConditions',querywhere);
    return result;
  
};

const findMeterialAllOrder = async ()=>{
  let sql = 'searchMaterialOrder';
  let list = await mysql.query(sql);
  return list;
}

const requestInspectionForM = async(insertObj)=>{
  let sql = 'inputQCMaterial';
  let arr = insertObj;
  let successNum = 0;

    for(let item of arr){
      let { orderCode, mName, ordQty } = item

      let result = await mysql.query(sql, [ orderCode, mName, ordQty ]);
      if(result[0][0].result == 'Success!'){
        successNum++;
      }
      //console.log(result[0][0].result);

    }
    return { 'successNum': successNum};

}

//입고검사관리
const findAllRequestForQCM = async ()=>{
  let sql = 'selectedQCMAll';
  let list = await mysql.query(sql);
  return list;
}

const findRequestForQCM = async (mName, startDate, endDate)=>{
  let searchList = [];

  if(mName  != undefined && mName != null && mName != ''){
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `q.inspec_start >= \'${startDate} 00:00:00\'`;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `q.inspec_start <= \'${endDate} 23:59:59\'`;
    
    searchList.push(search);
  }

  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "ORDER BY q.qc_material_id" : `AND ${querywhere} ORDER BY q.qc_material_id`;
    console.log('selected Query', querywhere);
  
    let result = await mysql.query('selectQCMWithConditions',querywhere);
    return result;
  
};

//검사완료
// const requestProcessingQCM = async ()=>{
//   let sql = 'updateQCM';

//   await mysql.query(sql, [])
// };


//불량코드(1~5)
const findFaultyCodeOneToFive = async()=>{
  let sql = 'selectFaultyCodeOneToFive';
  let list = await mysql.query(sql);
  return list;
};


module.exports = {
  findMeterialOrder,
  findMeterialAllOrder,
  requestInspectionForM,
  findAllRequestForQCM,
  findRequestForQCM,
  //requestProcessingQCM,
  findFaultyCodeOneToFive,
};