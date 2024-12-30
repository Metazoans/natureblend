<template>
  <div class="px-4 py-4">
    <h1 class="mb-3">포장검사-검사기록조회</h1>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h3 class="me-3">검색조건</h3>
        <material-button class="btn-search ms-auto" size="sm" v-on:click="searchRequestAll">전체 조회</material-button>
      </div>

      <div class="row g-3">
        <!-- 재고 상태 -->
        <div class="col-md-2">
          <label for="qcStat" class="form-label">재고 상태</label>
          <select class="form-select text-center border cursor-pointer" v-model="searchInfo.qcState"
            aria-label="재고 상태 선택">
            <option value="qcs1">전체</option>
            <option value="qcs2">검사완료</option>
            <option value="qcs3">검사미완료</option>
          </select>
        </div>

        <!-- 날짜 범위 -->
        <div class="col-md-4">
          <label for="startDate" class="form-label">날짜 범위(검사시작일)</label>
          <div class="d-flex gap-2">
            <input type="date" id="startDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.startDate" />
            <input type="date" id="endDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.endDate" />
          </div>
        </div>

        <!-- 제품명 -->
        <div class="col-md-3">
          <label for="pName" class="form-label">제품명</label>
          <input type="search" id="pName" class="form-control border p-2 cursor-pointer" placeholder="제품명"
            v-model="searchInfo.pName" />
        </div>

        <!-- 검색 버튼 -->
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" class="w-100" v-on:click="searchOrder">검색</material-button>
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
        @grid-ready="onGridReady" :pagination="true" :paginationPageSize="20">
      </ag-grid-vue>
    </div>
  </div>
  <!-- 검사결과 끝 -->

  <hr>






</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

export default {
  name: "입고검사",
  components: { MaterialButton, },
  data() {
    return {
      searchInfo: {
        pName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd'),
        qcState: 'qcs1',
      },

      searchList: [],

      //ag grid 관련
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "공정검사번호", field: "qcProcessId", resizable: false },
        { headerName: "공정작업번호", field: "processNum", resizable: false },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false },
        { headerName: "제품명", field: "pName", resizable: false },
        { headerName: "검사담당자", field: "eName", resizable: false },
        { headerName: "총 수량", field: "totalQnt", resizable: false },
        { headerName: "합격량", field: "passQnt", resizable: false, editable: true, },
        { headerName: "불합격량", field: "rjcQnt", resizable: false, editable: true, },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false },
        { headerName: "검사완료시각", field: "inspecEnd", resizable: false },
        { headerName: "검사상태", field: "inspecStatus", resizable: false },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },


    }

  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();

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
          "qcProcessId": item.qc_packing_id, 
          "processNum": item.process_num,                   //공정작업번호(바디)
          "productionOrderNum" : item.production_order_num, //생산지시코드
          "pName": item.product_name, 
          "eName": item.emp_name, 
          "totalQnt": item.total_qnt,
          "passQnt": item.pass_qnt, 
          "rjcQnt": item.rjc_qnt,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecEnd": item.inspec_end === null 
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

      console.log(this.searchInfo.qcState);

      let searchSelect = '';
      switch (this.searchInfo.qcState) {
        case 'qcs1':
          searchSelect = 'recordQCPPAll'
          break;
        case 'qcs2':
          searchSelect = 'recordQCPP'
          break;
        case 'qcs3':
          searchSelect = 'requestQCPP'
          break;
      }

      const name = this.searchInfo.pName.replace(/\s+/g, "");

      const result = {
        pName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate,
      };

      let searchResult = await axios.post(`${ajaxUrl}/${searchSelect}`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      console.log(this.searchList);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.rowData1 = this.processSearchResults(this.searchList);
    },
    //전체 조회
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPPAll`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
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
</style>
