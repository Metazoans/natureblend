const express = require('express');
const router = express.Router();
const bomService = require('../service/standard_service.js');

// 전체 조회
router.get('/boms/:bomnum', async (req, res)=>{
    let searchs = req.params.bomnum;
    let bomList = await bomService.findAllBom(searchs);
    res.send(bomList); 
    console.log(bomList);
});


// 등록
router.post('/bommanagement', async(req, res)=>{
  let bomInfo = req.body;
  let result = await bomService.createNewBoard(bomInfo);
  res.send(result);
});

// 수정
router.put('/boms',async(req,res)=>{
    
})

// bom 목록 조회
router.get('/bomview',async (req,res)=>{
    let searchs = req.query;
    let bomName = await bomService.findBomView(searchs);
    res.send(bomName);
});

// 삭제


module.exports = router;