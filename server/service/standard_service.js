const mysql = require('../database/mapper.js');


// 전체조회
const findAllBom = async (bomnum)=>{
    let list = await mysql.query('bomList', [bomnum]);
    return list;
    }

// 등록
const createNewBom = async (bomInfo)=>{
    let result = await mysql.query('bomInsert', bomInfo);
    if( result.insertId > 0){
      return { bom_num : result.insertId }; 
    }else{
      return {};
    }
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
const insertBom = async (bomnum , insertInfo) => {
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

// BOM 삭제
const deleteBom = async (bomnum) => {
  let list = await mysql.query('bomDelete', bomnum);
  return list;
}

module.exports = {
    findAllBom,
    createNewBom,
    findBomView,
    deleteBom,
    updateBom,
    insertBom,
}