<template>
   <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
     <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
       <div class="modal-content">
         <div class="modal-header">
           <h1 class="modal-title fs-5" id="exampleModalLabel">입고LOT별 현재고 조회</h1>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body" v-if="isShowModal">
            <div class="modal-body">
               <div class="container">
                  <!-- 자재명 -->
                  <div class="row align-items-center g-0 mb-3">
                     <div class="col-4 fw-bold text-start">자재명 :</div>
                     <div class="col-8 fw-bold text-start fs-3 text-dark">{{ newObject.material_name }}</div>
                  </div>
                  <!-- 로트번호 -->
                  <div class="row align-items-center g-0 mb-3">
                     <div class="col-4 fw-bold text-start">로트번호 :</div>
                     <div class="col-8 text-start text-dark">{{ newObject.lot_code }}</div>
                  </div>
                  <!-- 정상수량 -->
                  <div class="row align-items-center g-0 mb-3">
                     <div class="col-4 fw-bold text-start">정상수량 :</div>
                     <div class="col-8 fw-bold text-start text-success fs-2">{{ newObject.pass_stok_qty }}</div>
                  </div>
                  <!-- 불량수량 -->
                  <div class="row align-items-center g-0 mb-3">
                     <div class="col-4 fw-bold text-start">불량수량 :</div>
                     <div class="col-8  fw-bold text-start text-danger fs-2">{{ newObject.reject_stok_qty }}</div>
                  </div>
               </div>
            </div>
           

               <!-- <ul>
                    <li v-for="(row, index) in newObject" :key="index">
                    {{ row }}
                    </li>
                </ul> -->
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-warning" @click="confirm">닫기</button>
         </div>
       </div>
     </div>
   </div>
 </template>


<script setup>
 import { defineProps, defineEmits } from 'vue';     //watch

 const { isShowModal , newObject} = defineProps({
       isShowModal: Boolean,
       newObject: Array,
   });

   const emit = defineEmits(['closeModal', 'confirm']);

    const closeModal = () => {
        emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
    }; 

   const confirm = () => {
     //console.log('최종 nuwList 데이터:', nuwList); 
     emit('confirm'); // 부모로 원본 데이터를 전달
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
   max-width: 360px;
   margin: auto;
   }
 </style>