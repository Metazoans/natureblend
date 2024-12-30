<!-- 모달 샘플 -->
<template>
  <div>
      <h3>&nbsp;&nbsp;자재 발주 관리</h3>
  </div>
  <div>
    <span>검사대기항목</span>
    <div class="table-responsive p-0"></div>
    <table class="table align-items-center mb-0">
      <thead>
      <tr>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
          자재명
          </th>
          <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
          수량
          </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="cl in orderOk" :key="cl.body_num">
          <td>
            <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
                <h6 class="mb-0 text-sm">{{ cl.material_name }}</h6>
            </div>
            </div>
        </td>
        <td>
            <div class="d-flex px-2 py-1">
            <div class="d-flex flex-column justify-content-center">
                <h6 class="mb-0 text-sm">{{ cl.ord_qty }}</h6>
            </div>
            </div>
        </td>
      </tr>
      </tbody>
  </table>
  </div>
</template>


<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

import { ref, onBeforeMount } from 'vue'; //onBeforeMount

import userDateUtils from '@/utils/useDates.js';


//검수대기항목들
const orderOk = ref([]);
const matrialOrderList2 = async function(){
  const seachcondition = {
    materialCode: '',
    clientName: '',
    POListCode: '',
    startDate: '',
    endDate: '',
    materialState: ['a1'],
  };
  let result = await axios.put(`${ajaxUrl}/material/polistorder2`, seachcondition)
                          .catch(err=>console.log(err));
  //console.log(result.data);
  orderOk.value = result.data.map((col) => ({
      ...col,
      ord_qty: col.material_name.includes('병') ? Number(col.ord_qty).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
      order_date: userDateUtils.dateFormat(col.order_date, "yyyy-MM-dd"),
      limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
      unit_price: col.material_name.includes('병') ? Number(col.unit_price).toLocaleString() + " 원" : Number(col.unit_price*0.001).toLocaleString() + " 원",
      total_price: col.material_name.includes('병') ? Number(col.total_price).toLocaleString() + " 원" : Number(col.total_price*0.001).toLocaleString() + " 원"
    })
  );
  console.log('검수대기항목',orderOk.value);
}

// 화면 생성되는 시점
onBeforeMount(()=>{
  matrialOrderList2();   //전체조회 쿼리 실행
});

</script>

<style scoped>
</style>