<template>
  <div class="container-fluid py-4">
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

    <MachineModal :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm">
      <template v-slot:header>
        <h2>TEST</h2>
      </template>
      <template v-slot:body>
        <InActAdd/>
      </template>
      <template v-slot:footer>
        <button
          class="btn bg-gradient-warning w-100 mb-0 toast-btn"
          type="button"
          data-target="warningToast"
          @click="confirm"
        >
          등록
        </button>
        <button
          class="btn bg-gradient-warning w-100 mb-0 toast-btn"
          type="button"
          data-target="warningToast"
          @click="closeModal"
        >
          취소
        </button>
      </template>
    </MachineModal>
  </div>
</template>

<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MachineModal from "@/views/machine/MachineModal.vue";
import InActAdd from "./InActAdd.vue";


export default {
  name: "inActList",
  components: {
    MaterialPaginationItem,
    MaterialPagination,
    MaterialButton,
    MachineModal,
    InActAdd,
  },
  
  data() {
    return {
      isShowModal: false,
    };
  },

  methods: {
    openModal() {
      this.isShowModal = !this.isShowModal
    },

    confirm() {
      console.log('값 저장')
      this.closeModal()
    },

    closeModal() {
      this.isShowModal = false
    }
  }
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
