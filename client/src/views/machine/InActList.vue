<template>
  <div class="container-fluid py-4" id="inActList">
    <h1>비가동 페이지</h1>

    <material-pagination color="warning" size="md">
      <material-pagination-item prev />
      <material-pagination-item label="1" active />
      <material-pagination-item label="2" disabled />
      <material-pagination-item label="3" disabled/>
      <material-pagination-item label="4" disabled/>
      <material-pagination-item label="5" disabled/>
      <material-pagination-item next />
    </material-pagination>

    <material-button
      color="warning"
      @click="openModal"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      임시 비가동 등록
    </material-button>

    <InActAdd :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm"></InActAdd>

  </div>
</template>

<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import InActAdd from "./InActAdd.vue";



export default {
  name: "inActList",
  components: {
    MaterialPaginationItem,
    MaterialPagination,
    MaterialButton,
    InActAdd,
  },
  
  data() {
    return {
      isShowModal: false,
      
    };
  },

  methods: {
    openModal() {
      this.isShowModal = !this.isShowModal;
    },

    confirm(data) {
      console.log(data);
      this.closeModal();
    },

    closeModal() {
      this.isShowModal = false;
    },
  },
};
</script>

<style scoped>
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
