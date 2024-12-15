const mariadb = require('../../database/mapper.js');

// 비동기 설비 조회
const findInActMachines = async ()=>{
  let list = await mariadb.query('inActMachines');
  return list;
}

// 비동기 내역 조회
const findAllInAct = async ()=>{
  let list = await mariadb.query('inActList');
  return list;
}

// 등록
const createNewInAct = async (inActInfo)=>{
  let result = await mariadb.query('inActInsert', inActInfo);
  if( result.insertId > 0){
    return { inact_num : result.insertId }; 
  }else{
    return {};
  }
}

module.exports = {
  findInActMachines,
  findAllInAct,
  createNewInAct,
};