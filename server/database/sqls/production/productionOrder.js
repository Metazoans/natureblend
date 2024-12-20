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
        pp.plan_end_date;
`

const processFlow = `
    select process_sequence, process_name
    from process_chart
    where product_code = ?
    order by process_sequence;
`

module.exports = {
    waitingPlanList,
    processFlow
}