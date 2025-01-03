<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>정말 삭제하시겠습니까?</h3>
        <button @click="onDeleteConfirmed" class="btn btn-success">확인</button>
        <button @click="onDeleteCancelled" class="btn btn-danger">취소</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      showModal: Boolean
    },
    methods: {
      onDeleteConfirmed() {
        this.$emit("deleteConfirmed");
      },
      onDeleteCancelled() {
        this.$emit("deleteCancelled");
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 200px;
    left: 700px;
    right: 0;
    bottom: 0;
    width: 30%;
    height: 50%;
    /* background-color: rgba(0, 0, 0, 0.5); */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 100%;
  }
  </style>  