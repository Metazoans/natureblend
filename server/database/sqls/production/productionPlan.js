const productList =
    `SELECT 
        product_code,
          product_name,
          expiration_date
FROM product`;

const orders =
    `SELECT
       o.order_num,
       order_amount,
       total_price,
       order_status,
       per_price,
       o.product_code,
       o.orderlist_num,
       ol.order_date,
       ol.due_date,
       p.product_name,
       opr.plan_qty,
       order_amount - opr.plan_qty AS unplanned_qty,
       (select outp.output_amount from output outp where outp.order_num = o.order_num) as output_amount
     FROM orders o INNER JOIN orderlists ol INNER JOIN product p inner join order_plan_relation opr
                                                                            ON o.orderlist_num = ol.orderlist_num
     WHERE o.product_code = p.product_code
       and opr.order_num = o.order_num`;

const ordersByProductCode =
    `SELECT
       o.order_num,
       order_amount,
       total_price,
       order_status,
       per_price,
       o.product_code,
       o.orderlist_num,
       ol.order_date,
       ol.due_date,
       p.product_name,
       opr.plan_qty,
       order_amount - opr.plan_qty AS unplanned_qty,
       (select outp.output_amount from output outp where outp.order_num = o.order_num) as output_amount
     FROM orders o INNER JOIN orderlists ol INNER JOIN product p inner join order_plan_relation opr
                                                                            ON o.orderlist_num = ol.orderlist_num
     WHERE o.product_code = p.product_code
       and opr.order_num = o.order_num
       AND o.product_code = ?`;

// procedure 설정

// CREATE PROCEDURE get_stock(IN p_product_code VARCHAR(10))
// BEGIN
// DECLARE r_stock INT DEFAULT 0;
// DECLARE v_product_code VARCHAR(10);
// DECLARE v_input_amount INT;
// DECLARE v_input_flag TINYINT;
// DECLARE v_dispose_flag TINYINT;
// DECLARE done INT DEFAULT 0;
//
// -- 커서 정의
// DECLARE stock_cursor CURSOR FOR
// SELECT
// product_code,
//     input_amount,
//     input_flag,
//     dispose_flag
// FROM input_body
// WHERE product_code = p_product_code;
//
// -- 핸들러 정의
// DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
//
// -- 커서 열기
// OPEN stock_cursor;
//
// -- 커서 순회
// stock_loop: LOOP
// FETCH stock_cursor INTO v_product_code, v_input_amount, v_input_flag, v_dispose_flag;
// IF done THEN
// LEAVE stock_loop;
// END IF;
//
// -- 조건 확인 후 누적합산
// IF v_input_flag = 0 AND v_dispose_flag = 0 THEN
// SET r_stock = r_stock + v_input_amount;
// END IF;
// END LOOP stock_loop;
//
// -- 커서 닫기
// CLOSE stock_cursor;
//
// -- 결과 반환
// SELECT r_stock AS stock;
// END$$
//
// DELIMITER ;

const productStock = `CALL get_stock(?)`;

// procedure
// 생산계획별 주문 여러건 등록 후 생산계획 등록

// DELIMITER $$
// CREATE PROCEDURE add_plan_by_orders(
//     IN p_order_num_json_array TEXT,
//     IN p_plan_name varchar(50),
// in p_product_code_json_array TEXT,
// in p_plan_qty_json_array TEXT,
// in p_plan_start_date datetime,
// in p_plan_end_date datetime,
// in p_emp_num int
// )
// BEGIN
// DECLARE i INT DEFAULT 1;
// DECLARE order_num_array_length INT;
// DECLARE order_num_value TEXT;
// DECLARE product_code_value TEXT;
// DECLARE plan_qty_value TEXT;
//
//
// DECLARE plan_num INT;
// DECLARE order_num INT;
// declare count int;
//
// DECLARE v_result_value VARCHAR(20);
//
// START TRANSACTION;
//
// SET order_num_array_length = JSON_LENGTH(p_order_num_json_array);
//
// select count(*)
// into count
// from order_plan_relation;
//
// set count = count + 1;
//
// -- 반복적으로 JSON 배열 요소 추출
// WHILE i <= order_num_array_length DO
// SET order_num_value = JSON_UNQUOTE(JSON_EXTRACT(p_order_num_json_array, CONCAT('$[', i - 1, ']')));
// SET product_code_value = JSON_UNQUOTE(JSON_EXTRACT(p_product_code_json_array, CONCAT('$[', i - 1, ']')));
// -- SELECT CONCAT('Extracted product_code: ', product_code_value);
// SET plan_qty_value = JSON_UNQUOTE(JSON_EXTRACT(p_plan_qty_json_array, CONCAT('$[', i - 1, ']')));
//
// INSERT INTO order_plan_relation (plan_num, order_num, product_code, plan_qty)
// VALUES (count, order_num_value, product_code_value, plan_qty_value);
// SET  v_result_value = FOUND_ROWS();
//
// if v_result_value != 1 then
// ROLLBACK;
// SET  v_result_value = 'order_plan_relation insert fail';
// END if;
//
// SET i = i + 1;
// END WHILE;
//
// -- 생산계획번호plan_num(count임), 생산계획명 plan_name, 제품코드 product_code, 계획수량 plan_qty
// -- 계획일자 plan_create_date(sysdate), 계획시작일자 plan_start_date, 계획종료일자 plan_end_date,
//     -- 계획진행상태 plan_status(default plan_waiting), 생산계획자 emp_num
//
// -- order_plan_relation의 plan_num이 production_plan의 plan_num에도 들어감
// insert into production_plan(plan_num, plan_name, plan_start_date, plan_end_date, plan_emp)
// value(count, p_plan_name, p_plan_start_date, p_plan_end_date, p_emp_num);
// SET  v_result_value = FOUND_ROWS();
//
// if v_result_value != 1 then
// ROLLBACK;
// SET  v_result_value = 'production_plan insert fail';
// END if;
//SET  v_result_value = 'success';
// select v_result_value as result;
// COMMIT;
// END$$
//
// DELIMITER ;

// CALL add_plan_by_orders2('[1, 2, 3]', '2024 생산 계획2', '["P001", "P001", "P001"]', '[10, 20, 30]', '2024-12-14', '2025-01-05', 1);
const insertPlanByOrders = `
  CALL add_plan_by_orders(?, ?, ?, ?, ?, ?, ?);
`;

// 생산계획시 등록 가능한 직원만: 생산부서 반장이상 직급, 관리자 직급만 가능
const productionEmployees = `
  select emp_num, name
  from employee
  where job_num = 2 and level >= 2
     or job_num = 6
`;

        
module.exports = {
  productList,
  orders,
  ordersByProductCode,
  productStock,
  insertPlanByOrders,
  productionEmployees
}