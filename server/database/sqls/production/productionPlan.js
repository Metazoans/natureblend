const productList =
    `SELECT 
        product_code,
          product_name,
          expiration_date
FROM product`;

const orders =
    `SELECT
       order_num,
       order_amount,
       total_price,
       order_status,
       per_price,
       o.product_code,
       o.orderlist_num,
       ol.order_date,
       ol.due_date,
       p.product_name
     FROM orders o INNER JOIN orderlists ol INNER JOIN product p
        ON o.orderlist_num = ol.orderlist_num
        WHERE o.product_code = p.product_code`;

const ordersByProductCode =
    `SELECT
       order_num,
       order_amount,
       total_price,
       order_status,
       per_price,
       o.product_code,
       o.orderlist_num,
       ol.order_date,
       ol.due_date,
       p.product_name
     FROM orders o INNER JOIN orderlists ol INNER JOIN product p
    ON o.orderlist_num = ol.orderlist_num
     WHERE o.product_code = p.product_code
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
// 생산계획 등록시, 주문별 생산 데이터를 insert 한 후 실제 계획 등록
// DELIMITER $$
// CREATE PROCEDURE add_plan_by_orders(
//     IN json_array TEXT
// )
// BEGIN
// DECLARE i INT DEFAULT 1;
// DECLARE array_length INT;
// DECLARE current_value TEXT;
//
// DECLARE plan_num INT;
// DECLARE order_num INT;
// declare count int;
//
// SET array_length = JSON_LENGTH(json_array);
//
// select count(*)
// into count
// from order_plan_relation;
//
// set count = count + 1;
//
// -- 반복적으로 JSON 배열 요소 추출
// WHILE i <= array_length DO
// SET current_value = JSON_UNQUOTE(JSON_EXTRACT(json_array, CONCAT('$[', i - 1, ']')));
//
// INSERT INTO order_plan_relation (plan_num, order_num)
// VALUES (count, current_value);
//
// SET i = i + 1;
// END WHILE;
// END$$
//
// DELIMITER ;

// CALL add_plan_by_orders('[1, 2, 3]');
const insertPlanByOrders = `
  CALL add_plan_by_orders(?)
`;

        
module.exports = {
  productList,
  orders,
  ordersByProductCode,
  productStock,
}