const workingOrders = `
    select production_order_num, production_order_name, plan_num, po.product_code, p.product_name, work_date, production_order_qty, production_order_date, emp_num
    from production_order po inner join product p
        on po.product_code = p.product_code
    where po.production_order_status in ('work_waiting', 'work_in_process')
`

const workForToday = `
    select * from process_work_header
    where process_status = 'process_waiting'
    and work_date = CURDATE()
`

const workByOrderNum = `
    select * from process_work_header
    where process_status = 'process_waiting'
    and production_order_num = ?
`

module.exports = {
    workingOrders,
    workForToday,
    workByOrderNum
}