const bomList = 
`SELECT bom_seq,
        bom_num,
        material_code,
        material,
        material_con,
        product_code,
        product_name,
        capacity
 FROM bom_material bm join bom b
 on bm.bom_num = b.bom_num;`;


 module.exports = {
    bomList,
}