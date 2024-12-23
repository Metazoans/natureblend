const mysql = require('../database/mapper.js');


// 전체조회
const findAllBom = async (bomnum)=>{
    let list = await mysql.query('bomList', [bomnum]);
    return list;
}
// product 테이블 조회
const findProduct = async ()=>{
    let list = await mysql.query('productSelect');
    return list;
}

// 등록
const createNewBom = async (bomInfo)=>{
  console.log('받아오는 데이터 확인',bomInfo);
    let result = await mysql.query('bomInsert', bomInfo);
    return result;
}

// BOM 수정
const updateBom = async (num , updateInfo) => {
  console.log(num);
  console.log(updateInfo);
  let datas = [updateInfo, num];
  let result = await mysql.query('bomUpdate',datas);
  return result;
}

// BOM 자재 추가 
const insertBomList = async (bomnum , insertInfo) => {
  console.log(insertInfo);
  let datas = [insertInfo,bomnum];
  let result = await mysql.query('bomAddInsert',datas);
  return result;
}
// BOM 목록 조회
const findBomView = async (no) => {
    let list = await mysql.query('bomView', no);
    return list;
}

// BOM 자재 삭제
const deleteMaterial = async (bomseq) => {
  let list = await mysql.query('materialDelete2', [bomseq]);
  return list;
}

// BOM 삭제
const deleteBom = async (bomnum) => {
  let list2 = await mysql.query('materialDelete', [bomnum]);
  let list = await mysql.query('bomDelete', [bomnum]);

  return list,list2;
}

// 자재 목록 조회 code , name
const selectMaterial = async () => {
  let list = await mysql.query('materialSelect');
  return list;
}

// 제품 등록
const insertProduct = async (product_code,product_name,expiration_date,capacity) => {
  console.log(product_code,product_name,expiration_date,capacity);
  let result = await mysql.query('productInsert', [product_code,product_name,expiration_date,capacity]);
  console.log(result);
  if(result.affectedRows > 0 ){
    return '성공';
  }else {
    return '실패';
  }
}

// 제품 삭제
const deleteProduct = async (product_code) => {
  let result = await mysql.query('productDelete', [product_code]);
  console.log(result);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}

module.exports = {
    findAllBom,
    createNewBom,
    findBomView,
    deleteBom,
    updateBom,
    insertBomList,
    findProduct,
    deleteMaterial,
    selectMaterial,
    insertProduct,
    deleteProduct,
}