<template>
  <div class="px-4 py-4">
    <h1>입고검사-검사신청</h1>
    <hr>
    <div class="row align-items-center mb-3">
      <div class="col-2">
        <h3 class="mr-3">검색조건</h3>
      </div>
      <div class="col">
        <material-button class="btn-search" size="sm" v-on:click="searchOrderAll">전체 조회</material-button>
      </div>
    </div>

    <div class="row">
      <label for="startDate" class="mr-2">날짜범위</label>
      <div class="col-sm">
        <input type="date" placeholder="Date" v-model="searchInfo.startDate" />
      </div>
      <div class="col-sm">
        <input type="date" placeholder="Date" v-model="searchInfo.endDate" />
      </div>
      <div class="col-sm">
        <input label="자재명" placeholder="자재명" type="search" v-model="searchInfo.mName" />
      </div>
      <div class="col-sm">
        <material-button size="md" v-on:click="searchOrder">검색</material-button>
      </div>
    </div>
  </div>


  <hr>
  <div class="container-fluid py-4">
    <h4>검색 결과</h4>
    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef" @grid-ready="onGridReady" >
      </ag-grid-vue>

    </div>
  </div>



  <hr>
  <div class="container-fluid py-4">
    <h4>신청내역</h4>
    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs2" :theme="theme" :defaultColDef="defaultColDef" @grid-ready="onGridReady">
      </ag-grid-vue>

    </div>

    <div class="row">
      <div class="col-12">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                자재발주코드
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                자재명
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                발주수량
              </th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                발주신청일
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">(자재발주코드)</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">오렌지(18kg)</p>
              </td>
              <td class="align-middle text-center text-sm">
                <h6 class="mb-0 text-sm">100</h6>
                <p class="text-xs text-secondary mb-0">(box)</p>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">23/04/18</span>
              </td>
              <td class="align-middle">
                <material-button color="danger" size="sm">
                  삭제
                </material-button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">(자재발주코드)</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">병(1.5L)</p>
              </td>
              <td class="align-middle text-center text-sm">
                <h6 class="mb-0 text-sm">500</h6>
                <p class="text-xs text-secondary mb-0">(box)</p>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">11/01/19</span>
              </td>
              <td class="align-middle">
                <material-button color="danger" size="sm">
                  삭제
                </material-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col">
        <material-button color="warning" size="lg" @click="openModal">저장</material-button>
      </div>
      <div class="col">
        <material-button color="dark" size="lg">초기화</material-button>
      </div>
    </div>
  </div>

  <Modal :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:list>
      <p>신청내역대로 저장하시겠습니까?</p>
    </template>
  </Modal>
</template>

<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import MaterialButton from "@/components/MaterialButton.vue";

import theme from "@/utils/agGridTheme";
import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";

export default {
  name: "입고검사",
  components: { MaterialButton, Modal },


  data() {
    return {
      //검색창 및 결과 관련
      searchInfo: {
        mName: '',
        startDate: this.formatDate(new Date()),
        endDate: this.formatDate(new Date())
      },
      orderList: [],

      //모달 관련
      isShowModal: false,

      //ag grid 관련
      theme: theme,
      rowData1: [],
      columnDefs: [
        { field: "자재발주코드", resizable: false },
        { field: "자재명", resizable: false },
        { field: "발주수량", resizable: false },
        { field: "발주신청일", resizable: false },
        {
          field: "체크",
          resizable: false,
          editable: true,
        }
      ],
      rowData2: [],
      columnDefs2: [
        { field: "자재발주코드", resizable: false, cellStyle: { textAlign: "center" }},
        { field: "자재명", resizable: false, cellStyle: { textAlign: "center" }},
        { field: "발주수량", resizable: false, cellStyle: { textAlign: "center" } },
        { field: "발주신청일", resizable: false, cellStyle: { textAlign: "center" }},
        {
          cellRenderer: (params) => {
            return `
              <button class="btn btn-danger size="sm" data-id="${params.node.id}">
                  삭제
              </button>
            `;
          },
          resizable: false,
          sortable: false, // 열정렬
          filter: false    // 필터링
          , cellStyle: { textAlign: "center" }
        }
      ],
      defaultColDef: {
        headerClass: "header-center"
      },
    };
  },


  methods: {
    formatDate(date) {
      // 날짜를 YYYY-MM-DD 형식으로 변환
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    //검색창 관련    
    async searchOrder() {
      const name = this.searchInfo.mName.replace(/\s+/g, "");
      const result = {
        mName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/meterialOrderQC`, result)
        .catch(err => console.log(err));
      this.orderList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.orderList.length; i++) {
        let col = {
          "체크": false, "자재발주코드": this.orderList[i].order_code, "자재명": this.orderList[i].material_name,
          "발주수량": this.orderList[i].ord_qty, "발주신청일": this.dateFormat(this.orderList[i].order_date, 'yyyy-MM-dd')
        };
        console.log('col:', col);
        this.rowData1[i] = col;
        console.log(this.rowData1[i]);
      }

      console.log(this.rowData);
    },

    async searchOrderAll() {
      let searchResult = await axios.get(`${ajaxUrl}/meterialOrderQCAll`)
        .catch(err => console.log(err));
      this.orderList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.orderList.length; i++) {
        let col = {
          "체크": false, "자재발주코드": this.orderList[i].order_code, "자재명": this.orderList[i].material_name,
          "발주수량": this.orderList[i].ord_qty, "발주신청일": this.dateFormat(this.orderList[i].order_date, 'yyyy-MM-dd')
        }
        this.rowData1[i] = col;
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },

    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },


    openModal() {
      this.isShowModal = !this.isShowModal
    },

    confirm() {
      console.log('저장 완료')
      this.closeModal()
    },

    closeModal() {
      this.isShowModal = false
    }
  }
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