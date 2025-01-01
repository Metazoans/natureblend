<template>
  <div class="px-4 py-4">
    <h1 class="mb-3">공정검사-음료검사기록조회</h1>
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
          <label for="startDate" class="form-label">날짜 범위</label>
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
    <h4>검사상세정보</h4>
    <p>검사항목 클릭 => 불량항목, 수량입력(없으면 그냥 저장)=> 작성완료한 항목 체크후 '검사완료'버튼 클릭</p>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20" style="height: 700px;">
      </ag-grid-vue>
    </div>

  </div>
  <!-- 검사결과 끝 -->

  <hr>



  

  <!-- 불량 상세 모달 -->

  <Modal :isShowModal="showModalRJC" @closeModal="closeModal"
    @confirm="closeModal">
    <template v-slot:list>
      <h4>검사 상세 정보</h4>
      <p>공정(음료)번호: {{ selectedRow.qcProcessId }}</p>
      <p>제품번호: {{ selectedRow.productCode }}</p>
      <p>음료 제품명: {{ selectedRow.pName }}</p>
      <b>검사 항목 : 산도, 총세균수, 당도, 잔류 농약, 효모/곰팡이</b>
      <!-- <p>{{ this.defectDetailsMap }}</p> -->
      <hr>
      <!-- <p>{{ this.testDetails[selectedRow.productCode] }}</p> -->

      <!-- 검사 항목 리스트 -->
      <div v-for="(item, index) in this.defectDetailsMap[selectedRow.qcProcessId]" :key="index" class="inspection-item">
        <label>
          {{ item.item_name }} : [허용치 {{ item.etc_min }} ~ {{ item.etc_max }} {{ item.item_unit }}]:
        </label>
        <input type="number" v-model.number="item.input_value" placeholder="값을 입력하세요" readonly/>
      </div>




    </template>
  </Modal>

  <Modal :isShowModal="showModalDone" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:list>
      <p>신청내역대로 저장하시겠습니까?</p>
    </template>
  </Modal>



</template>

<script>
// import { toRaw } from 'vue';

import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

