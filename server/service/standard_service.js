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
  let result = await mysql.query('productInsert', [product_code,product_name,capacity,expiration_date]);
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

// 제품 수정
const updateProduct = async (product_code,product_name,expiration_date,capacity) => {
  let result = await mysql.query('productUpdate', [product_name,expiration_date,capacity,product_code]);
  console.log(result);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}

// 자재 조회
const materialList = async ()=>{
  let list = await mysql.query('materialList');
  return list;
}

// 자재 등록
const insertMaterial = async (material_code,material_name,safety_inventory,expiration_date) => {
  let result = await mysql.query('materialInsert', [material_code,material_name,safety_inventory,expiration_date]);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}
// 자재 수정
const updateMaterial = async (material_code,material_name,safety_inventory,expiration_date) => {
  let result = await mysql.query('materialUpdate', [material_name,safety_inventory,expiration_date,material_code]);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}
// 자재 삭제
const delMaterial = async (material_code) => {
  let result = await mysql.query('materialDel', [material_code]);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}

// 공정정보 조회
const processList = async () => {
  let list = await mysql.query('processList');
  return list;
}

// 공정정보 삭제
const deleteProcess = async (process_code) => {
  let result = await mysql.query('processDelete', [process_code]);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}
// 공정정보 등록
const insertProcess = async (process_code,process_name,machine_type) => {
  let result = await mysql.query('processInsert', [process_code,process_name,machine_type]);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}
// 공정정보 수정
const updateProcess = async (process_code,process_name,machine_type) => {
  let result = await mysql.query('processUpdate', [process_name,machine_type,process_code]);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}

// 사원 조회
const employeeList = async () => {
  let list = await mysql.query('employeeList');
  return list; 
}

// 사원 삭제
const deleteEmployee = async (employee_code) => {
  let result = await mysql.query('employeeDelete', [employee_code]);
  if(result.affectedRows > 0 ){
    return '성공';
  }else{
    return '실패';
  }
}

// 사원 등록 , 수정
const insertEmployee = async (employee_code,employee_name,employee_birth,employee_tel,employee_job,employee_job_num,employee_position,employee_employment_date,employee_resignation_date,employee_level) => {
  let result = await mysql.query('employeeInsert', [employee_code,employee_name,employee_birth,employee_tel,employee_job,employee_job_num,employee_position,employee_employment_date,employee_resignation_date,employee_level]);
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
    updateProduct,
    materialList,
    insertMaterial,
    updateMaterial,
    delMaterial,
    processList,
    deleteProcess,
    insertProcess,
    updateProcess,
    employeeList,
    deleteEmployee,
    insertEmployee,
}