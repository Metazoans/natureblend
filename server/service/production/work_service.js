const mysql = require('../../database/mapper');

const findWorkingOrders = async ()=>{
    return await mysql.query('workingOrders');
}

const findWorkForToday = async ()=>{
    return await mysql.query('workForToday');
}

const findWorkByOrderNum = async (productionOrderNum)=>{
    return await mysql.query('workByOrderNum', [productionOrderNum]);
}

module.exports = {
    findWorkingOrders,
    findWorkForToday,
    findWorkByOrderNum
}