<template>
  <div class="container-fluid py-4">
    <h1>생산등록</h1>
    <div
        class="search pe-md-3 d-flex align-items-center ms-md-auto"
        @click="openModal"
    >
      <material-input id="search" label="제품명" />
    </div>

    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        @closeModal="closeModal"
        @confirm="confirm">
      <template v-slot:list>
        <ProductList v-if="isShowModal"/>
      </template>
    </Modal>
  </div>
</template>
<script>
import MaterialInput from "@/components/MaterialInput.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import {mapActions} from "vuex";
import ProductList from "@/views/production/productionAdd/productList.vue";


export default {
  name: "tables",
  components: {ProductList, Modal, MaterialInput},

  data() {
    return {
      isShowModal: false,
      modalTitle: '제품 목록'
    };
  },

  created() {
  },

  methods: {


    ...mapActions(["setModalToggle"]),

    openModal() {
      this.isShowModal = !this.isShowModal
      this.setModalToggle(true)
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