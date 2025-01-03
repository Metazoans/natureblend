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
SELECT your_product(po.product_code, 'product_name') AS product_name,
       po.production_order_qty AS product_qty
FROM production_order po
JOIN production_plan pp
WHERE po.plan_num = pp.plan_num
  AND po.production_order_status = 'work_waiting'
ORDER BY po.production_order_date DESC
`;
// `
// SELECT 
// your_product(product_code, 'product_name') AS product_name,
// production_order_qty AS product_qty
// FROM production_order
// WHERE production_order_status = 'work_waiting'
// ORDER BY production_order_date DESC
// `;

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
WHERE pwh.process_status = 'process_waiting' -- process_waiting  -- processing  -- process_complete

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
WHERE pwh.process_status != 'process_waiting' -- process_waiting  -- processing  -- process_complete

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
WHERE pwh.process_status = 'process_waiting' -- process_waiting  -- processing  -- process_complete

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
WHERE pwh.process_status != 'process_waiting' -- process_waiting  -- processing  -- process_complete

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
WHERE pwh.process_status = 'process_waiting' -- process_waiting  -- processing  -- process_complete

  AND pwh.process_name = '포장공정' -- 세척공정 -- 포장공정 -- 음료제작공정
ORDER BY pwh.work_date DESC 
`;

// 포장 품질
const process3qclist =
`
SELECT b.product_name AS product_name,
       qcpp.total_qnt AS product_qty
FROM qc_packaging qcpp
LEFT JOIN process_work_body pb ON qcpp.process_num = pb.process_num
LEFT JOIN bom b ON pb.product_code = b.product_code
WHERE qcpp.inspec_end IS NULL
ORDER BY qcpp.inspec_start DESC
`;

// 제품 입고 대기
const product_input_wait =
`
SELECT p.product_name ,
       q.pass_qnt AS product_qty
FROM process_work_body w
LEFT JOIN qc_packaging q ON q.process_num = w.process_num
LEFT JOIN product p ON w.product_code = p.product_code
WHERE q.qc_packing_id NOT IN
    (SELECT qc_packing_id
     FROM input_body)
AND q.pass_qnt != 0
ORDER BY q.inspec_start DESC
`;

// 제품 출고 대기
const produce_out_wait =
`
SELECT your_product(product_code, 'product_name') AS product_name,
       SUM(order_amount) AS product_qty
FROM orders
WHERE order_status != 'shipped'
GROUP BY orderlist_num,
         product_code
`;

//상품재고
const product_qtying = 
`
WITH output_aggregated AS (
    SELECT 
        input_num,
        SUM(output_amount) AS total_output_amount
    FROM output
    GROUP BY input_num
)
SELECT 
    p.product_name, 
    NVL(
        (SUM(CASE 
                WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN i.input_amount 
                ELSE 0 
            END) 
         - 
         SUM(CASE 
                WHEN i.input_flag = 0 AND i.dispose_flag = 0 THEN NVL(oa.total_output_amount, 0) 
                ELSE 0 
            END)
        ), 0) AS product_qty
FROM 
    product p
LEFT JOIN input_body i
ON p.product_code = i.product_code
LEFT JOIN output_aggregated oa
ON i.input_num = oa.input_num 

ORDER BY product_qty DESC
`;
// GROUP BY p.product_code, p.product_name

// 자재 재고
const material_qtying =
`
WITH pass_material AS
  (SELECT material_code,
          sum(stok_qty) AS stok_qty
   FROM material_lot_qty1 mlq1
   WHERE mlq1.material_nomal = 'b1'
     AND mlq1.material_lot_state = 'c1'
   GROUP BY material_code),
     reject_materal AS
  (SELECT material_code,
          SUM(stok_qty) AS stok_qty
   FROM material_lot_qty1
   WHERE (material_nomal = 'b2'
          AND material_lot_state = 'c1')
     OR (limit_date <= NOW()
         AND material_lot_state = 'c1')
   GROUP BY material_code),
     invalid_mat AS
  (SELECT material_code,
          SUM(material_qty) AS stok_qty
   FROM invalid_material
   WHERE is_out = '0'
   GROUP BY material_code),
     order_material AS
  (SELECT material_code,
          SUM(ord_qty) AS stok_qty
   FROM material_order_body
   WHERE material_state = 'a1'
   GROUP BY material_code)
SELECT ROW_NUMBER() OVER (
                          ORDER BY mat.material_code) AS row_num,
       mat.material_name,
       case when COALESCE(COALESCE(pm.stok_qty, 0)-COALESCE(im.stok_qty, 0),0) < 0 then 0
       ELSE COALESCE(COALESCE(pm.stok_qty, 0)-COALESCE(im.stok_qty, 0),0)
		 END
		  AS stok_qty
FROM material mat
LEFT JOIN pass_material pm ON mat.material_code = pm.material_code
LEFT JOIN reject_materal rm ON mat.material_code = rm.material_code
LEFT JOIN invalid_mat im ON mat.material_code = im.material_code
LEFT JOIN order_material om ON mat.material_code = om.material_code
WHERE (case when COALESCE(COALESCE(pm.stok_qty, 0)-COALESCE(im.stok_qty, 0),0) < 0 then 0
       ELSE COALESCE(COALESCE(pm.stok_qty, 0)-COALESCE(im.stok_qty, 0),0)
		 END) != 0
AND mat.material_code != 'M010'
ORDER BY (case when COALESCE(COALESCE(pm.stok_qty, 0)-COALESCE(im.stok_qty, 0),0) < 0 then 0
       ELSE COALESCE(COALESCE(pm.stok_qty, 0)-COALESCE(im.stok_qty, 0),0)
		 END) DESC
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
  process3qclist,
  product_input_wait,
  produce_out_wait,
  product_qtying,
  material_qtying,

};