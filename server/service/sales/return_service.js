const mysql = require('../../database/mapper.js');

const getReturnList = async()=>{
    let list = await mysql.query('getReturn');
    return list;
}












module.exports = {
    getReturnList,
}