<template>
  <div class="px-4 py-4">
    <h1 class="mb-3">포장검사-불량내역조회</h1>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h3 class="me-3">검색조건</h3>
        <material-button class="btn-search ms-auto" size="sm" v-on:click="searchRequestAll">전체 조회</material-button>
      </div>

      <div class="row g-3">
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
    <h4>불량내역</h4>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" :pagination="true" :paginationPageSize="20" >
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
  components: { MaterialButton,  },
  data() {
    return {
      searchInfo: {
        pName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd')
      },

      searchList: [],

      //ag grid 관련
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "불량품번호", field:"qcPackingRjcId", resizable:false },
        { headerName: "포장검사번호", field: "qcPackingId", resizable: false },
        { headerName: "공정작업번호", field: "processNum", resizable: false },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false },
        { headerName: "제품명", field: "pName", resizable: false },
        { headerName: "검사담당자", field: "eName", resizable: false },
        { headerName: "불합격량", field: "rjcQnt", resizable: false },
        { headerName: "불량코드", field: "faultyCode", resizable: false },
        { headerName: "불량명", field: "faultyReason", resizable: false },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false },
        { headerName: "검사완료시각", field: "inspecEnd", resizable: false },

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
    async searchOrder() {
      if (new Date(this.searchInfo.startDate) > new Date(this.searchInfo.endDate)) {
        `${notify({
          title: "검색실패",
          text: "시작 날짜는 종료 날짜보다 이전이어야 합니다.",
          type: "error", // success, warn, error 가능
        })}`;
        return;
      }

      const name = this.searchInfo.pName.replace(/\s+/g, "");
      const result = {
        pName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPPR`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.searchList.length; i++) {
        let col = {
          "qcPackingRjcId":this.searchList[i].packing_rjc_id,
          "qcPackingId": this.searchList[i].qc_packing_id,
          "productionOrderNum": this.searchList[i].production_order_num,
          "processNum":this.searchList[i].process_num,
          "pName": this.searchList[i].product_name, 
          "eName":this.searchList[i].name, 
          "rjcQnt" : this.searchList[i].rjc_quantity,
          "faultyCode": this.searchList[i].faulty_code,
          "faultyReason":this.searchList[i].faulty_reason,
          "inspecStart": this.dateFormat(this.searchList[i].inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecEnd": this.dateFormat(this.searchList[i].inspec_end, 'yyyy-MM-dd hh:mm:ss'),

        }
        this.rowData1[i] = col;
      }
    },
    //전체 조회
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPPR`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.searchList.length; i++) {
        let col = {
          "qcPackingRjcId":this.searchList[i].packing_rjc_id,
          "qcPackingId": this.searchList[i].qc_packing_id,
          "productionOrderNum": this.searchList[i].production_order_num,
          "processNum":this.searchList[i].process_num,
          "pName": this.searchList[i].product_name, 
          "eName":this.searchList[i].name, 
          "rjcQnt" : this.searchList[i].rjc_quantity,
          "faultyCode": this.searchList[i].faulty_code,
          "faultyReason":this.searchList[i].faulty_reason,
          "inspecStart": this.dateFormat(this.searchList[i].inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecEnd": this.dateFormat(this.searchList[i].inspec_end, 'yyyy-MM-dd hh:mm:ss'),

        }
        this.rowData1[i] = col;
      }
    },
  },
  created(){
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