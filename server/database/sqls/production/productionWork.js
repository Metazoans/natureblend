const workingOrders = `
    select production_order_num, production_order_name, plan_num, po.product_code, p.product_name, DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date, production_order_qty, production_order_date, emp_num
    from production_order po inner join product p
        on po.product_code = p.product_code
    where po.production_order_status in ('work_waiting', 'work_in_process')
`

const workForToday = `
    select machine_type, process_code, process_end_time, process_name, process_start_time, process_status, process_work_header_num, product_code, product_name, production_order_name, production_order_num, production_order_qty, DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date
    from process_work_header
    where process_status = 'process_waiting'
    and work_date = CURDATE()
`

const workByOrderNum = `
    select * from process_work_header
    where production_order_num = ?
`

const insertPartialWork = `
    insert into process_work_body(process_work_header_num, product_code)
    values(?, ?)
`

const partialWorkByProcess = `
    select process_num, process_work_header_num, emp_num, your_employee(emp_num, 'name') as emp_name, machine_num, your_machine(machine_num, 'machine_name') as machine_name, partial_process_status, process_todo_qty,process_complete_qty, fail_qty, success_qty, partial_process_start_time, partial_process_end_time, is_inspected
    from process_work_body
    where process_work_header_num = ?
`

// 생산부서 직원만 조회
const partialWorkEmpList = `
    select emp_num, name, birth, tel, job, job_num, position
    from employee
    where job_num = 2
`
// 특정 공정에서 사용하는 설비 중 가동 가능한 설비 조회
const machineListByProcess = `
    select machine_num, machine_name
    from machine 
    where process_code = ?
    and machine_state = 'run';
`

const startPartialWork = `
    update process_work_body
`

const endPartialWork = `
    update process_work_body
`

const updateProcessStatus = `
    update process_work_header
    set process_status = ?
    where process_work_header_num = ?
`

const updateProcessStartTime = `
    update process_work_header
    set process_start_time = ?
    where process_work_header_num = ?
`

const updateProcessEndTime = `
    update process_work_header
    set process_end_time = ?
    where process_work_header_num = ?
`

module.exports = {
    workingOrders,
    workForToday,
    workByOrderNum,
    insertPartialWork,
    partialWorkByProcess,
    partialWorkEmpList,
    machineListByProcess,
    startPartialWork,
    endPartialWork,
    updateProcessStatus,
    updateProcessStartTime,
    updateProcessEndTime
}