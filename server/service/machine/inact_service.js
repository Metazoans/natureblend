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

// 마지막 비동기 갱신
const updateLastInAct = async (no, updateInfo) => {
  let datas = [updateInfo, no];
  let result = await mariadb.query('lastInAct', datas);
  let sendData = {};
  if(result.affectedRows == 1){
    sendData.result = true;
  }else{
    sendData.result = false;
  }
  return sendData;
}

// 설비 검색 리스트
const searchInActList = async (selectSearchType, searchData, startDate, endDate) => {
  let searchList = [];

  if(selectSearchType != undefined && selectSearchType != null && selectSearchType != '' &&
     searchData != undefined && searchData != null && searchData != '') {

    if(selectSearchType != 'all') {
      let search = `${selectSearchType} LIKE \'%${searchData}%\'`;
      searchList.push(search);
    } else {
      let search = `process_name LIKE \'%${searchData}%\' OR 
                    machine_name LIKE \'%${searchData}%\'`;
      searchList.push(search);
    }
  }
  
  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `inact_start_time >= \'${startDate}\'`;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `inact_end_time <= \'${endDate}\'`;
    searchList.push(search);
  }

  // WHERE 구성
  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "" : `WHERE ${querywhere}`;
  querywhere = querywhere + ' ORDER BY inact_start_time DESC'
  console.log('selected Query', querywhere);
  
  let result = await mariadb.query('searchMachineList', querywhere);
  return result;
}


module.exports = {
  findInActMachines,
  findAllInAct,
  createNewInAct,
  updateLastInAct,
  searchInActList,
  
};