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

// 자재 조회
router.get('/materialList',async(req,res)=>{
  let searchs = req.query;
  let materialList = await bomService.materialList(searchs);
  res.send(materialList);
});

// 자재 등록
router.post('/materialInsert',async(req,res)=>{
  let { material_code,material_name,safety_inventory,expiration_date } = req.body;
  let result = await bomService.insertMaterial(material_code,material_name,safety_inventory,expiration_date);
  res.send(result);
});
// 자재 수정
router.post('/materialUpdate/:material_code',async(req,res)=>{
  let material_code = req.params.material_code;
  let { material_name,safety_inventory,expiration_date } = req.body;
  let result = await bomService.updateMaterial(material_code,material_name,safety_inventory,expiration_date);
  res.send(result);
});
// 자재 삭제
router.delete('/materialDel/:material_code',async(req,res)=>{
  let material_code = req.params.material_code;
  let result = await bomService.delMaterial(material_code);
  res.send(result);
});

// 공정정보 조회
router.get('/processList',async(req,res)=>{
  let searchs = req.query;
  let processSelect = await bomService.processList(searchs);
  res.send(processSelect);
});

// 공정정보 삭제
router.delete('/processDelete/:process_code',async(req,res)=>{
  let process_code = req.params.process_code;
  let result = await bomService.deleteProcess(process_code);
  res.send(result);
});

// 공정정보 등록
router.post('/processInsert',async(req,res)=>{
  let { process_code,process_name,machine_type } = req.body;
  let result = await bomService.insertProcess(process_code,process_name,machine_type);
  res.send(result);
});

// 공정정보 수정
router.post('/processUpdate/:process_code',async(req,res)=>{
  let process_code = req.params.process_code;
  let { process_name,machine_type } = req.body;
  let result = await bomService.updateProcess(process_code,process_name,machine_type);
  res.send(result);
});

// 사원 조회
router.get('/employeeList',async(req,res)=>{
  let searchs = req.query;
  let empList = await bomService.employeeList(searchs);
  res.send(empList);
});

// 사원 삭제
router.delete('/employeeDelete/:emp_num',async(req,res)=>{
  let emp_num = req.params.emp_num;
  let result = await bomService.deleteEmployee(emp_num);
  res.send(result);
})

// 사원 등록 , 수정
router.post('/employeeInsert',async(req,res)=>{
  let { emp_num,name,birth,tel,job,job_num,position,employment_date,resignation_date,level } = req.body;
  let result = await bomService.insertEmployee(emp_num,name,birth,tel,job,job_num,position,employment_date,resignation_date,level);
  res.send(result);
});
module.exports = router;