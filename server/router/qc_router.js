const express = require('express');
const router = express.Router();
const qc_service = require('../service/qc_service.js');

// // 자재품질검사 전체조회(임시)
router.get('/meterialOrderQCAll', async (req, res)=>{
  let orderList = await qc_service.findMeterialOrder();
  res.send(orderList);
});

// 자재품질검사 조건조회
router.post('/meterialOrderQC', async (req, res)=>{
  //let searchs = req.query;
  let {mName, startDate, endDate} = req.body;
  let orderList = await qc_service.findMeterialOrder(mName, startDate, endDate);
  res.send(orderList);
});








module.exports = router;