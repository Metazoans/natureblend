const express = require('express');
const router = express.Router();
const bomService = require('../service/standard_service.js');

// 전체 조회
router.get('/boms', async (req, res)=>{
    let bomList = await bomService.findAllBom();
    res.send(bomList); 
});


// 등록
router.post('/bommanagement', async(req, res)=>{
  let bomInfo = req.body;
  let result = await bomService.createNewBoard(bomInfo);
  res.send(result);
});

// bom 목록 조회
router.get('/bomview',async (req,res)=>{
    let searchs = req.query;
    let bomList = await bomService.findBomView(searchs);
    res.send(bomList);
});


module.exports = router;