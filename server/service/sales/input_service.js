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




















module.exports = {
    getWarehouse,
    getQtList,

}