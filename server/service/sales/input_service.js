const mysql = require('../../database/mapper.js');
const { deleteInput } = require('../../database/sqls/sales/inputlist.js');

const getWarehouse = async ()=>{
    let list = await mysql.query('getUseWarehouse');
    return list;
}

// 품질검사필터 조회 
const getQtList = async(productCode, startDate,endDate)=>{
    let qtList = [];
    if(productCode  != undefined && productCode != null && productCode != ''){
        let search = `w.product_code LIKE \'${productCode}\'`;
        qtList.push(search);
    }

    if(startDate  != undefined && startDate != null && startDate != ''){
        let search = `q.inspec_end >= \'${startDate}\'`;
        qtList.push(search);
      }
    
    if(endDate  != undefined && endDate != null && endDate != ''){
        let search = `q.inspec_end <= \'${endDate}\'`;
        qtList.push(search);
      }

      // 조건을 기반으로 WHERE절 최종 구성
        let querywhere = '';
        for(let i = 0 ; i < qtList.length; i++){
          let search  = qtList[i];
          querywhere+= `AND ` + search;  
        };
      
        querywhere = qtList.length == 0 ? "" : ` ${querywhere}`;
        console.log('selected Query', querywhere);
      
        let result = await mysql.query('getQtResult',querywhere);
        return result;
    
}
//제품입고등록 
const addInput = async(inputInfo)=>{
  let datas = [ ...Object.values(inputInfo)];
  console.log("service의 데이터:",datas);
  let result = await mysql.query('insertProduct',datas);
  console.log("서비스 결과:",result);
  if (Array.isArray(result) && result[0] && result[0][0]) {
    return { message: result[0][0].result };
  } 
  // 배열이 아닐 경우 처리
  else if (result && result.result) {
    return { message: result.result };
  } else {
    // 결과가 없을 경우
    return {};
  }

}

//입고리스트조회(필터)
// 품질검사필터 조회 
const inputLists = async(productCode, startDate,endDate)=>{
  let inputList = [];
  if(productCode  != undefined && productCode != null && productCode != ''){
      let search = `ib.product_code LIKE \'${productCode}\'`;
      inputList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
      let search = `ih.input_date >= \'${startDate}\'`;
      inputList.push(search);
    }
  
  if(endDate  != undefined && endDate != null && endDate != ''){
      let search = `ih.input_date <= \'${endDate}\'`;
      inputList.push(search);
    }

    // 조건을 기반으로 WHERE절 최종 구성
      let querywhere = '';
      for(let i = 0 ; i < inputList.length; i++){
        let search  = inputList[i];
        querywhere+=(i == 0 ? ` `:`AND `) + search;  
      };
    
      querywhere = inputList.length == 0 ? "" : `WHERE ${querywhere}`;
      querywhere += `ORDER BY ih.input_date`
      console.log('selected Query', querywhere);
    
      let result = await mysql.query('inputRecord',querywhere);
      return result;
  
}

//입고수정을 원하는 값들이 출고가 된 적 있는지 체크 (사용안함)
// const checkLotOutput = async(deleteInfo)=>{
//   let result = await mysql.query('checkLotOutput',Object.values(deleteInfo));
//   return result;
// }

// 입고건 수정 
const updateInputInfo = async(updateInputInfo)=>{
  let datas = Object.values(updateInputInfo);
  console.log("서비스에서의 수정데이터:",datas);

  let result = await mysql.query('inputUpdate',datas);
  let sendData = {};

  if(result.changeRows !== 0){
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

//입고 건 삭제
const deleteInputInfo = async(deleteInfo)=>{
  let datas = Object.values(deleteInfo);
  console.log(datas);
  let result = await mysql.query('deleteInput',datas);
  let sendData = {};
  if(result.changeRows !== 0){
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}




















module.exports = {
    getWarehouse,
    getQtList,
    addInput,
    inputLists,
    updateInputInfo,
    deleteInputInfo,

}