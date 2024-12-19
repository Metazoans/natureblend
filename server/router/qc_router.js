const express = require('express');
const router = express.Router();
const qc_service = require('../service/qc_service.js');

// // 자재품질검사 전체조회
router.get('/meterialOrderQCAll', async (req, res)=>{
  let orderList = await qc_service.findMeterialOrder();
  res.send(orderList);
});

// 자재품질검사 조건조회
router.post('/meterialOrderQC', async (req, res)=>{
  let {mName, startDate, endDate} = req.body;
  let orderList = await qc_service.findMeterialOrder(mName, startDate, endDate);
  res.send(orderList);
});

// 자재품질검사 신청(입력)
router.post('/insertQCM', async (req, res)=>{
  console.log(req.body);
  let insertObj = []
  for(let i=0;i<req.body.length;i++){
    let { orderCode, mName, ordQty, orderDate} = req.body[i];
    insertObj[i] = { orderCode, mName, ordQty, orderDate };
  }
  res.send(insertObj);

  // let result = await qc_service.requestInspectionForM(insertObj);
  // //console.log(result);
  // res.send(result);


});







module.exports = router;