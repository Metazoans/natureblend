<template>
    <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">입고하기</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="isShowModal">
            <div class="grid-container">
                <ag-grid-vue
                    :rowData="rowData"
                    :columnDefs="columnDefs"
                    :theme="theme"
                    @grid-ready="onReady"
                    style="height: 100px;"
                    rowSelection="multiple"
                    >
                </ag-grid-vue>
            </div>


                <!-- <ul>
                    <li v-for="(row, index) in selectedRows" :key="index">
                    {{ row }}
                    </li>
                </ul> -->
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" @click="confirm">입고하기</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">취소하기</button>
          </div>
        </div>
      </div>
    </div>
  </template>


<script setup>
  import { defineProps, defineEmits, ref } from 'vue';

  const { isShowModal, selectedRows, testStr } = defineProps({
        isShowModal: Boolean,
        selectedRows: Array,
        testStr: String,
    });
    console.log(selectedRows);

    // watch(
    //     () => isShowModal,
    //     (newVal) => {
    //         if (newVal) {
    //             console.log('모달이 열림:', selectedRows);
    //         rowData.value = selectedRows; // ag-grid에 데이터 반영
    //         }
    //     }
    // );

    const emit = defineEmits(['closeModal', 'confirm']);

    const closeModal = () => {
        emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
    };

    const confirm = () => {
        emit('confirm'); // 부모 컴포넌트로 이벤트 전송
        console.log(testStr);
    };

    // 행 레코드 삽입하는 변수
    const rowData = ref([]);

     //그리드 api 컬럼명 들어가는 거
 const columnDefs = ref([
        { headerName: "발주코드", field: "order_code" },
        { headerName: "자재명", field: "material_name" },
        { headerName: "정상수량", field: "pass_qnt" },
        { headerName: "창고", field: "changgo" },
        { headerName: "불량수량", field: "rjc_qnt" },
        { headerName: "창고", field: "changgo" },
      ]);

//ag-grid 메소드 API가 준비된 후 발생하는 이벤트
const onReady = (param) => {
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
}
</script>
  
  
  <style scoped>
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
  .modal-dialog {
    max-width: 600px;
    margin: auto;
    }
  </style>