<template>
  <div class="container-fluid py-4">
    <h3>설비 조회</h3>
    <!-- 설비 검색 -->
    <div class="main-container">
      <div class="content">

        <div class="row justify-content-end mb-3">
          <!-- 작동 상태 -->
          <div class="col mb-3">
            <label class="col-sm-2 col-form-label fw-bold">작동 상태</label>
            <div class="col-sm-6">
              <label v-for="status in statusList" :key="status" class="me-3">
                {{ status }}
                <input
                  type="radio"
                  name="status"
                  :value="status"
                  v-model="pickedStatus"
                />
              </label>
            </div>
          </div>
  
          <!-- 설비 분류 -->
          <div class="col mb-3">
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
        </div>
        
        <div class="row">
          <label class="col-1 col-form-label fw-bold">이름 검색</label>
          <!-- 검색 옵션 -->
          <div class="col-2 mb-3">
            <select v-model="selectSearchType" class="form-select">
              <option v-for="option in searchType" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
    
          <!-- 검색 텍스트 -->
          <div class="col-5 mb-3">
            <input
              type="text"
              v-model="searchData"
              placeholder="검색 내용을 입력하세요"
              class="form-control"
            />
          </div>

          
          <!-- 검색 및 초기화 버튼 -->
          <div class="col-1 mb-3 text-end">
            <button
              class="btn-sm btn-success mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="updateFilter"
            >
              검색
            </button>
          </div>
          <div class="col-1 mb-3 text-end">
            <button
              class="btn-sm btn-warning mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="resetSearch"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

    </div>
    

    <!-- 설비 리스트 -->
    <div class="grid-container" >
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="theme"
       	@grid-ready="onReady"
        style="height: 450px;"
        :pagination="true"
        :paginationPageSize="8"
        @cellClicked="cellClickFnc"
      ></ag-grid-vue>
    </div>
    
    <material-button
      class="btn-sucess"
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
import userDateUtils from "@/utils/useDates.js";
import {shallowRef} from 'vue';

export default {
  name: "machineList",
  setup() {
    const machineList = shallowRef([]);
    const rowData = shallowRef([]);
    const columnDefs = shallowRef([

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

      // 검색 데이터
      statusList: ["전체", "작동중", "작동정지"], // 작동 상태 옵션
      pickedStatus: "", // 작동상태 선택
      machineType: ["세척기기", "음료제작기기", "포장기기"], // 설비 분류 옵션
      pickedType: [], // 설비 분류 선택
      searchType: ["전체", "공정명", "설비이름"], // 검색 옵션
      selectSearchType: "", // 선택된 검색 옵션
      searchData: "", // 검색 내용

      filters: [],

    };
  },
  beforeMount() {
    this.getMachineList();
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

    // 비가동 등록 모달 열기
    inActAddOpen() {
      this.isShowInActAdd = !this.isShowInActAdd;
    },
    // 비가동 등록 성공 체크
    confirmInActAdd(check) {
      this.closeInActAdd();
      if(check == true){
        this.getMachineList();
      }
    },
    // 비가동 등록 모달 닫기
    closeInActAdd() {
      this.isShowInActAdd = false;
    },

    // 셀 클릭 : 작동상태 클릭시 비가동 모달, 이외의 경우 설비 상세 페이지로 이동
    cellClickFnc(col) {
      switch(col.value) {
        case 'run': // run -> stop
          this.machineNo = col.data.machine_num;
          this.inActAddOpen();
          break;
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
        this.getMachineList();
        console.log('설비 작동 시작');
      } else {
        console.log('설비 작동 실패');
      }
    },

    // 검색 파트 동작
    resetSearch() {
      this.pickedStatus = "";
      this.pickedType = [];
      this.selectSearchType = "";
      this.searchData = "";
      this.filters = [];
      this.getMachineList();
    },
    updateFilter() {
      const typeMap = {
        "세척기기" : "p1",
        "음료제작기기" : "p2",
        "포장기기" : "p3",
      }
      const dbType = this.pickedType.map(type => typeMap[type]);
      this.filters = {
        pickedStatus : this.pickedStatus,
        pickedType : dbType,
        selectSearchType : this.selectSearchType,
        searchData : this.searchData,
      }
      switch(this.filters.pickedStatus) {
        case "전체":
          this.filters.pickedStatus = "";
          break;
        case "작동중":
          this.filters.pickedStatus = "run";
          break;
        case "작동정지":
          this.filters.pickedStatus = "stop";
          break;
      }
      switch(this.filters.selectSearchType) {
        case "전체":
          this.filters.selectSearchType = "all";
          break;
        case "공정명":
          this.filters.selectSearchType = "process_name";
          break;
        case "설비이름":
          this.filters.selectSearchType = "machine_name";
          break;
      }
      this.searchMachines();
    },

    // 검색 동작
    async searchMachines() {
      let obj = {
        machine_state : this.filters.pickedStatus,
        process_code : this.filters.pickedType,
        selectSearchType : this.filters.selectSearchType,
        searchData : this.filters.searchData
      }

      let result = await axios.put(`${ajaxUrl}/machine/search`, obj)
                              .catch(err => console.log(err));
      this.machineList = result.data;
      console.log(this.machineList);
      this.rowData = result.data;
    },

    // 날짜 관련
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    }
  },
};
</script>

<style scoped lang="scss">
.container-fluid {
  min-height: 500px;
  .search {
    margin-top: 24px;
  }
}

</style>