export default {
  name: "입고검사관리",
  components: { MaterialButton, Modal },
  data() {
    return {
      //검색 관련
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
        { headerName: "공정검사번호", field: "qcProcessId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "공정작업번호", field: "processNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "제품명", field: "pName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "합격 여부", field: "inspecResult", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "검사완료시각", field: "inspecEnd", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "검사상태", field: "inspecStatus", resizable: false, cellStyle: { textAlign: "left" }, flex: 1},

      ],

      defaultColDef: {
        headerClass: "header-center"
      },


      showModalRJC: false, // (불량항목)모달 표시 여부
      selectedRow: {}, // 선택된 행 데이터

      //db에서 가져온 제품별 검사 항목과 허용 범위
      testDetails: {},


      defectDetailsMap: {}, //검사번호별로 저장된 검사내용 { qcProcessId: [ { ... }, ... ] }

      


      completedDefectDetailsMap: {},
      completedTestDetails: [],
      showModalDone: false,


    }

  },
  methods: {
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    onGridReady(params) {
      this.gridApi = params.api;
      //this.gridApi.sizeColumnsToFit();
    },


    //검색창 관련
    //검색결과 정리
    processSearchResults(searchList) {
      const processedData = [];
      for (let item of searchList) {
        processedData.push({
          "qcProcessId": item.qc_berverage_id,
          "processNum": item.process_num,
          "productionOrderNum": item.production_order_num,
          "productCode": item.product_code,
          "pName": item.product_name,
          "eName": item.emp_name,
          "inspecResult": item.inspec_result === null
          ? '미정' : item.inspec_result,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecEnd": item.inspec_end === null 
          ? "" : this.dateFormat(item.inspec_end, 'yyyy-MM-dd hh:mm:ss'),
          "inspecStatus": item.inspec_status,
        });

        // 검사 항목을 defectDetailsMap에 추가
        this.addDefectDetailForRow(item.qc_berverage_id, item.product_code);
      }
      return processedData;
    },


    //조건 검색 시작  
    async searchOrder() {
      if (new Date(this.searchInfo.startDate) > new Date(this.searchInfo.endDate)) {
        `${notify({
          title: "검색실패",
          text: "시작 날짜는 종료 날짜보다 이전이어야 합니다.",
          type: "error", // success, warn, error 가능
        })}`;
        return;
      }

      let searchSelect = ''
      switch (this.searchInfo.qcState) {
        case 'qcs1':
          searchSelect = 'recordQCPBAll'
          break;
        case 'qcs2':
          searchSelect = 'recordQCPB'
          break;
        case 'qcs3':
          searchSelect = 'requestQCPB'
          break;
      }

      const name = this.searchInfo.pName.replace(/\s+/g, "");
      const result = {
        pName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/${searchSelect}`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;
      //console.log(searchResult.data);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.completedDefectDetailsMap = {};
    },
    //조건 검색 끝


    //전체 조회 시작
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPBAll`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;
      //console.log(searchResult.data);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.completedDefectDetailsMap = {};
    },
    //전체 조회 끝

    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      console.log('클릭됨');
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = event.data;
      this.showModalRJC = true;
    },
    closeModal() {
      this.showModalRJC = false;
      this.selectedRow = {};

      this.showModalDone = false;
    },




    ///신청 건의 불량항목 내역 관련
    //행별로 검사항목 저장
    addDefectDetailForRow(qcProcessId, productCode) {
      if (!this.defectDetailsMap[qcProcessId]) {
        this.defectDetailsMap[qcProcessId] = [];
      }

      // productCode에 해당하는 검사 항목을 testDetails에서 가져오기
      const testItems = this.testDetails[productCode] || [];

      // console.log(this.completedTestDetails);
      // console.log(testItems);
      // 검사 항목들에 대해 defectDetailsMap에 항목 추가
      testItems.forEach(item => {
        let matchingTestDetail = this.completedTestDetails.find(detail =>
             detail.qc_berverage_id === qcProcessId &&
          detail.bev_test_item_id === item.item_id &&
          detail.bev_test_details_id === item.details_id
        );


        this.defectDetailsMap[qcProcessId].push({
          qcProcessId: qcProcessId,
          item_id: item.item_id,
          details_id: item.details_id,
          item_name: item.item_name,
          item_unit: item.item_unit,
          etc_min: item.etc_min,
          etc_max: item.etc_max,
          input_value: matchingTestDetail ? matchingTestDetail.actual_value : 0, 
          // input_value: 0, 
        });
      });
    },

    

    //최종 처리 버튼
    openModal() {
      this.showModalDone = !this.showModalDone
      console.log(this.defectDetailsMap);
      console.log(this.completedDefectDetailsMap);
    },
    






    //음료검사항목및수치 불러오기
    async callTestDetail() {
      let testList = await axios.get(`${ajaxUrl}/testDetailsForB`)
        .catch(err => console.log(err));
      this.testDetails = testList.data;
    },

    //행별 검사 수치 불러오기
    async callCompletedTestDetail() {
      let list = await axios.get(`${ajaxUrl}/recordQCPBDetails`)
        .catch(err => console.log(err));
      // console.log(list.data[0]);
      this.completedTestDetails = list.data;
      console.log(this.completedTestDetails);

      // if (list && list.data) {
      //   // 배열을 Map으로 변환
      //   const map = list.data.reduce((acc, item) => {
      //     acc[item.qc_berverage_id] = item;
      //     return acc;
      //   }, {});

      //   console.log(map);
      // } else {
      //   console.log("No data received");
      // }

    }


  },
  async created() {
    await this.callCompletedTestDetail();
    await this.callTestDetail();
    this.searchRequestAll();
    // this.callFaultyCode();
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
