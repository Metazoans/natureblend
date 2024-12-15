const express = require('express');
const router = express.Router();
const salesService = require('../service/sales_service.js');

//거래처 전체 조회
router.get('/clients',async(req,res)=>{
  let clientList = await salesService.getClientList();
  res.send(clientList);
})

// 검색 기준으로 주문리스트 조회
router.get('/orderList/search', async(req,res)=>{
  let {orderStatus, orderName, clientName, startDate, endDate} = req.query;
  
  let orderList = await salesService.getOrderList(orderStatus, orderName, clientName, startDate, endDate);
  res.send(orderList);
});


module.exports = router;