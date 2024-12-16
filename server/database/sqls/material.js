//생산계획 리스트
const material_order_head =
` SELECT *
 FROM production_plan
 WHERE plan_status = 'plan_waiting' `;

//발주계획 필요 자재 조회
const need_order_material =
`
WITH stok_qty_cte AS (
    SELECT
        material_code,
        SUM(stok_qty) AS stok_qty
    FROM 
        material_lot_qty1
    WHERE
        material_nomal = 'b1'
        AND material_lot_state = 'c1'
    GROUP BY
        material_code
)
SELECT
    bm.material_code AS material_code,
    bm.material AS material,
    COALESCE(stok.stok_qty, 0) AS stok_qty,
    mat.safety_inventory AS safety_inventory,
    (bm.material_con * pp.plan_qty) AS plan_qty,		
    COALESCE(
		 (
	        SELECT SUM(ord_qty)
	        FROM material_order_body
	        WHERE material_code = bm.material_code
	          AND material_state = 'a1'
	    ),
	 0)  AS ordering_qty,
    GREATEST(
        (
            (bm.material_con * pp.plan_qty) 
            + mat.safety_inventory 
            - COALESCE(stok.stok_qty, 0) 
            - COALESCE(
                (SELECT SUM(ord_qty)
                 FROM material_order_body
                 WHERE material_code = bm.material_code
                   AND material_state = 'a1'
                ), 
                0
            )
        ), 
        0
    ) AS need_qty,				
    pp.plan_code AS 생산계획코드,
    pp.plan_qty AS 생산수량,
    b.bom_num AS 레시피코드
FROM production_plan pp
JOIN
    bom b
    ON pp.product_code = b.product_code
JOIN
    bom_material bm
    ON b.bom_num = bm.bom_num
JOIN
    material mat
    ON bm.material_code = mat.material_code	
JOIN
    stok_qty_cte stok
    ON stok.material_code = bm.material_code
WHERE 
    pp.plan_code = ?
AND 
    bm.material_code != 'M035'
`;

//거래처 전체선택
const full_client =
`
SELECT
        client_num,
		com_name,
		emp_name,
		emp_tel
FROM client
WHERE trade = '구매'
`;

//거래처 선택조회
const full_client_info =
`
SELECT
        client_num,
		com_name,
		emp_name,
		emp_tel
FROM client
WHERE trade = '구매'
and com_name like IFNULL(?, '%')
`;

module.exports = {
   material_order_head,
   need_order_material,
   full_client,
   full_client_info,

};