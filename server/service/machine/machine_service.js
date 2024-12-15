const mariadb = require('../../database/mapper.js');

// 전체조회
const findAllMachines = async ()=>{
  let list = await mariadb.query('machineList');
  return list;
}

module.exports = {
  findAllMachines,

};