const waitingPlanList = `
    SELECT
        ROW_NUMBER() OVER (ORDER BY pp.plan_num, o.product_code) AS rownum,
        ROW_NUMBER() OVER (PARTITION BY pp.plan_num ORDER BY o.product_code) AS rownum_by_plan,
        pp.plan_num,
        pp.plan_name,
        o.product_code,
        p.product_name,
        p.capacity,
        SUM(o.plan_qty) AS total_plan_qty,
        pp.plan_start_date,
        pp.plan_end_date

    FROM
        production_plan pp
            INNER JOIN
        order_plan_relation o
        ON pp.plan_num = o.plan_num
            INNER JOIN
        product p
        ON o.product_code = p.product_code
    WHERE
        pp.plan_status = 'plan_waiting'
    GROUP BY
        pp.plan_num,
        pp.plan_name,
        o.product_code,
        p.product_name,
        pp.plan_start_date,
        pp.plan_end_date`;

const processFlow = `
    select process_sequence, process_name
    from process_chart
    where product_code = ?
    order by process_sequence`;

const bomByProduct = `
    select material_code, material, material_con
    from bom b inner join bom_material bm
        on b.bom_num = bm.bom_num
    where product_code = ?`;

// DELIMITER $$
// CREATE PROCEDURE getMaterialStock(
//     IN p_material_code_json_array TEXT
// )
// BEGIN
// DECLARE i INT DEFAULT 1;
// DECLARE material_code_array_length INT;
// DECLARE material_code_value TEXT;
//
// -- 기존 테이블 삭제 및 새로 생성
// DROP TEMPORARY TABLE IF EXISTS temp_result;
//
// -- 임시 테이블 생성
// CREATE TEMPORARY TABLE IF NOT EXISTS temp_result (
//     material_code VARCHAR(50),
//     material_name VARCHAR(50),
//     lot_code VARCHAR(50),
//     stok_qty INT,
//     limit_date DATE,
//     invalid_qty int
// );
//
// START TRANSACTION;
//
// SET material_code_array_length = JSON_LENGTH(p_material_code_json_array);
//
// WHILE i <= material_code_array_length DO
// SET material_code_value = JSON_UNQUOTE(JSON_EXTRACT(p_material_code_json_array, CONCAT('$[', i - 1, ']')));
//
// -- 결과값을 임시 테이블에 삽입
// INSERT INTO temp_result (material_code, material_name, lot_code, stok_qty, limit_date, invalid_qty)
// select
// m1.material_code,
//     m2.material_name,
//     m1.lot_code,
//     stok_qty,
//     limit_date,
//     (select sum(material_qty)
// from invalid_material i
// where m1.lot_code = i.lot_code) as invalid_qty
// from material_lot_qty1 m1 inner join material m2
// on m1.material_code = m2.material_code
// where material_nomal = 'b1'
// and m1.material_code = material_code_value;
//
// SET i = i + 1;
// END WHILE;
//
// select material_code, material_name, lot_code, stok_qty, limit_date, invalid_qty from temp_result;
// commit;
// END$$
//
// DELIMITER ;

const getMaterialStock = `
    call getMaterialStock(?)`;

// values('test지시', 1, 'P001', '2024-12-21', 10, 1);
const insertProductionOrder = `
    insert into production_order(production_order_name, plan_num, product_code, work_date, production_order_qty, emp_num)
    values(?, ?, ?, ?, ?, ?)
`;

// values(2, 'M001', 'M03313Z24101', 1);
const insertHoldingStock = `
    insert into invalid_material(production_order_num, material_code, lot_code, material_qty)
    values(?, ?, ?, ?);
`;

module.exports = {
    waitingPlanList,
    processFlow,
    bomByProduct,
    getMaterialStock,
    insertProductionOrder,
    insertHoldingStock
}