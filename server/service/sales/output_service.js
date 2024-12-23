const mysql = require('../../database/mapper.js');
//출고 주문서 검색 기준 조회 
const getOutputOrderList = async (orderName,clientName, startDate, endDate)=>{
    console.log(orderName,clientName, startDate, endDate);
    let searchList = [];
    if(orderName  != undefined && orderName != null && orderName != ''){
        let search = `o.orderlist_title LIKE \'%${orderName}%\'`;
        searchList.push(search);
      }
      console.log("회사명:",clientName)
      if(clientName  != undefined && clientName != null && clientName != ''){
        let search = `c.com_name LIKE \'%${clientName.com_name}%\'`;
        searchList.push(search);
      }
    
      if(startDate  != undefined && startDate != null && startDate != ''){
        let search = `o.order_date >= \'${startDate}\'`;
        searchList.push(search);
      }
    
      if(endDate  != undefined && endDate != null && endDate != ''){
        let search = `o.order_date <= \'${endDate}\'`;
        searchList.push(search);
      }
      // 조건을 기반으로 WHERE절 최종 구성
      let querywhere = '';
      for(let i = 0 ; i < searchList.length; i++){
        let search  = searchList[i];
        querywhere+= `AND ` + search;  
      };
      querywhere = searchList.length == 0 ? "" : `${querywhere}`;
    console.log('selected Query', querywhere);
      
        let result = await mysql.query('outputOrderlist',querywhere);
        return result;
}

//미출고 주문 보기 (다수의 주문)
const getDisoutputOrder = async(no)=>{
  let list = await mysql.query('disoutputOrder',[no]);
  return list;
}

//제품 별 다수의 lot 건 조회
const getLotBaseProduct = async(no)=>{
  let list = await mysql.query('getLotBaseProduct',[no]);
  return list;
}

//출고등록 
const addOutput = async(outputInfo)=>{
  let datas= [ ...Object.values(outputInfo)];
  console.log(datas);
  let result = await mysql.query('outputOrders', datas);
  console.log("결과:",result);
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
    getOutputOrderList,
    getDisoutputOrder,
    getLotBaseProduct,
    addOutput,
}