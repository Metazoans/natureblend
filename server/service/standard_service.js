const mysql = require('../database/mapper.js');


// 전체조회
const findAllBom = async ()=>{
    return await mysql.query('bomList');
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
module.exports = {
    findAllBom,
    createNewBom,
    findBomView,
}