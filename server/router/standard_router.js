const express = require('express');
const router = express.Router();
const bomService = require('../service/standard_service.js');

// 조회
router.get('/boms/:bomnum', async (req, res)=>{
    let searchs = req.params.bomnum;
    let bomList = await bomService.findAllBom(searchs);
    res.send(bomList); 
    console.log(bomList);
});
// product 테이블 조회
router.get('/bomproduct',async(req,res)=>{
  let searchs = req.query;
  let productSelect = await bomService.findProduct(searchs);
  res.send(productSelect);
  console.log(productSelect);
})

//등록
router.post('/bomregist', async(req, res)=>{
  let bomInfo = req.body;
  let result = await bomService.createNewBom(bomInfo);
  res.send(result);
});

// 수정
router.post('/bomupdate/:bomnum', async(req,res)=>{
  let num = req.params.bomnum;
  let info = req.body;
  // console.log(num);
  // console.log('aaa', info);
  let result = await bomService.updateBom(num,info);
  res.send(result);
});

// 자재 추가 등록
router.post('/bominsert/:bomnum', async(req,res)=>{
  let bomnum = req.params.bomnum;
  let insertInfo = req.body;
  let result = await bomService.insertBomList(bomnum, insertInfo);
  res.send(result);
});


// bom 목록 조회
router.get('/bomview',async (req,res)=>{
    let searchs = req.query;
    let bomName = await bomService.findBomView(searchs);
    res.send(bomName);
});

// // bom 자재 삭제
// router.delete('/materialdelete/:bomnum',async(req,res)=>{
//   let bomnum = req.params.bomnum;
//   let result = await bomService.deleteMaterial(bomnum);
//   res.send(result);
// });

// bom삭제
router.delete('/bomdelete/:bomnum',async(req,res)=>{
  let bomnum = req.params.bomnum;
  let result = await bomService.deleteBom(bomnum);
  res.send(result);
});



module.exports = router;