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








module.exports = {
    getOutputOrderList,
}