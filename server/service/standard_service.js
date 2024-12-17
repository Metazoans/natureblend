const mysql = require('../database/mapper.js');


// 전체조회
const findAllBom = async (bomnum)=>{
    let list = await mysql.query('bomList', bomnum);
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

// BOM 수정


module.exports = {
    findAllBom,
    createNewBom,
    findBomView,
    deleteBom,
}