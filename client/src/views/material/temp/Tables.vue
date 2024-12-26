<!-- 모달 샘플 -->
<template>
  <div class="container-fluid py-4">
    <h1>생산등록</h1>
    <div
        class="search pe-md-3 d-flex align-items-center ms-md-auto"
    >
      <material-input id="search" label="제품명" />
    </div>

    <button type="button" @click="openModal" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>

    <Modal :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm">
      <template v-slot:list>
        <p>content</p>.
        
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
      </template>
    </Modal>
  </div>
</template>
<script>
import MaterialInput from "@/components/MaterialInput.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";

export default {
  name: "tables",
  components: {Modal, MaterialInput},

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
.container-fluid {
  min-height: 500px;
  .search {
    margin-top: 24px;
  }
}

</style>