const mariadb = require('../../database/mapper.js');

// 사용 가능한 부품 조회
const findAllParts = async ()=>{
  let list = await mariadb.query('partList');
  return list;
}

// 등록
const createNewPart = async (partInfo)=>{
  let result = await mariadb.query('partInsert', partInfo);
  if( result.insertId > 0){
    return { part_num : result.insertId }; 
  }else{
    return {};
  }
}

// 삭제
const delPartInfo = async (pno) => {
  let result = await mariadb.query('partDelete', [pno]);
  if(result.affectedRows == 1) {
    return { "result" : "success" };
  } else {
    return { "result" : "fail" };
  }
}

// // 마지막 비동기 갱신
// const updateLastInAct = async (no, updateInfo) => {
//   let datas = [updateInfo, no];
//   let result = await mariadb.query('lastInAct', datas);
//   let sendData = {};
//   if(result.affectedRows == 1){
//     sendData.result = true;
//   }else{
//     sendData.result = false;
//   }
//   return sendData;
// }


module.exports = {
  findAllParts,
  createNewPart,
  delPartInfo,

};