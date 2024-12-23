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
        @cellClicked="cellClickFnc"
      ></ag-grid-vue>
    </div>

    <div class="inActListDiv">
      <div class="inActHeader">
          <h3>비가동 설비 내역</h3>
          <!-- 검색 옵션 -->
          <select v-model="selectSearchType" class="form-select searchSelect">
            <option v-for="option in searchType" :key="option" :value="option">
              {{ option }}
            </option>
          </select>

          <!-- 검색 텍스트 -->
          <input
            type="text"
            v-model="searchData"
            placeholder="검색 내용을 입력하세요"
            class="form-control searchText"
          />

          <!-- 검색 및 초기화 버튼 -->
          <material-button
            size="sm"
            color="warning"
            @click="updateFilter"
          >
            검색
          </material-button>

          <!-- 날짜 선택 -->
          <div class="searchDate">
            <input 
            type="date" 
            id="startDate" class="form-control border p-2"
            v-model="startDate"/>
          </div>
          <div class="text-center">~</div>
          <div class="searchDate">
            <input 
            type="date" 
            id="endDate" class="form-control border p-2"
            v-model="endDate" />
          </div>
      </div>

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

    </div>
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";

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
    };
    // 비가동 리스트 가져오기
    const getInActList = async () => {
      let result = await axios.get(`${ajaxUrl}/inActs/inActList`)
                              .catch(err => console.log(err));
      inActRow.value = result.data;
      for(let i in inActRow.value){
        inActRow.value[i].inact_start_time = dateFormat(inActRow.value[i].inact_start_time, 'yyyy-MM-dd hh:mm:ss');
        if(inActRow.value[i].inact_end_time != null){
          inActRow.value[i].inact_end_time = dateFormat(inActRow.value[i].inact_end_time, 'yyyy-MM-dd hh:mm:ss');
        }
      }
    };

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
    // 셀 클릭 : 작동상태 클릭시 비가동 모달, 이외의 경우 설비 상세 페이지로 이동
    cellClickFnc(col) {
      switch(col.value) {
        case 'stop': // stop -> run
          this.reStart(col.data.machine_num);
          break;
        default: // 설비 상세
          this.$router.push({name: 'machineInfo', params : {mno : col.data.machine_num}});
      }
    },

    // 최근 비가동 수정
    async reStart(machineNo) {
      let obj = {
        inact_end_time: this.getToday(),
        inact_end_emp: 99,
      }

      let result = await axios.put(`${ajaxUrl}/inActs/lastInAct/${machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      if(updateRes.result) {
        console.log('비가동 내역 수정');
        this.runMachine(machineNo);
      } else {
        console.log('비가동 내역 수정 실패');
      }
    },
    // 설비 업데이트
    async runMachine(machineNo) {
      let obj = {
        machine_state: 'run',
      }
      
      let result = await axios.put(`${ajaxUrl}/machine/machineUpdate/${machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      if(updateRes.result) {
        this.getInActMachines();
        this.getInActList();
        console.log('설비 작동 시작');
      } else {
        console.log('설비 작동 실패');
      }
    },
    
    // 날짜 관련
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
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

.inActListDiv .inActHeader {
  display: flex;
  justify-content: center;
}
.inActHeader > * {
  margin: 0 10px;
}
.inActHeader > :first-child {
  width: 22%;
}
.inActHeader .searchSelect {
  width: 7%;
}
.inActHeader .searchText {
  width: 15%;
}
button {
  width: 7%;
  margin-right: 4% !important;
}
.searchDate {
  width: 15%;
}
</style>
