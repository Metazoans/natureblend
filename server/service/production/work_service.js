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

const addPartialWork = async (partialWorkInfo)=>{
    let result = await mysql.query('insertPartialWork', Object.values(partialWorkInfo));
    if(result.affectedRows === 1) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

const findPartialWork = async (processWorkHeaderNum)=>{
    return await mysql.query('partialWorkByProcess', [processWorkHeaderNum]);
}

const getProductionEmpList = async ()=>{
    return await mysql.query('partialWorkEmpList')
}

const getMachineList = async (processCode)=>{
    return await mysql.query('machineListByProcess', [processCode])
}

const startWork = async (startInfo)=>{
    let query =  `set emp_num = ${startInfo.empName}, machine_num = ${startInfo.machineNum}, process_todo_qty = ${startInfo.todoQty}, partial_process_start_time = NOW(), partial_process_status = 'partial_processing',`

    if(typeof startInfo.failQty === 'number' && typeof startInfo.successQty !== 'number') {
        query += `fail_qty = ${startInfo.failQty}, success_qty = ${null}`
    } else if(typeof startInfo.failQty !== 'number' && typeof startInfo.successQty === 'number') {
        query += `fail_qty = ${null}, success_qty = ${startInfo.successQty}`
    } else if(typeof startInfo.failQty !== 'number' && typeof startInfo.successQty !== 'number') {
        query += `fail_qty = ${null}, success_qty = ${null}`
    } else {
        query += `fail_qty = ${startInfo.failQty}, success_qty = ${startInfo.successQty}`
    }

    query += ` where process_num = ${startInfo.process_num}`

    let result = await mysql.query('startPartialWork', query)
    if(result.affectedRows === 1) {
        return { message: 'success' }
    } else {
        return { message: 'fail' }
    }
}

module.exports = {
    findWorkingOrders,
    findWorkForToday,
    findWorkByOrderNum,
    addPartialWork,
    findPartialWork,
    getProductionEmpList,
    getMachineList,
    startWork
}