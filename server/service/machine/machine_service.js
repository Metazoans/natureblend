const mariadb = require('../../database/mapper.js');

// 전체조회
const findAllMachines = async () => {
  let list = await mariadb.query('machineList');
  return list;
}

// 설비 상세 정보
const findMachineInfo = async (no) => {
  let list = await mariadb.query('machineInfo', [no]);
  let info = list[0];
  return info;
}
// 설비 생산 정보 
const findMachinePrdInfo = async (no) => {
  let list = await mariadb.query('machinePrdInfo', [no]);
  let info = list[0];
  return info;
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
  findMachineInfo,
  findMachinePrdInfo,
  
};