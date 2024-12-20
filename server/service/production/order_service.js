const mysql = require('../../database/mapper');

const findWaitingPlanList = async ()=>{
    return await mysql.query('waitingPlanList');
}

const findProcessFlow = async (productCode)=>{
    return await mysql.query('processFlow', [productCode]);
}

module.exports = {
    findWaitingPlanList,
    findProcessFlow,
}