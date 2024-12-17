<template>
   <div>
      <h1>자재 입고</h1>
   </div>
   <div class="grid-container">
     <ag-grid-vue
       :rowData="rowData"
       :columnDefs="columnDefs"
       :theme="theme"
       @grid-ready="onReady"
       style="height: 700px;"
      >
   </ag-grid-vue>
 
   </div>
 </template>
<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

 import theme from "@/utils/agGridTheme";
 import { ref, onBeforeMount } from 'vue';

 //import { ref, shallowRef, computed, onBeforeMount } from 'vue';
 //import { useRouter } from 'vue-router';

 const rowData = ref([]);
 // {all_ckeck: false,body_num: 1,order_code: "A1001", material_name: "철근", com_name: "철강사", ord_qty: 100, total_qnt: 90, pass_qnt: 85, rjc_qnt: 5, unit_price: 1000, total_price: 90000, inspec_end: "2024-06-12", 비고: "" }

 const columnDefs = ref([
        { 
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "",
        },
        { headerName: "No.", field: "body_num" },
        { headerName: "자재발주코드", field: "order_code" },
        { headerName: "자재명", field: "material_name" },
        { headerName: "업체명", field: "com_name" },
        { headerName: "발주수량", field: "ord_qty" },
        { headerName: "입고수량", field: "total_qnt" },
        { headerName: "정상수량", field: "pass_qnt" },
        { headerName: "불량수량", field: "rjc_qnt" },
        { headerName: "단가", field: "unit_price", },
        { headerName: "총액", field: "total_price" },
        { headerName: "검사완료일", field: "inspec_end" },
        {  
          headerName: "비고", 
          field: "비고", 
          editable: false,
          cellRenderer: params => {
            const button = document.createElement('button');
            button.innerText = '시험성적서';
            button.addEventListener('click', () => {
              alert(`버튼 클릭: ${JSON.stringify(params.data)}`);
            });
            return button;
          }
        }
      ]);


const matrialQcInput = async function(){
  let result = await axios.get(`${ajaxUrl}/material/miql`)
                      .catch(err=>console.log(err));
  //console.log(result.data);  //여기서 바뀌는값을 집어넣는거임
  rowData.value = result.data;
  console.log(rowData.value[0]['inspec_end']);
  rowData.value = result.data.map(col => ({
    ...col,
    inspec_end: col.inspec_end ? col.inspec_end.split('T')[0] : null,
    ord_qty: (col.ord_qty * 0.001) + " kg",
    total_qnt: (col.total_qnt * 0.001) + " kg",
    pass_qnt: (col.pass_qnt * 0.001) + " kg",
    rjc_qnt: (col.rjc_qnt * 0.001) + " kg",
    unit_price: Number(col.unit_price).toLocaleString() + " 원",
    total_price: Number(col.total_price*0.001).toLocaleString() + " 원",
  }));
  console.log(rowData.value);
  //이부분 물엉봐야지 
  userDateUtils.dateFormat(rowData.value[0]['inspec_end'], "yyyy-MM-dd");
}

const onReady = (param) => {
  param.api.sizeColumnsToFit();
}

onBeforeMount(()=>{
  matrialQcInput();
})

 </script>