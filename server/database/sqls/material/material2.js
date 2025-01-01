// 자재 발주서 (전체) 조회 하기 (이건 돌려쓰는거라 삭제금지!!)
const configloding =
`
SELECT mob.body_num,
       mob.order_code,
       mat.material_name,
       cli.com_name,
       mob.ord_qty,
       moh.order_date,
       mob.limit_date,
       mob.unit_price,
       mob.total_price,
       emp.name,
       CASE
           WHEN mob.material_state = 'a1' THEN '발주등록'
           WHEN mob.material_state = 'a3' THEN '취소'
           WHEN mob.material_state = 'a4' THEN '입고완료'
       END AS material_state
FROM material_order_body mob
JOIN material_order_head moh ON mob.order_code = moh.order_code
JOIN material mat ON mob.material_code = mat.material_code
JOIN client cli ON moh.client_num = cli.client_num
JOIN employee emp ON moh.emp_num = emp.emp_num
`;

//자재검사중
const selectQCMRWithConditions2 =`
SELECT q.qc_material_id,
       q.order_code,
       q.material_code,
       m.material_name,
       q.total_qnt,
       q.pass_qnt,
       q.rjc_qnt,
       q.inspec_start,
       q.inspec_end,
       q.inspec_status,
       q.emp_num,
       e.name
FROM qc_material q LEFT JOIN employee e ON q.emp_num = e.emp_num
						 LEFT JOIN material m ON q.material_code = m.material_code

`;

//자재 입고해야할 목록(자재입고대기)
const material_input_qc_list2 =
`
SELECT mb.body_num,
       mb.order_code,
       m.material_name,
       cl.com_name,
       mb.ord_qty,
       qm.total_qnt,
       qm.pass_qnt,
       qm.rjc_qnt,
       mb.unit_price,
       (qm.pass_qnt * mb.unit_price) AS total_price,
       qm.inspec_end
FROM qc_material qm
JOIN material_order_body mb ON mb.order_code = qm.order_code
AND mb.material_code = qm.material_code
JOIN material m ON mb.material_code = m.material_code
JOIN material_order_head moh ON mb.order_code = moh.order_code
JOIN client cl ON cl.client_num = moh.client_num
WHERE mb.material_state = 'a1'
  AND qm.inspec_status = '검사완료'
`;

// 생산 지시 목록
const processlist =
`
SELECT CONCAT(product_name, ' (', CASE
                                      WHEN capacity = 1500 THEN '1.5L'
                                      WHEN capacity = 750 THEN '750ml'
                                      WHEN capacity = 500 THEN '500ml'
                                      ELSE ''
                                  END , ')') AS product_name,
       production_order_qty AS product_qty
FROM process_work_header pwh
WHERE pwh.process_status = 'process_waiting' -- process_waiting  -- processing  -- process_complete

  AND pwh.process_name = '음료제작공정' -- 세척공정 -- 포장공정 -- 음료제작공정
ORDER BY pwh.work_date DESC
`;

// 착즙 공정
const process1list =
`
SELECT CONCAT(product_name, ' (', CASE
                                      WHEN capacity = 1500 THEN '1.5L'
                                      WHEN capacity = 750 THEN '750ml'
                                      WHEN capacity = 500 THEN '500ml'
                                      ELSE ''
                                  END , ')') AS product_name,
       production_order_qty AS product_qty
FROM process_work_header pwh
WHERE pwh.process_status = 'processing' -- process_waiting  -- processing  -- process_complete

  AND pwh.process_name = '음료제작공정' -- 세척공정 -- 포장공정 -- 음료제작공정
ORDER BY pwh.work_date DESC
`;

// 착즙 품질
const process1qclist =
`
SELECT CONCAT(product_name, ' (', CASE
                                      WHEN capacity = 1500 THEN '1.5L'
                                      WHEN capacity = 750 THEN '750ml'
                                      WHEN capacity = 500 THEN '500ml'
                                      ELSE ''
                                  END , ')') AS product_name,
       production_order_qty AS product_qty
FROM process_work_header pwh
WHERE pwh.process_status = 'process_complete' -- process_waiting  -- processing  -- process_complete

  AND pwh.process_name = '음료제작공정' -- 세척공정 -- 포장공정 -- 음료제작공정
ORDER BY pwh.work_date DESC
`;

// 세척 공정
const process2list =
`
SELECT CONCAT(product_name, ' (', CASE
                                      WHEN capacity = 1500 THEN '1.5L'
                                      WHEN capacity = 750 THEN '750ml'
                                      WHEN capacity = 500 THEN '500ml'
                                      ELSE ''
                                  END , ')') AS product_name,
       production_order_qty AS product_qty
FROM process_work_header pwh
WHERE pwh.process_status != 'process_complete' -- process_waiting  -- processing  -- process_complete

  AND pwh.process_name = '세척공정' -- 세척공정 -- 포장공정 -- 음료제작공정
ORDER BY pwh.work_date DESC
`;

// 세척 품질
const process2qclist =
`
SELECT CONCAT(product_name, ' (', CASE
                                      WHEN capacity = 1500 THEN '1.5L'
                                      WHEN capacity = 750 THEN '750ml'
                                      WHEN capacity = 500 THEN '500ml'
                                      ELSE ''
                                  END , ')') AS product_name,
       production_order_qty AS product_qty
FROM process_work_header pwh
WHERE pwh.process_status = 'process_complete' -- process_waiting  -- processing  -- process_complete

  AND pwh.process_name = '세척공정' -- 세척공정 -- 포장공정 -- 음료제작공정
ORDER BY pwh.work_date DESC
`;


// 포장 공정
const process3list =
`
SELECT CONCAT(product_name, ' (', CASE
                                      WHEN capacity = 1500 THEN '1.5L'
                                      WHEN capacity = 750 THEN '750ml'
                                      WHEN capacity = 500 THEN '500ml'
                                      ELSE ''
                                  END , ')') AS product_name,
       production_order_qty AS product_qty
FROM process_work_header pwh
WHERE pwh.process_status != 'process_complete' -- process_waiting  -- processing  -- process_complete

  AND pwh.process_name = '포장공정' -- 세척공정 -- 포장공정 -- 음료제작공정
ORDER BY pwh.work_date DESC 
`;

module.exports = {
  configloding,
  selectQCMRWithConditions2,
  material_input_qc_list2,
  processlist,
  process1list,
  process1qclist,
  process2list,
  process2qclist,
  process3list,

};