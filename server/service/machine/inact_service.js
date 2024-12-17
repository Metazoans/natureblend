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
  // inActInfo 객체를 배열로 넘기는 방식으로 변경 예정 => mariadb.query('inActInsert', [inActInfo]);
  // mapper 쿼리문 변경 예정
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