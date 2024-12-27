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
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="saveModal">저장</button>
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal" @click="processAdd">공정추가</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <processAddModal  
        :isShowModal2="isShowModal2"
        @closeModal2="closeModal2"
        @selectItem="handleSelectedProcess" 
        @confirm2="confirm2"
        :modalTitle2="modalTitle2"
      >
      </processAddModal>
    </div>
  </template>
  <script>
    import theme from "@/utils/agGridTheme";
    import { ajaxUrl } from '@/utils/commons.js';
    import axios from 'axios';
    import processAddModal from "./processAddModal.vue";
  
  export default {
    name: "Modal",
    components:{processAddModal},
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
        isShowModal2 : false,
        modalType2:'',
        modalTitle2:'공정 정보',
        processCode : '',
        processName : '',

        theme: theme,
        rowData:[],
        columnDefs:[
            { headerName:"공정순서" , field: "process_sequence" },
            { headerName:"공정코드" , field:"process_code" },
            { headerName:"공정명" , field:"process_name" },
            { headerName:"▲",
              field:"UP",
              editable:false,
              cellRenderer: (params) => {
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
                  const rowData = params.node.data; // 클릭된 행 데이터
                  this.updateProcessSequence(rowData, 'UP'); // 공정순서 감소
                });
                return button1;
              
              }
            },
            { headerName:"▼",
              field:"DOWN",
              editable:false,
              cellRenderer: (params) => {
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
                  const rowData = params.node.data; // 클릭된 행 데이터
                  this.updateProcessSequence(rowData, 'DOWN'); // 공정순서 증가
                });
                return button2;
              
              }
            },
        ],
        flowSelect:[],
        newList:[],
      };
    },
    watch : {
      modalTitle(){
        console.log('확인용');
      },
      productCode:{
            handler:"flowList",
            immediate:true,
        },
    },
    onReady(param1) {
        param1.api.sizeColumnsToFit();
    },
    created(){
    //   this.getBomInput();
    },
    methods: {
      handleSelectedProcess(process) {
      console.log('전달받은 데이터 확인',process);
      this.selectedProcess = process;
      // 모달에서 전달받은 내용 insert
      this.flowInsert(process);
      // 해당 공정흐름도 리스트 select 재호출
    },
      // 공정순서 업데이트 메서드
      async updateProcessSequence(rowData, direction) {
        console.log('rowData',rowData,'direction',direction);

        let beforeSeq = 0;
        if(direction === 'UP'){
          beforeSeq = rowData.process_sequence - 1;
        }else{
          beforeSeq = rowData.process_sequence + 1;
        }
        console.log('지금 조회할값',beforeSeq);

        const beforeData2 = {
          beforeData:beforeSeq,
          beforeProcessSequence:rowData.product_code
        };

        let bfSeq =  await this.flowNumList(beforeData2);


        console.log(bfSeq);
        // rowData.process_sequence
        
        
        const updateData = {
          process_chart_num : rowData.process_chart_num,
          process_sequence: beforeSeq,
        };
        await this.flowUpdate(updateData);
        console.log('실행되면안됨');

        const beforeData3 = {
          beforeData:bfSeq,
          beforeProcessSequence:rowData.process_sequence
        };
        this.result2(beforeData3);

        // let beforeProcessSequence = updateData.process_sequence;
        // // 방향에 따라 공정 순서 증가/감소

        // if (direction === 'UP') {
        //   updateData.process_sequence -= 1; // UP 버튼 클릭 시 공정순서 감소
        //   console.log('UP확인',updateData);
        // } else if (direction === 'DOWN') {
        //   updateData.process_sequence += 1; // DOWN 버튼 클릭 시 공정순서 증가
        // }

        // console.log('변경된 데이터:', updateData);
        // let beforeData = this.flowNumList(updateData);
        // console.log('이전 데이터 확인',beforeData);
        // console.log('변경될 이전순서값',beforeProcessSequence);
        // this.flowUpdate(updateData);

        

        // this.result2(beforeData2);
        
      },

      async flowUpdate(updateData){
        // 서버에 업데이트 요청
        const result = await axios.post(`${ajaxUrl}/flowUpdate`, updateData)
                                  .catch(err => console.log(err));
        console.log('얘가 먼저 실행되야함');
        if (result && result.data === '성공') {
          //alert('공정순서가 변경되었습니다.');
          // this.flowList(); // 공정 목록 재호출
        } else {
          alert('공정순서 변경 실패');
        }
      },


      async result2(beforeData2){
        const result2 = await axios.post(`${ajaxUrl}/beforeUpdate`, beforeData2)
                                  .catch(err => console.log(err));
        console.log(result2);
        this.flowList();
      },

      async flowNumList(updateData){
        const result = await axios.post(`${ajaxUrl}/flowNumList`, updateData)
                                  .catch(err => console.log(err));
        // console.log('a',result.data[0].process_chart_num);    
        // console.log('b',result.data[0]['process_chart_num']);                      
        return result.data[0].process_chart_num;
      },

      async flowInsert(process){
        this.newList = { product_code: this.productCode,
                         process_code: process.process_code,
                         process_name: process.process_name };
        console.log('넘겨줄 데이터 확인',this.newList);
        const result = await axios.post(`${ajaxUrl}/flowInsert`, this.newList)
                                  .catch(err => console.log(err));
                                  console.log('result data 확인',result.data);
            if(result.data === '성공'){
                alert('등록되었습니다.');
                this.flowList();
            }else{
                alert('등록 실패');
            }
      },

      processAdd() {
        // this.openModal('processAddModal');
        this.isShowModal2 = true;
      },
      openModal(modalType2){
        this.modalType2 = modalType2;
        this.modalTitle2 = '공정 정보'

        this.isShowModal2 = true;
      },
      closeModal() {
        this.$emit('closeModal')
      },
      closeModal2() {
        this.isShowModal2 = false;
      },
      // onRowClicked(row) {
      //   console.log('클릭된 데이터 : ', row.data);
      //   let process = row.data;
      //   this.$emit( 'selectItem', { process_code : process.process_code,
      //                               process_name : process.process_name,
      //     }
      //   )
      // },
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