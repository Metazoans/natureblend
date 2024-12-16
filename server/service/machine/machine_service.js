const mariadb = require('../../database/mapper.js');

// 전체조회
const findAllMachines = async ()=>{
  let list = await mariadb.query('machineList');
  return list;
}

// 설비 등록
const createNewMachine = async (machineInfo)=>{
  let result = await mariadb.query('machineInsert', machineInfo);
  if( result.insertId > 0){
    return { inact_num : result.insertId }; 
  }else{
    return {};
  }
}

module.exports = {
  findAllMachines,
  createNewMachine,
  
};