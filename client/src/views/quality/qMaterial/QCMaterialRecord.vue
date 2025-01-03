<template>
  <div class="px-4 py-4">
    <h1 class="mb-3">입고검사-검사기록조회</h1>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h3 class="me-3">검색조건</h3>
        <!-- <material-button class="btn-search ms-auto" size="sm" v-on:click="searchRequestAll">전체 조회</material-button> -->
      </div>

      <div class="row gx-3 p-4 rounded border shadow search-background">
        <!-- 검사 상태 -->
        <div class="col-md-2 ps-5">
          <label for="qcStat" class="form-label">검사 상태</label>
          <select class="form-select text-center border cursor-pointer" v-model="searchInfo.qcState"
            aria-label="검사 상태 선택">
            <option value="qcs1">전체</option>
            <option value="qcs2">검사완료</option>
            <option value="qcs3">검사미완료</option>
          </select>
        </div>

        <!-- 날짜 범위 -->
        <div class="col-md-2">
          <label for="startDate" class="form-label">검사일(부터)</label>
          <div class="d-flex gap-2">
            <input type="date" id="startDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.startDate" />
          </div>
        </div>
        <div class="col-md-2">
          <label for="endDate" class="form-label">검사일(까지)</label>
          <div class="d-flex gap-2">
            <input type="date" id="endDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.endDate" />
          </div>
        </div>

        <!-- 자재명 -->
        <div class="col-md-2">
          <label for="mName" class="form-label">자재명</label>
          <input type="search" id="mName" class="form-control border p-2 cursor-pointer" placeholder="자재명"
            v-model="searchInfo.mName" />
        </div>

        <!-- 검색 버튼 -->
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" class="w-100" v-on:click="searchOrder">검색</material-button>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" class="w-50" color="info" v-on:click="searchRequestAll">전체 조회</material-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 검사조건 부분 끝 -->

  <hr>
  <!-- 검사결과 시작 -->
  <div class="container-fluid py-4">
    <h4>입고상세정보</h4>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" :pagination="true" :paginationPageSize="20" style="height: 700px;"
        :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>
  </div>
  <!-- 검사결과 끝 -->

  <hr>
  <div style="display: none">
       <CustomNoRowsOverlay/>
  </div>

</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";


export default {
  name: "입고검사",
  components: { MaterialButton, CustomNoRowsOverlay},
  data() {
    return {
      searchInfo: {
        mName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd'),
        qcState: 'qcs1',
      },

      searchList: [],

      //ag grid 관련
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "입고검사번호", field: "qcMaterialId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "자재발주코드", field: "orderCode", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.1 },
        { headerName: "자재명", field: "mName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1.2 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "총 수량(g, 개)", field: "totalQnt", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "합격량(g, 개)", field: "passQnt", resizable: false, cellStyle: { textAlign: "right" }, flex: 1.1 },
        { headerName: "불합격량(g, 개)", field: "rjcQnt", resizable: false, cellStyle: { textAlign: "right" }, flex: 1.1 },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "right" }, flex: 1.8 },
        { headerName: "검사완료시각", field: "inspecEnd", resizable: false, cellStyle: { textAlign: "right" }, flex: 1.8 },
        { headerName: "검사상태", field: "inspecStatus", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },


    }

  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      //this.gridApi.sizeColumnsToFit();

    },
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },


    //검색창 관련    
    //검색결과 정리
    processSearchResults(searchList) {
      const processedData = [];
      for (let item of searchList) {
        processedData.push({
          "qcMaterialId": item.qc_material_id, 
          "orderCode": item.order_code,
          "mName": item.material_name, 
          "eName": item.name, 
          "totalQnt": item.total_qnt,
          "passQnt": item.pass_qnt, 
          "rjcQnt": item.rjc_qnt,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'), 
          "inspecEnd": item.inspec_end === "" 
          ? "" : this.dateFormat(item.inspec_end, 'yyyy-MM-dd hh:mm:ss'),
          "inspecStatus": item.inspec_status
        });
      }
      return processedData;
    },
    async searchOrder() {
      if (new Date(this.searchInfo.startDate) > new Date(this.searchInfo.endDate)) {
        `${notify({
            title: "검색실패",
            text: "시작 날짜는 종료 날짜보다 이전이어야 합니다.",
            type: "error", // success, warn, error 가능
        })}`;
        return;
      }

      const name = this.searchInfo.mName.replace(/\s+/g, "");
      // console.log(this.searchInfo.qcState);
      const result = {
        mName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate,
        qcState : this.searchInfo.qcState,
      };
      let searchResult = await axios.post(`${ajaxUrl}/recordQCM`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // console.log(this.searchList);

      // ag grid에 결과값 넣기
      this.rowData1 = []
      this.rowData1 = this.processSearchResults(this.searchList);
    },
    //전체 조회
    async searchRequestAll() {
      let searchResult = await axios.get(`${ajaxUrl}/recordQCMAll`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      this.rowData1 = this.processSearchResults(this.searchList);
    },
  },
  created() {
    this.searchRequestAll();
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

//검색창 라벨
.mb-4{
  label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }
}
//검색창 배경색
.search-background{
  background-color: #e9ecefff; /* 원하는 배경색 */


  input {
    background-color: #ffffff; /* input 요소의 배경을 투명으로 설정 */
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
}
</style>
