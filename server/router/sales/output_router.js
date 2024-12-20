const express = require('express');
const router = express.Router();
const outputService = require('../../service/sales/output_service.js');

// 검색 기준으로 주문리스트 조회
router.put('/output/search', async(req,res)=>{
  let {orderName, clientName, startDate, endDate} = req.body;
  //console.log(req.body);
  let result = await outputService.getOutputOrderList(orderName, clientName, startDate, endDate);
  res.send(result);
});








module.exports = router;