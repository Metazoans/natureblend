<template>

  <div>

    <h2>정비 완료 내역</h2>
    <div class="grid-container" >
      <ag-grid-vue
        :rowData="requestRow"
        :columnDefs="requestCol"
        :theme="theme"
        @grid-ready="onReady"
        style="height: 500px;"
        :pagination="true"
        :paginationPageSize="5"
      ></ag-grid-vue>
    </div>

  </div>

</template>


<script setup>
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import theme from "@/utils/agGridTheme";
// import userDateUtils from "@/utils/useDates.js";
import {shallowRef, onBeforeMount} from 'vue';


const requestRow = shallowRef([]);
const requestCol = shallowRef([
  { headerName: '번호', field: 'maintenance_num' },
  { headerName: '설비번호', field: 'machine_num' },
  { headerName: '설비분류', field: 'machine_type' },
  { headerName: '설비이름', field: 'machine_name' },
  { headerName: '정비내용', field: 'maintenance_detail' },
  { headerName: '작업자', field: 'work_emp' },
  { headerName: '완료일자', field: 'end_date' },
]);


// 정비 요청 내역 데이터
const getRequests = async () => {
  let result = await axios.get(`${ajaxUrl}/maintenances/completeList`)
                          .catch(err => console.log(err));

  let newary = [];
  for(let data of result.data) {
    if(data.maintenance_state == 'done') {
      newary.push(data);
    }
  }
  requestRow.value = newary;
  console.log(requestRow.value);
}

const onReady = (param) => {
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
}



// 마운트전
onBeforeMount(()=>{
  getRequests();
});
</script>


<style scoped>

</style>
