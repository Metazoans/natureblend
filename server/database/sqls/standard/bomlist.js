const bomList = 
`SELECT bm.bom_seq,
        bm.bom_num,
        bm.material_code,
        bm.material,
        bm.material_con,
        b.product_code,
        b.product_name,
        b.capacity
 FROM bom_material bm join bom b
 on bm.bom_num = b.bom_num
 ORDER BY bm.bom_seq;`;


 module.exports = {
    bomList,
}