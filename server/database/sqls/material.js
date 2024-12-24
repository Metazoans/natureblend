//생산계획 리스트
const material_order_head =
`
 SELECT
		opr.order_plan_num,
		opr.plan_num,
		opr.product_code,
		pp.plan_create_date,
		opr.plan_qty,
		pro.product_name
FROM production_plan pp
		JOIN order_plan_relation opr
				ON pp.plan_num = opr.plan_num
		JOIN orders orde
				ON opr.order_num = orde.order_num
		JOIN product pro
				ON opr.product_code = pro.product_code
WHERE pp.plan_status = 'plan_waiting'
AND orde.order_status != 'shipped'
`;


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
    COALESCE(mat.safety_inventory, 0) AS safety_inventory,
    COALESCE((bm.material_con * opr.plan_qty), 0) AS plan_qty,
    COALESCE(
		 (
	        SELECT SUM(ord_qty)
	        FROM material_order_body
	        WHERE material_code = bm.material_code
	          AND material_state = 'a1'
	    ),
	 0)  AS ordering_qty,
    COALESCE(
		GREATEST(
			(
				(bm.material_con * opr.plan_qty) 
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
		),
	0) AS need_qty,				
    opr.plan_num AS 생산계획코드,
    opr.plan_qty AS 생산수량,
    b.bom_num AS 레시피코드
FROM order_plan_relation opr
JOIN bom b
    ON opr.product_code = b.product_code
JOIN
    bom_material bm
    ON b.bom_num = bm.bom_num
JOIN
    material mat
    ON bm.material_code = mat.material_code	
LEFT JOIN
    stok_qty_cte stok
    ON stok.material_code = bm.material_code
WHERE 
    opr.order_plan_num = ?
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
		emp_tel,
		com_num,
		address
FROM client
WHERE trade = '구매'
and com_name like IFNULL(?, '%')
`;

// 상품등록 트렌젝션
// CALL material_input_polist(22, 33, 'M032', 150, NOW(), 1500, 30000, @result);
const input_order =
`
    CALL material_input_polist(?, ?, ?, ?, ?, ?, ?, @result);
`;

// ★상품등록 트렌젝션2 [리뉴얼]
const input_order2 =
`
    CALL material_input_polist_rmk(?, ?, ?, ?, ?, ?, ?, ?, @v_result);
`;

// 자재입고 메뉴에 사용될 쿼리 (전체리스트 검사완료된 전체리스트 가져옴)
const material_input_qc_list =
`
SELECT
		mb.body_num,
		mb.order_code,
		m.material_name,
		cl.com_name,
		mb.ord_qty,
		qm.total_qnt,
		qm.pass_qnt,
		qm.rjc_qnt,
		mb.unit_price,
		( qm.pass_qnt * mb.unit_price ) AS total_price,
		qm.inspec_end
FROM
		qc_material qm
		JOIN material_order_body mb
			ON mb.order_code = qm.order_code
		JOIN material m
			ON mb.material_code = m.material_code
		JOIN material_order_head moh
			ON mb.order_code = moh.order_code
		JOIN client cl
			ON cl.client_num = moh.client_num
WHERE
		mb.material_state = 'a1'
AND	
		qm.inspec_status = '검사완료'
`;

//창고조회
const warehouse_list =
`
SELECT 
		warehouse_code,
		warehouse_name
FROM
		warehouse
WHERE
		STORAGE = '가능'
`;

//LOT번호 가공해오기
const material_lot_num =
`
SELECT
		CASE
			WHEN SUBSTRING(lot_code, 5, 5) != CONCAT(
														DATE_FORMAT(NOW(), '%d'),
														CASE
															WHEN DATE_FORMAT(NOW(), '%m') = 10 THEN 'X'
															WHEN DATE_FORMAT(NOW(), '%m') = 11 THEN 'Y'
															WHEN DATE_FORMAT(NOW(), '%m') = 12 THEN 'Z'
															ELSE DATE_FORMAT(NOW(), '%m')
														END,
														DATE_FORMAT(NOW(), '%y')
													)
			THEN 
				CONCAT(
					DATE_FORMAT(NOW(), '%d'),
					CASE
						WHEN DATE_FORMAT(NOW(), '%m') = 10 THEN 'X'
						WHEN DATE_FORMAT(NOW(), '%m') = 11 THEN 'Y'
						WHEN DATE_FORMAT(NOW(), '%m') = 12 THEN 'Z'
						ELSE DATE_FORMAT(NOW(), '%m')
					END,
					DATE_FORMAT(NOW(), '%y'),
					LPAD( (RIGHT(lot_code, 3)+ 1), 3, '0' )
				)
			ELSE 
				CONCAT(
					DATE_FORMAT(NOW(), '%d'),
					CASE
						WHEN DATE_FORMAT(NOW(), '%m') = 10 THEN 'X'
						WHEN DATE_FORMAT(NOW(), '%m') = 11 THEN 'Y'
						WHEN DATE_FORMAT(NOW(), '%m') = 12 THEN 'Z'
						ELSE DATE_FORMAT(NOW(), '%m')
					END,
					DATE_FORMAT(NOW(), '%y'),
					'001'
				)
		END AS LOTNUM
FROM 
		material_lot_qty1
ORDER BY lot_seq LIMIT 1
`;

// 자재 입고 처리 하기 (LOT 부여)
const input_lot_material =
`
CALL material_lot_input(?, ?, ?, ?, ?, ?, ?, 1, @v_result)
`;
//CALL material_lot_input('19Z24004', 'PO241218004', '식용색소', 999000, 'W001', 1000, 'W002', 1, @v_result)
//CALL material_lot_input(?, ?, ?, ?, ?, ?, ?, ?, @v_result)



// 자재 발주서 (전체) 조회 하기 (이건 돌려쓰는거라 삭제금지!!)
const material_order_list =
`
SELECT 
		mob.body_num,
		mob.order_code,
		mat.material_name,
		cli.com_name,
		mob.ord_qty,
		moh.order_date,
		mob.limit_date,
		mob.unit_price,
		mob.total_price,
		emp.name,
		CASE WHEN mob.material_state = 'a1' THEN '발주등록'
				WHEN mob.material_state = 'a3' THEN '취소'
				WHEN mob.material_state = 'a4' THEN '입고완료'
		END AS material_state
FROM
	material_order_body mob
	JOIN	
		material_order_head moh
		ON	mob.order_code = moh.order_code
	JOIN
		material mat
		ON mob.material_code = mat.material_code
	JOIN
		client cli
		ON moh.client_num = cli.client_num
	JOIN
		employee emp
		ON moh.emp_num = emp.emp_num
`;

const material_cance =
`
UPDATE 
		material_order_body 
SET 
		material_state = 'a3' 
`;


const material_input_list =
`
SELECT 
		mi.input_num,	-- 입고번호
		mi.order_code,	-- 자재발주코드
		mat.material_name,	-- 자재명
		cli.com_name,		--	업체명
		mob.ord_qty,		--	주문수량
		(COALESCE(mlq.in_qty, 0) + COALESCE(mlq2.in_qty, 0)) AS in_qty,	-- 실제 입고수량
		COALESCE(mlq.in_qty, 0) AS pass_qty,	-- 합격 정상수량
		COALESCE(ware.warehouse_name, '-') AS pass_warehouse_name,			-- 합격 창고 이름
		COALESCE(mlq2.in_qty, 0) AS reject_qty,	-- 불합격 정상수량
		COALESCE(ware2.warehouse_name, '-') AS reject_warehouse_name,	-- 불합격 창고 이름
		mi.inset_lot_date,		-- 입고일자
		emp.name			-- 입고 담당자
FROM
		material_input mi
	LEFT JOIN
		material_lot_qty1 mlq
		ON mi.input_num = mlq.input_num
		AND mlq.material_nomal = 'b1'
	LEFT JOIN
		material_lot_qty1 mlq2
		ON mi.input_num = mlq2.input_num
		AND mlq2.material_nomal = 'b2'
	JOIN	
		material mat
		ON	mi.material_code = mat.material_code
	JOIN
		client cli
		ON	mi.client_num = cli.client_num
	JOIN
		material_order_body mob
		ON mi.order_code = mob.order_code
	LEFT JOIN
		warehouse ware
		ON mlq.warehouse_code = ware.warehouse_code
	LEFT JOIN
		warehouse ware2
		ON mlq2.warehouse_code = ware2.warehouse_code
	JOIN
		employee emp
		ON mi.emp_num = emp.emp_num
`;

const lot_qty_info =
`
SELECT
		mlq1.lot_code,
		COALESCE(mlq1.stok_qty, 0) AS pass_stok_qty,
		COALESCE(mlq2.stok_qty, 0) AS reject_stok_qty
FROM
		material_lot_qty1 mlq1
		left JOIN
			material_lot_qty1 mlq2
			ON mlq1.input_num = mlq2.input_num
			AND mlq2.material_nomal = 'b2'
WHERE
		mlq1.material_nomal = 'b1'	
AND
		mlq1.input_num = ?
`;

//로트 재고 조회 페이지에서 사용하는 전체조회 또는 선택조회 
const lot_qty_list =
`
WITH in_material AS (
	SELECT
			lot_code,
			sum(material_qty) AS material_qty
	FROM
			invalid_material
	GROUP BY 
			lot_code
)
SELECT
		mlq.lot_seq,
		mlq.lot_code,
		mat.material_name,
		COALESCE(cli.com_name, 'NO_CLIENT') AS com_name,
		mlq.in_qty,
		COALESCE(emp.name, 'NO_EMP')	AS name,
		mlq.stok_qty,
		COALESCE(im.material_qty, 0) AS hold_qty,
		mlq.out_qty,
		COALESCE(mi.inset_lot_date, '9999-12-31 23:59:59') AS inset_lot_date,
		mlq.limit_date,
		COALESCE(ware.warehouse_name, 'NO_WARE') AS warehouse_name,
		CASE 
			WHEN mlq.material_lot_state = 'c1' 
				THEN '정상'
			ELSE '폐기'
		END AS material_lot_state,
		CASE 
			WHEN mlq.material_nomal = 'b1' 
				THEN '정상'
			ELSE '불량'
		END AS material_nomal
FROM
		material_lot_qty1 mlq
		JOIN
			material mat
			ON
				mlq.material_code = mat.material_code
		left JOIN
			material_input mi
			ON
				mlq.input_num = mi.input_num
		left JOIN
			client cli
			ON
				mi.client_num = cli.client_num
		left JOIN
			employee emp
			ON
				mi.emp_num = emp.emp_num
		LEFT JOIN
			warehouse ware
			ON
				mlq.warehouse_code = ware.warehouse_code
		LEFT JOIN
			in_material im
			ON
				mlq.lot_code = im.lot_code
			AND
				mlq.material_nomal = 'b1'
			AND
				mlq.material_lot_state = 'c1'
`;

//자재 발주서 바디에 자재발주코드 기반으로 자재리스트 전부 가져오기
const material_order_body_list =
`
SELECT
		mob.material_code,
		mat.material_name,
		mob.ord_qty,
		mob.unit_price,
		mob.total_price
FROM
		material_order_body mob
		JOIN
			material mat
			ON
				mob.material_code = mat.material_code
WHERE
		mob.order_code = ?
`;

module.exports = {
   material_order_head,
   need_order_material,
   full_client,
   full_client_info,
   input_order,
   input_order2,
   material_input_qc_list,
   warehouse_list,
   material_lot_num,
   input_lot_material,
   material_order_list,
	material_cance,
	material_input_list,
	lot_qty_info,
	lot_qty_list,
	material_order_body_list,

};