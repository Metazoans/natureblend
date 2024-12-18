//주문서 

//전체조회 
const orderList =
`SELECT o.orderlist_num,
		o.orderlist_title,
		o.order_date,
		o.due_date,
		o.orderlist_status,
		e.name, 
		c.com_name
FROM orderlists o LEFT JOIN employee e 
ON  o.emp_num = e.emp_num
                  LEFT JOIN client c
ON o.client_num = c.client_num
ORDER BY 
	CASE 
		WHEN o.orderlist_status = 'update' THEN 1
		WHEN  o.orderlist_status = 'continue' THEN 2
		WHEN  o.orderlist_status = 'done' THEN 3
		ELSE 4
	END; `;

//거래처조회 
const clientlist = 
`SELECT com_name 
FROM client
WHERE trade='판매'
ORDER BY com_name`;

//주문서 검색 조회
const orderListInfo = 
`SELECT o.orderlist_num,
		o.orderlist_title,
		o.order_date,
		o.due_date,
		o.orderlist_status,
		e.name, 
		c.com_name
FROM orderlists o LEFT JOIN employee e 
ON  o.emp_num = e.emp_num
                  LEFT JOIN client c
ON o.client_num = c.client_num `;
// WHERE 
// (o.orderlist_status LIKE ? OR ? IS NULL)
// AND (o.orderlist_title LIKE ? OR ? IS NULL)
// AND (c.com_name LIKE ? OR ? IS NULL)
// AND (o.order_date >= ? OR ? IS NULL)
// AND (o.order_date <= ? OR ? IS NULL)`;


// 주문서 등록 가능한 직원만: 영업부서 
const orderEmployees = 
` select name
  from employee
  where job_num = 1`;

//제품이름, 코드 전체 출력 
const orderProduct =
`SELECT product_code,
       product_name
FROM product
ORDER BY product_code`;

//주문,주문서 등록 
/*DELIMITER //
CREATE PROCEDURE orderlistInput(
IN v_orderlist_title VARCHAR(50),
IN v_due_date DATETIME,
IN v_emp_name VARCHAR(30),
IN v_com_name VARCHAR(30),


IN v_product_code_json_array TEXT,
IN v_product_num_json_array TEXT,
IN v_per_price_json_array TEXT
)

BEGIN
-- 변수 선언
DECLARE v_emp_num INT;
DECLARE v_com_num INT;
DECLARE v_last_num INT;
DECLARE v_change_num INT;
DECLARE v_result_value INT;

DECLARE i INT DEFAULT 1;
DECLARE product_code_array_length INT;
DECLARE product_code_value TEXT;
DECLARE product_num_value TEXT;
DECLARE per_price_value TEXT;


-- 트랜잭션 시작
START TRANSACTION;

-- JSON 배열 길이 계산
SET product_code_array_length = JSON_LENGTH(v_product_code_json_array);

-- 사원번호 (사원이름)
SELECT emp_num
INTO v_emp_num
FROM employee
WHERE name = v_emp_name
LIMIT 1;

-- 회사번호 (회사이름)
SELECT client_num
INTO v_com_num
FROM client
WHERE com_name = v_com_name
LIMIT 1;

-- 주문서 등록
INSERT INTO orderlists
		(orderlist_title,
        due_date,
        emp_num,
        client_num)
VALUES (v_orderlist_title,
	    v_due_date,
		v_emp_num,
		v_com_num);

-- 주문서 등록 후 변화한 값 
SET v_change_num = FOUND_ROWS();
        
SELECT v_change_num;

IF v_change_num = 1 THEN 
-- 마지막 주문서 번호 가져오기
SELECT orderlist_num
INTO v_last_num
FROM orderlists
ORDER BY orderlist_num desc
limit 1;

-- 반복으로  json 배열 요소 추출 
WHILE i <= product_code_array_length DO
	SET product_code_value  = JSON_UNQUOTE(JSON_EXTRACT(v_product_code_json_array , CONCAT('$[', i - 1, ']')));
    SET product_num_value   = JSON_UNQUOTE(JSON_EXTRACT(v_product_num_json_array  , CONCAT('$[', i - 1, ']')));
    SET per_price_value   = JSON_UNQUOTE(JSON_EXTRACT(v_per_price_json_array  , CONCAT('$[', i - 1, ']')));
	INSERT INTO orders 
			(order_amount,
			total_price,
			per_price,
			product_code,
			orderlist_num)
	VALUES (product_num_value,
			product_num_value*per_price_value,
			per_price_value,
			product_code_value,
			v_last_num);
		SET v_result_value = FOUND_ROWS();
			IF v_result_value != 1 THEN 
				-- 오류 발생 시 롤백
				rollback;
				
			END IF;
		SET i = i + 1;
	END WHILE;
    -- 트랜잭션 커밋
        COMMIT;
    ELSE
    -- 주문서 등록 실패 시 롤백
        ROLLBACK;
END IF;
END//
DELIMITER; */
// CALL orderlistInput('테스트 주문서','2024-12-31','김사원','대한유통','["P001", "P002"]','[10, 20]','[1000, 2000]');

const orderListInsert = 
`CALL orderlistInput(?, ?, ?, ?, ?, ?, ?);`;

//주문서 단건 조회
const orderInfo =
`SELECT l.orderlist_num,
	   l.orderlist_title,
       l.order_Date,
       l.due_date,
       l.orderlist_status,
       e.name,
       c.com_name,
       o.order_num,
       o.order_amount,
       o.total_price,
       o.order_status,
       o.per_price,
       o.product_code,
       p.product_name
from orderlists l join orders o
on l.orderlist_num = o.orderlist_num
				   left join client c
on l.client_num = c.client_num
					left join employee e
on l.emp_num = e.emp_num
join product p 
on p.product_code = o.product_code
where l.orderlist_num = ?`;


const orderListUpdate=
`UPDATE orderlists
SET ?
WHERE orderlist_num =? `;

const orderListDelete = 
`DELETE FROM orderlists
WHERE orderlist_num =? `;

module.exports = {
    orderList,
	clientlist,
    orderListInfo,
	orderEmployees,
	orderProduct,
    orderListInsert,
    orderListUpdate,
    orderListDelete,
	orderInfo,

}