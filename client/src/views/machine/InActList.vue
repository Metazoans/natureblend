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
          
          <!-- 설비 분류 -->
          <div class="mb-3">
            <label class="col-sm-2 col-form-label fw-bold">설비 분류</label>
            <div>
              <label v-for="type in machineType" :key="type" class="me-3">
                {{ type }}
                <input
                  type="checkbox"
                  :value="type"
                  v-model="pickedType"
                />
              </label>
            </div>
          </div>

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
          @grid-ready="inActOnReady"
          style="height: 300px;"
          :pagination="true"
          :paginationPageSize="5"
          :quickFilterText="inActSearchData"
        ></ag-grid-vue>
      </div>

    </div>
  </div>
</template>

<script>
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
        inActRow.value[i].inact_start_time = dateFormat(inActRow.value[i].inact_start_time, 'yyyy-MM-dd');
        if(inActRow.value[i].inact_end_time != null){
          inActRow.value[i].inact_end_time = dateFormat(inActRow.value[i].inact_end_time, 'yyyy-MM-dd');
        }
      }
    };

    const onReady = (params) => {
      params.api.sizeColumnsToFit();
    };

    return {
      machineRow,
      machineCol,
      inActRow,
      inActCol,
      getInActMachines,
      getInActList,
      dateFormat,
      onReady,
    }
  },

  // options
  components: {
  },
  
  data() {
    return {
      isShowModal: false,
      theme: theme,

      // 검색 데이터
      inActSearchData: "",
      
      machineType: ["세척기기", "음료제작기기", "포장기기"], // 설비 분류 옵션
      pickedType: [], // 설비 분류 선택
      startDate: "", //주문날짜 시작 날짜
      endDate: "", //주문날짜 끝 날짜

      filters: [],
    };
  },
  beforeMount() {
    this.getInActMachines();
    this.getInActList();
  },
  methods: {
    // 설비 현황 셀 클릭 : stop인 경우 작동상태로 변경, 이외는 상세 페이지로 이동
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

    // 비가동 내역 필드
    updateFilter() {
      console.log('필터 변경');
      const typeMap = {
        "세척기기" : "p1",
        "음료제작기기" : "p2",
        "포장기기" : "p3"
      }
      const dbType = this.pickedType.map(type => typeMap[type]);
      this.filters = {
        pickedType : dbType,
      }
      if(this.startDate != '') this.filters.startDate = this.dateFormat(this.startDate, 'yyyy-MM-dd') + ' 00:00:00';
      if(this.endDate != '') this.filters.endDate = this.dateFormat(this.endDate, 'yyyy-MM-dd') + ' 23:59:59';
      console.log(this.filters);
      this.searchInActs();
    },
    // 검색 동작
    async searchInActs() {
      console.log('검색 동작')
      let obj = {
        process_code : this.filters.pickedType,
        startDate : this.filters.startDate,
        endDate : this.filters.endDate
      }

      let result = await axios.put(`${ajaxUrl}/inActs/search`, obj)
                              .catch(err => console.log(err));
      this.inActRow = result.data;

      for(let idx in this.inActRow) {
        this.inActRow[idx].inact_start_time = this.dateFormat(this.inActRow[idx].inact_start_time, 'yyyy-MM-dd');
        this.inActRow[idx].inact_end_time = this.dateFormat(this.inActRow[idx].inact_end_time, 'yyyy-MM-dd');
      }
      console.log(this.inActRow);
      // this.inActRow.value.inact_start_time = this.dateFormat(this.inActRow.value.inact_start_time, 'yyyy-MM-dd');
      // this.inActRow.value.inact_end_time = this.dateFormat(this.inActRow.value.inact_end_time, 'yyyy-MM-dd');
    },

    // 비가동 ag-grid onReady
    inActOnReady(event) {
      this.gridApi = event.api;
      event.api.sizeColumnsToFit();

      // 그리드 안에 검색창 추가
      const allPanels = document.querySelectorAll('.ag-paging-panel');
      const paginationPanel2 = allPanels[1];

      if (paginationPanel2) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '5px'; // 버튼과 입력 필드 간격

        // 입력 필드 생성
        const inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.placeholder = '전체 검색';
        inputText.style.padding = '5px';
        inputText.style.width = '150px';
        inputText.style.border = '1px solid #ccc';
        inputText.style.borderRadius = '4px';

        // 텍스트만 계속 가져다 바치면 ag그리드가 알아서 해줌
        inputText.addEventListener('input', (event) => {
              const value = event.target.value;
              //console.log('입력된 값:', value);
              // 검색 로직 추가 가능
              this.inActSearchData = value;
        });

        // 페이징 영역에 컨테이너 삽입
        container.appendChild(inputText);
        paginationPanel2.insertBefore(container, paginationPanel2.firstChild);
      }
    },

    // 오늘 날짜 가져오기
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
  },
  watch: {
    pickedType: {
      handler() {
        this.updateFilter();
      },
      deep: true
    },
    startDate: {
      handler(newVal) {
        if(newVal != null) {
          this.updateFilter();
        }
      },
      deep: true
    },
    endDate: {
      handler(newVal) {
        if(newVal != null) {
          this.updateFilter();
        }
      },
      deep: true
    },
  }
  
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
