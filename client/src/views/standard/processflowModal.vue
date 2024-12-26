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
                  :paginationPageSize="5"
                  @grid-ready="onReady"
                  @rowClicked="onRowClicked"
              >
                </ag-grid-vue>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-info" data-bs-dismiss="modal" @click="processUp">UP</button>
            <button type="button" class="btn btn-info" data-bs-dismiss="modal" @click="processDown">DOWN</button> -->
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="saveModal">저장</button>
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal" @click="processAdd">공정추가</button>
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
            { headerName:"▲",
              field:"UP",
              editable:false,
              cellRenderer: () => {
                const button1 = document.createElement('button');
                button1.innerText = 'UP';
                button1.style.marginRight = '10px';
                button1.style.cursor = 'pointer';
                button1.style.backgroundColor = '#f7b84d';
                button1.style.width = '60px';
                button1.style.height = '30px';
                button1.style.color = 'white';
                button1.style.border = 'none';
                button1.style.padding = '0';
                button1.style.borderRadius = '4px';
                button1.style.textAlign = 'center';
                button1.style.lineHeight = '30px';
                button1.addEventListener('click', () => {

                });
                return button1;
              
              }
            },
            { headerName:"▼",
              field:"DOWN",
              editable:false,
              cellRenderer: () => {
                const button2 = document.createElement('button');
                button2.innerText = 'DOWN';
                button2.style.marginRight = '10px';
                button2.style.cursor = 'pointer';
                button2.style.backgroundColor = '#f7b84d';
                button2.style.width = '60px';
                button2.style.height = '30px';
                button2.style.color = 'white';
                button2.style.border = 'none';
                button2.style.padding = '0';
                button2.style.borderRadius = '4px';
                button2.style.textAlign = 'center';
                button2.style.lineHeight = '30px';
                button2.addEventListener('click', () => {

                });
                return button2;
              
              }
            },
        ],
        flowSelect:[],
      };
    },
    watch : {
      modalTitle(){
        console.log('확인용');
        // this.getBomInput();
        
      },
      productCode:{
            handler:"flowList",
            immediate:true,
        },
    },
    onReady(param) {
        param.api.sizeColumnsToFit();
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
        console.log('제품코드 확인',this.productCode);
        let result = await axios.get(`${ajaxUrl}/flowList/${this.productCode}`)
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
        console.log('모달 오픈');
        console.log(this.productCode);
    },
  }
  </script>
  
  
  
  <style scoped>
  .modal-dialog {
    max-width: 54.5%;
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