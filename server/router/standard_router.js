const express = require('express');
const router = express.Router();
const bomService = require('../service/standard_service.js');

// bom 조회
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

// bom등록
router.post('/bomregist', async(req, res)=>{
  let bomInfo = req.body;
  let result = await bomService.createNewBom(bomInfo);
  res.send(result);
});

// bom 수정
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

// bom 자재 삭제
router.get('/materialdelete/:bomseq',async(req,res)=>{
  let bomseq = req.params.bomseq;
  console.log(bomseq);
  console.log(bomseq);
  console.log(bomseq);
  let result = await bomService.deleteMaterial(bomseq);
  res.send(result);
});

// bom 삭제
router.delete('/bomdelete/:bomnum',async(req,res)=>{
  let bomnum = req.params.bomnum;
  let result = await bomService.deleteBom(bomnum);
  res.send(result);
});

// 자재 목록 조회 code , name
router.get('/materialselect',async(req,res)=>{
  let searchs = req.query;
  let materialSelect = await bomService.selectMaterial(searchs);
  res.send(materialSelect);
});

// 제품 등록
router.post('/productInsert',async(req,res)=>{
  let { product_code,product_name,expiration_date,capacity } = req.body;
  let result = await bomService.insertProduct(product_code,product_name,expiration_date,capacity);
  res.send(result);
});

// 제품 삭제
router.delete('/productDelete/:product_code',async(req,res)=>{
  let product_code = req.params.product_code;
  let result = await bomService.deleteProduct(product_code);
  res.send(result);
});

// 제품 수정
router.post('/productUpdate/:product_code',async(req,res)=>{
  let product_code = req.params.product_code;
  let { product_name,expiration_date,capacity } = req.body;
  let result = await bomService.updateProduct(product_code,product_name,expiration_date,capacity);
  res.send(result);
});

module.exports = router;