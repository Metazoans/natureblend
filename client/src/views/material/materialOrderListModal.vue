<!--자재 발주 조회메뉴의 취소 모달-->
<template>
   <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
     <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
       <div class="modal-content">
         <div class="modal-header">
           <h1 class="modal-title fs-5" id="exampleModalLabel">발주서 취소</h1>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
          <div class="modal-body" v-if="isShowModal">
              <!--
              {"body_num":37,"order_code":"PO241220005","material_name":"식용색소","com_name":"바다향료회사",
              "ord_qty":"1000 kg","order_date":"2024-12-20","limit_date":"2024-12-20","unit_price":"500 원",
              "total_price":"500,000 원","name":"김다영","material_state":"발주등록"}
              -->
              <!-- {{ deleteList.order_code }}
              <br>
              {{ deleteList.material_name }}
              <br>
              {{ deleteList.com_name }}
              <br>
              {{ deleteList.ord_qty }} -->
              <div class="container my-4">
                <div class="table-responsive">
                  <table class="table table-bordered align-middle text-center">
                    <tbody>
                      <tr>
                        <th scope="row">발주번호</th>
                        <td>{{ deleteList.order_code }}</td>
                        <th scope="row">담당</th>
                        <td>{{ deleteList.name }}</td>
                      </tr>
                      <tr>
                        <th scope="row">자재명</th>
                        <td>{{ deleteList.material_name }}</td>
                        <th scope="row">업체</th>
                        <td>{{ deleteList.com_name }}</td>
                      </tr>
                      <tr>
                        <th scope="row">주문수량</th>
                        <td>{{ deleteList.ord_qty }}</td>
                        <th scope="row">주문일</th>
                        <td>{{ deleteList.order_date }}</td>
                      </tr>
                      <tr>
                        <th scope="row">단가</th>
                        <td>{{ deleteList.unit_price }}</td>
                        <th scope="row">총액</th>
                        <td>{{ deleteList.total_price }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-outline-danger" @click="confirm(1)">전체취소</button>
           <button type="button" class="btn btn-outline-warning" @click="confirm(2)">자재취소</button>
           <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
         </div>
       </div>
     </div>
   </div>
 </template>


<script setup>
  import { defineProps, defineEmits } from 'vue';     //watch

const { isShowModal, deleteList } = defineProps({
      isShowModal: Boolean,
      deleteList: Object,
  });

console.log(deleteList);

  const emit = defineEmits(['closeModal', 'confirm', 'confirmALL']);

   const closeModal = () => {
       emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
   }; 
 
   const confirm = (deleteNum) => {
     emit('confirm', deleteNum); // 부모로 원본 데이터를 전달
   };
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
   margin: auto;
   }
 </style>