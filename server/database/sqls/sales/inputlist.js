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
FROM process_work_body w  LEFT JOIN qc_packaging q
ON q.process_num = w.process_num
LEFT JOIN product p
ON w.product_code = p.product_code
WHERE q.qc_packing_id NOT IN (SELECT qc_packing_id FROM input_body) `;

//제품 입고 
/*DELIMITER //
CREATE PROCEDURE inputProduct
(
IN v_product_code_json_array TEXT,qc_packaging
IN v_process_num_json_array TEXT,
IN v_input_amount_json_array TEXT,
IN v_qc_packing_id_json_array TEXT,
IN v_inspect_end_json_array TEXT,

IN v_emp_name VARCHAR(30),
IN v_warehouse_code VARCHAR(30)
)
BEGIN
DECLARE v_emp_num INT;
DECLARE v_expiration_date_array TEXT;

DECLARE v_change_num INT;
DECLARE v_result_value INT;
DECLARE v_last_num INT;
DECLARE i INT DEFAULT 1;

DECLARE qc_packing_id_array_length INT;

DECLARE qc_packing_id_value TEXT;
DECLARE product_code_value TEXT;
DECLARE process_num_value TEXT;
DECLARE input_amount_value TEXT;
DECLARE inspect_end_value TEXT;

DECLARE expiration_date_value TEXT;

    -- 트렌젝션 시작
    START TRANSACTION;
-- 사원번호 (사원이름)
SELECT emp_num
INTO v_emp_num
FROM employee
WHERE name = v_emp_name
LIMIT 1;

-- 입고 헤더 추가 input_header
INSERT INTO input_header (emp_num)
VALUES (v_emp_num);

-- 입고헤더 등록 후 변화한 값 
SET v_change_num = FOUND_ROWS();

SELECT v_change_num;

	IF v_change_num = 1 THEN 
		-- 마지막 입고헤더 번호 가져오기
		SELECT inputlist_num
		INTO v_last_num
		FROM input_header
		ORDER BY inputlist_num desc
		limit 1;

		SET qc_packing_id_array_length = JSON_LENGTH(v_qc_packing_id_json_array);
		WHILE i <= qc_packing_id_array_length DO
			SET product_code_value = JSON_UNQUOTE(JSON_EXTRACT(v_product_code_json_array, CONCAT('$[', i - 1, ']')));
			SET process_num_value = JSON_UNQUOTE(JSON_EXTRACT(v_process_num_json_array, CONCAT('$[', i - 1, ']')));
			SET input_amount_value = JSON_UNQUOTE(JSON_EXTRACT(v_input_amount_json_array, CONCAT('$[', i - 1, ']')));
			SET qc_packing_id_value = JSON_UNQUOTE(JSON_EXTRACT(v_qc_packing_id_json_array, CONCAT('$[', i - 1, ']')));
			SET inspect_end_value = JSON_UNQUOTE(JSON_EXTRACT(v_inspect_end_json_array, CONCAT('$[', i - 1, ']')));

		-- 각 product 의 expiration_date 구하기 
		SELECT expiration_date
		INTO expiration_date_value
		FROM product
		WHERE product_code = product_code_value
		LIMIT 1;
        
        -- 입고테이블(input_body) 등록
        INSERT INTO input_body
						(product_code
                        ,product_lot
                        ,input_amount
                        ,warehouse_code
                        ,qc_packing_id
                        ,expire_date
                        ,inputlist_num)
		VALUES (product_code_value
				,CONCAT(product_code_value,DATE_FORMAT(inspect_end_value,'%d'),DATE_FORMAT(inspect_end_value,'%m'),DATE_FORMAT(inspect_end_value,'%y'),process_num_value)
                ,input_amount_value
                ,v_warehouse_code
                , qc_packing_id_value
                ,ADDDATE(inspect_end_value,expiration_date_value)
                ,v_last_num );
                
				SET v_result_value = FOUND_ROWS();
					IF v_result_value != 1 THEN 
						-- 오류 발생 시 롤백
						rollback;
					END IF;
				SET i = i + 1;
		END WHILE;
		-- 문제없을때
		COMMIT;
		ELSE
		-- 주문서 등록 실패 시 롤백
			ROLLBACK;
   END IF;
END//
DELIMITER ;
CALL inputProduct(
    '["P001", "P002", "P003"]',    -- v_product_code_json_array
    '["001", "002", "003"]',       -- v_process_num_json_array
    '["1500", "1500", "1500"]',       -- v_input_amount_json_array
    '["QCM2412210001", "QCM2412210004", "QCM2412210006"]', -- v_qc_packing_id_json_array
    '["2024-12-24", "2024-12-20", "2024-12-23"]', -- v_inspect_end_json_array
    '김사원',                    -- v_emp_name (사원이름)
    'W005'                        -- v_warehouse_code (창고코드)
);*/ 
const insertProduct = 
`CALL inputProduct(?, ?, ?, ?, ?, ?, ? )`;



module.exports = {
    getUseWarehouse,
    getQtResult,
    insertProduct,


}