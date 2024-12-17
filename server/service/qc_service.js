const mysql = require('../database/mapper.js');

// 전체조회
const findMeterialOrder = async (keywords)=>{
  console.log(keywords);
  //let sql, list;

  // if((keywords.mName).length == 0){
  //   sql = 'searchMaterialOrder';
  //   list = await mysql.query(sql, keywords.startDate, keywords.endDate);
  // }else{
  //   sql = 'searchMaterialOrderWithConditions';
  //   list = await mysql.query(sql, keywords.mName, keywords.startDate, keywords.endDate);
  // }

  let sql = Object.keys(keywords.mName).length == 0 ? 'searchMaterialOrder' : 'searchMaterialOrderWithName';
  let list = await mysql.query(sql, keywords);
  return list;
}

// const findMeterialOrder = async (keywords)=>{
//   let sql = Object.keys(keywords).length == 0 ? 'searchMaterialOrder' : 'searchMaterialOrderWithName';
//   let list = await mysql.query(sql, keywords);
//   return list;
// }

// const findMeterialOrder = async (keywords) => {
//   const { mName, startDate, endDate } = keywords;

//   // 조건에 따라 SQL 쿼리 선택
//   let sql = "searchMaterialOrder"; // 기본 쿼리 (조건 없음)
//   const params = [];
  

//   if (mName || (startDate && endDate)) {
//     sql = "searchMaterialOrderWithConditions"; // 조건 있는 쿼리
//     if (mName) params.push(`%${mName}%`);
//     if (startDate && endDate) {
//       params.push(startDate, endDate);
//     }
//   }
//   console.log(params);

//   // SQL 실행
//   const list = await mysql.query(sql, params);
//   return list;
// };


const findMeterialOrderByName = async (keywords)=>{
  let sql = Object.keys(keywords).length == 0 ? 'searchMaterialOrder' : 'searchMaterialOrderWithName';
  let list = await mysql.query(sql, keywords);
  return list;
}

module.exports = {
  findMeterialOrder,
  findMeterialOrderByName
};