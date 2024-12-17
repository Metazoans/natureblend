const mariadb = require('../../database/mapper.js');

// 전체조회
const findAllMachines = async () => {
  let list = await mariadb.query('machineList');
  return list;
}

// 설비 등록
const createNewMachine = async (machineInfo) => {
  let result = await mariadb.query('machineInsert', machineInfo);
  if( result.insertId > 0){
    return { machine_num : result.insertId }; 
  }else{
    return {};
  }
}

// 설비 분류 검색
const findMachineType = async () => {
  let list = await mariadb.query('typeList');
  return list;
}

module.exports = {
  findAllMachines,
  createNewMachine,
  findMachineType,
  
};