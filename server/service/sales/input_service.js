const mysql = require('../../database/mapper.js');

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




















module.exports = {
    getWarehouse,
    getQtList,
    addInput,

}