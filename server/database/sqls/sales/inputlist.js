//창고조회(사용가능 + 위치 물류)
const getUseWarehouse = 
`SELECT warehouse_code
	  ,warehouse_name
FROM warehouse
WHERE storage = '가능'
AND warehouse_location LIKE '%물류%'`;

//제품명, 통과일자 날짜 받아서 통과 결과 출력 
const getQtResult = 
`SELECT q.qc_packing_id
	   ,w.product_code
       ,p.product_name
       ,q.process_num
       ,q.pass_qnt
       ,q.inspec_end
FROM process_work w  LEFT JOIN qc_packaging q
ON q.process_num = w.process_num
LEFT JOIN product p
ON w.product_code = p.product_code
WHERE q.qc_packing_id NOT IN (SELECT qc_packing_id FROM input_body) `;




module.exports = {
    getUseWarehouse,
    getQtResult,


}