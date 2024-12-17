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
ORDER BY com_name`;

//검색 조회
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

const orderListInsert = 
`INSERT INTO orderlists
SET ?
WHERE orderlist_num =?`;

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
    orderListInsert,
    orderListUpdate,
    orderListDelete

}