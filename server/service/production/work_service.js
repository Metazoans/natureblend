const mysql = require('../../database/mapper');

const findWorkingOrders = async ()=>{
    return await mysql.query('workingOrders');
}

module.exports = {
    findWorkingOrders
}