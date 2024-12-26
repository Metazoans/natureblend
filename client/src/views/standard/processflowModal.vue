<template>
    <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">{{ modalTitle }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot name="list">slot</slot>
            <div class="mb-1">>
              <!-- 제품명 조회  -->
              <div class="grid-container" >
                <strong>◎제품코드:{{ productCode }} ◎제품명:{{ productName }}</strong>
                <ag-grid-vue 
                  style ="width: 100%; margin-bottom: 15px;"
                  :rowData="rowData"
                  :columnDefs="columnDefs"
                  :theme="theme"
                  :pagination="true"
                  :paginationPageSize="10"
                  @grid-ready="onReady"
                  @rowClicked="onRowClicked"
              >
                </ag-grid-vue>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="saveModal">저장</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
    import theme from "@/utils/agGridTheme";
    import { ajaxUrl } from '@/utils/commons.js';
    import axios from 'axios';
  
  export default {
    name: "Modal",
    props: {
      isShowModal: Boolean,
      modalTitle: String,
      productCode: String, // 부모로부터 제품코드를 받는다
      productName : String,
      // noBtn: String,
      // yesBtn: String,
      // modalData: Array,
    },
  
    data() {
      return {
        theme: theme,
        rowData:[],
        columnDefs:[
            { headerName:"공정순서" , field: "process_sequence" },
            { headerName:"공정코드" , field:"process_code" },
            { headerName:"공정명" , field:"process_name" },
        ],
        flowSelect:[],
      };
    },
    watch : {
      modalTitle(){
        console.log('확인용');
        // this.getBomInput();
      },
    },
    created(){
    //   this.getBomInput();
    },
    methods: {
      closeModal() {
        this.$emit('closeModal')
      },
    //   onRowClicked(row) {
    //     console.log('클릭된 데이터 : ', row.data);
    //     let bom = row.data;
    //     this.$emit( 'selectItem', { product_code : bom.product_code,
    //                                 product_name : bom.product_name,
    //       }
    //     )
    //   },
      getSelectedProduct() {
          return this.rowData[0];
      },
      async flowList() {
        let result = await axios.get(`${ajaxUrl}/flowList`)
        if(result && result.data){
          this.flowSelect = result.data;
          console.log("연결성공");
          this.rowData = result.data;
        }else {
          console.log("연결실패");
        }
      },
    },
    mounted() { // 페이지 조회시 바로 발생
        this.flowList();
    },
  }
  </script>
  
  
  
  <style scoped>
  .modal-dialog {
    max-width: 50%;
  }
  .modal-body{
    background-color: gray;
  }
  .modal-body .form-control {
      width: 100px;
      max-width: 300px; /* 최대 너비 제한 */
      height: 45px;
      background-color: white;
  }
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    .modal-body {
      max-height: 500px;
    }
  }
  .show {
    display: block;
  }
  button {
    font-size: 16px;
  }
b, strong {
    font-weight: 700;
    color: white;
}
.mt-3 {
    margin-top: 1rem !important;
    color: white;
}
  </style>