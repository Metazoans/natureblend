const express = require('express');
const router = express.Router();
const qc_service = require('../service/qc_service.js');

// 자재품질검사 전체조회
router.get('/meterialOrderQC', async (req, res)=>{
  let searchs = req.query;
  let orderList = await qc_service.findMeterialOrder(searchs);
  res.send(orderList);
});

// router.post('/meterialOrderQC', async (req, res)=>{
//   try {
//     console.log(req.body);
//     const { mName = "", startDate = "", endDate = "" } = req.body;
//     // 서비스 호출, 검색 조건 전달
//     const orderList = await qc_service.findMeterialOrder({ mName, startDate, endDate });
//     console.log(orderList);
//     res.status(200).send(orderList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("검색 중 오류 발생");
//   }
// });


// 자재품질검사 이름조회(임시)
router.get('/meterialOrderQC/:name', async (req, res)=>{
  let searchs = req.params.name;
  let orderList = await qc_service.findMeterialOrder(searchs);
  console.log(orderList);
  res.send(orderList);
});




module.exports = router;