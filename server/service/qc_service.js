const mysql = require('../database/mapper.js');

// 조회
const findMeterialOrder = async (mName, startDate, endDate)=>{
  let searchList = [];

  if(mName  != undefined && mName != null && mName != ''){
    let search = `m.material_name LIKE \'%${mName}%\'`;
    searchList.push(search);
  }

  if(startDate  != undefined && startDate != null && startDate != ''){
    let search = `h.order_date >= \'${startDate}\'`;
    searchList.push(search);
  }

  if(endDate  != undefined && endDate != null && endDate != ''){
    let search = `h.order_date <= \'${endDate}\'`;
    searchList.push(search);
  }

  let querywhere = '';
  for(let i = 0 ; i < searchList.length; i++){
    let search  = searchList[i];
    querywhere+= (i == 0 ? ` `:`AND `) + search;  
  };

  querywhere = searchList.length == 0 ? "ORDER BY h.order_code" : `AND ${querywhere} ORDER BY h.order_code`;
    console.log('selected Query', querywhere);
  
    let result = await mysql.query('searchMaterialOrderWithConditions',querywhere);
    return result;
  
};

const findMeterialAllOrder = async ()=>{
  let sql = 'searchMaterialOrder';
  let list = await mysql.query(sql);
  return list;
}

module.exports = {
  findMeterialOrder,
  findMeterialAllOrder
};