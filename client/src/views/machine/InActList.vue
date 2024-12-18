<template>
  <div class="container-fluid py-4">
    <h3>비가동 설비 현황</h3>
    <div class="grid-container" >
      <ag-grid-vue
        :rowData="machineRow"
        :columnDefs="machineCol"
        :theme="theme"
       	@grid-ready="onReady"
        style="height: 300px;"
      ></ag-grid-vue>
    </div>

    <h3>비가동 설비 내역</h3>
    <div class="grid-container" >
      <ag-grid-vue
        :rowData="inActRow"
        :columnDefs="inActCol"
        :theme="theme"
       	@grid-ready="onReady"
        style="height: 300px;"
        :pagination="true"
        :paginationPageSize="5"
      ></ag-grid-vue>
    </div>


    <!-- 임시 버튼 -->
    <material-button
      color="warning"
      @click="openModal"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      임시 비가동 등록
    </material-button>

    <InActAdd :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm"></InActAdd>

  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import InActAdd from "./InActAdd.vue";

import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import {shallowRef} from 'vue';

import theme from "@/utils/agGridTheme";
import userDateUtils from "@/utils/useDates.js";

export default {
  name: "inActList",
  setup() {
    // 비가동 설비 정보
    const machineRow = shallowRef([]);
    const machineCol = shallowRef([
      { headerName: '번호', field: 'machine_num' },
      { headerName: '공정코드', field: 'process_code' },
      { headerName: '공정명', field: 'process_name' },
      { headerName: '모델번호', field: 'model_num' },
      { headerName: '설비분류', field: 'machine_type' },
      { headerName: '설비이름', field: 'machine_name' },
      { headerName: '설비위치', field: 'machine_location' },
      { headerName: '작동상태', field: 'machine_state' },
    ]);

    // 비가동 내역 정보
    const inActRow = shallowRef([]);
    const inActCol = shallowRef([
      { headerName: '번호', field: 'inact_num' },
      { headerName: '모델번호', field: 'model_num' },
      { headerName: '설비분류', field: 'machine_type' },
      { headerName: '설비이름', field: 'machine_name' },
      { headerName: '사유', field: 'inact_type' },
      { headerName: '시작일시', field: 'inact_start_time' },
      { headerName: '종료일시', field: 'inact_end_time' },
    ]);

    const onReady = (params) => {
      params.api.sizeColumnsToFit();
    };
    const dateFormat = (value, format) => {
      return userDateUtils.dateFormat(value, format);
    };

    // 설비 리스트 가져오기
    const getInActMachines = async () => {
      let result = await axios.get(`${ajaxUrl}/inActs/inActMachines`)
                              .catch(err => console.log(err));
      machineRow.value = result.data;
    }
    // 비가동 리스트 가져오기
    const getInActList = async () => {
      let result = await axios.get(`${ajaxUrl}/inActs/inActList`)
                              .catch(err => console.log(err));
      inActRow.value = result.data;
      for(let i in inActRow.value){
        inActRow.value[i].inact_start_time = dateFormat(inActRow.value[i].inact_start_time, 'yyyy-MM-dd');
        if(inActRow.value[i].inact_end_time != null){
          inActRow.value[i].inact_end_time = dateFormat(inActRow.value[i].inact_end_time, 'yyyy-MM-dd');
        }
      }
    }

    // const getMachineList = async () => {
    //   let result = await axios.get(`${ajaxUrl}/machine/machineList`)
    //                           .catch(err => console.log(err));
    //   machineList.value = result.data;
    //   rowData.value = result.data;
      
    // }


    return {
      machineRow,
      machineCol,
      inActRow,
      inActCol,
      onReady,
      getInActMachines,
      getInActList,
      dateFormat,
    }
  },

  // options
  components: {
    MaterialButton,
    InActAdd,
  },
  
  data() {
    return {
      isShowModal: false,
      theme: theme,
    };
  },
  beforeMount() {
    this.getInActMachines();
    this.getInActList();
  },
  methods: {
    openModal() {
      this.isShowModal = !this.isShowModal;
    },

    confirm() {
      this.closeModal();
    },

    closeModal() {
      this.isShowModal = false;
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}

.container-fluid {
  min-height: 500px;
  .search {
    margin-top: 24px;
  }
}
</style>
