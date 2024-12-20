<template>
  <div class="container-fluid py-4">
    <!-- 검색창 -->
    <input type="text" placeholder="전체 검색">
    
    <div class="grid-container" >
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="theme"
       	@grid-ready="onReady"
        style="height: 800px;"
        :pagination="true"
        :paginationPageSize="8"
        @cellClicked="cellClickFnc"
        :gridOptions="gridOptions"
      ></ag-grid-vue>
    </div>

    <material-button
      color="warning"
      @click="machineAddOpen"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      설비 등록
    </material-button>

    <MachineManage
      :isShowModal="isShowMachineAdd"
      :isUpdate="false"
      @closeModal="closeMachineAdd"
      @confirm="confirmMachineAdd"
    />
    <InActAdd :isShowModal="isShowInActAdd" :machineNo="machineNo" @closeModal="closeInActAdd" @confirm="confirmInActAdd"/>
    
  </div>
</template>

<script>
import MachineManage from "./MachineManage.vue";
import InActAdd from "./InActAdd.vue";
import MaterialButton from "@/components/MaterialButton.vue";

import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';

import theme from "@/utils/agGridTheme";

import {shallowRef} from 'vue';

export default {
  name: "machineList",
  setup() {
    const machineList = shallowRef([]);
    const rowData = shallowRef([]);
    const columnDefs = shallowRef([
      /*
      번호, 공정코드, 공정명, 모델번호, 설비분류, 설비 이름, 설비 위치, 작동상태
      field: 'country',
        valueFormatter: countryValueFormatter,
        filter: 'agSetColumnFilter',
        filterParams: {
            valueFormatter: countryValueFormatter,
        },
      */
      { headerName: '번호', field: 'machine_num' },
      { headerName: '공정코드', field: 'process_code' },
      { headerName: '공정명', field: 'process_name' },
      { headerName: '모델번호', field: 'model_num' },
      { headerName: '설비분류', field: 'machine_type' },
      { headerName: '설비이름', field: 'machine_name' },
      { headerName: '설비위치', field: 'machine_location' },
      { headerName: '작동상태', field: 'machine_state' },
    ]);

    const getMachineList = async () => {
      let result = await axios.get(`${ajaxUrl}/machine/machineList`)
                              .catch(err => console.log(err));
      machineList.value = result.data;
      rowData.value = result.data;
      
    }

    const onReady = (params) => {
      params.api.sizeColumnsToFit();
    }  

    return {
      machineList,
      rowData,
      columnDefs,
      getMachineList,
      onReady,
    }
  },
  components: {
    MachineManage,
    InActAdd,
    MaterialButton,
  },
  
  data() {
    return {
      isShowMachineAdd: false,
      isShowInActAdd: false,
      theme: theme,
      inActClick: false,
      machineNo: 0,

    };
  },
  beforeMount() {
    this.getMachineList();
    this.GridOptions = {
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        animateRows: false
    }
  },
  methods: {
    // 설비 등록 모달 열기
    machineAddOpen() {
      this.isShowMachineAdd = !this.isShowMachineAdd;
      this.getMachineList();
    },
    // 설비 등록 성공시 설비 리스트 데이터 갱신
    confirmMachineAdd(check) {
      this.closeMachineAdd();
      if(check == true){
        this.getMachineList();
      }
    },
    // 설비 등록 모달 닫기
    closeMachineAdd() {
      this.isShowMachineAdd = false;
    },

    // 비동기 등록 모달 열기
    inActAddOpen() {
      this.isShowInActAdd = !this.isShowInActAdd;
    },
    // 비동기 등록 성공 체크
    confirmInActAdd(check) {
      this.closeInActAdd();
      if(check == true){
        this.getMachineList();
      }
    },
    // 비동기 등록 모달 닫기
    closeInActAdd() {
      this.isShowInActAdd = false;
    },

    // 셀 클릭 : 작동상태 클릭시 비동기 모달, 이외의 경우 설비 상세 페이지로 이동
    cellClickFnc(col) {
      if(col.value == 'run') { // 작동중
        this.machineNo = col.data.machine_num;
        this.inActAddOpen();
        console.log('stop으로 업데이트');
      } else if(col.value == 'stop') { // 작동정지
        console.log('run으로 업데이트');
      } else { // 다른 셀 클릭
        this.$router.push({name: 'machineInfo', params : {mno : col.data.machine_num}});
      }
    },

  }
};
</script>

<style scoped lang="scss">
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
