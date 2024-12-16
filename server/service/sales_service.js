const mysql = require('../database/mapper.js');
//주문서 
//거래처 전체 조회 
const getClientList = async ()=>{
    let list = await mysql.query('clientlist');
    return list;
}
// 검색 기준 전체조회
const getOrderList = async (orderStatus, orderName, clientName, startDate, endDate)=>{
    let result = await mysql.query('orderListInfo', orderStatus,orderStatus, orderName,orderName, clientName,clientName, startDate,startDate, endDate,endDate);
    return result;
}


module.exports = {
    getClientList,
    getOrderList,
}