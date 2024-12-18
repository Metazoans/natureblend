const express = require('express');
const router = express.Router();
const orderService = require('../service/sales/order_service.js');

//판매 거래처 전체 조회
router.get('/orderList/clients',async(req,res)=>{
  let clientList = await orderService.getClientList();
  res.send(clientList);
})

// 검색 기준으로 주문리스트 조회
router.put('/orderList/search', async(req,res)=>{
  let {orderStatus, orderName, clientName, startDate, endDate} = req.body;
  let result = await orderService.getOrderList(orderStatus, orderName, clientName, startDate, endDate);
  res.send(result);
});

//영업사원 전체 조회
router.get('/orderlist/emps',async(req,res)=>{
  let empList = await orderService.getEmpList();
  res.send(empList);
})

//제품번호,코드 전체조회
router.get('/orderlist/products',async(req,res)=>{
  let prdList = await orderService.getProductList();
  res.send(prdList); 
})


module.exports = router;