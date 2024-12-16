const express = require('express');
const router = express.Router();
const qc_service = require('../service/qc_service.js');

// 전체조회
router.get('/meterialOrderQC', async (req, res)=>{
  let searchs = req.query;
  let orderList = await qc_service.findMeterialOrder(searchs);
  res.send(orderList);
});


module.exports = router;