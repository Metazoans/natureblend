const mysql = require('../../database/mapper.js');
//주문서 
//판매 거래처 전체 조회 
const getClientList = async ()=>{
    let list = await mysql.query('clientlist');
    return list;
}
// 검색 기준 전체조회
const getOrderList = async (orderStatus, orderName, clientName, startDate, endDate)=>{
/*
    let querywhere = "";
    if(orderStatus == undefined){
        querywhere += `o.orderlist_status LIKE ${orderStatus}`;
    }
    
                    
    querywhere += `AND (o.orderlist_title LIKE ${orderName}`;
                    AND (c.com_name LIKE ${clientName} OR  ${clientName} IS NULL)
                    AND (o.order_date >= ${startDate} OR ${startDate} IS NULL)
                    AND (o.order_date <= ${endDate} OR ${endDate} IS NULL) `
    let result = await mysql.query('orderListInfo',querywhere);
    return result;
    console.log(querywhere);
    */
   let searchList = [];
   if(orderStatus != undefined && Object.keys(orderStatus).length > 0){
    let search = `o.orderlist_status IN (`;  
    for (let key in orderStatus) {        
        search += (key == '0' ? ' ' : ', ') + `\'${orderStatus[key]}\'`;   
    }
    search += ' )';
    searchList.push(search);
   }

  if(orderName  != undefined && orderName != null && orderName != ''){
    let search = `o.orderlist_title LIKE \'${orderName}\'`;
    searchList.push(search);
  }

  if(clientName  != undefined && clientName != null && clientName != ''){
    let search = `c.com_name LIKE \'${clientName}\'`;
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
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  console.log('selected Query', querywhere);

  let result = await mysql.query('orderListInfo',querywhere);
  return result;
}


//영업사원 전체 조회
const getEmpList = async ()=> {
  let list = await mysql.query('orderEmployees');
  return list;
}

//전체 제품코드, 이름 조회
const getProductList = async()=>{
  let list = await mysql.query('orderProduct');
  return list;
}

module.exports = {
    getClientList,
    getOrderList,
    getEmpList,
    getProductList,
}