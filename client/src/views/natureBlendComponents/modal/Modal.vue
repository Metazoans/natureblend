<template>
  <div class="modal fade" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ modalTitle }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot name="list">slot</slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">{{ noBtn }}</button>
          <button type="button" class="btn btn-primary" @click="confirm">{{ yesBtn }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions} from "vuex";

export default {
  name: "Modal",
  props: {
    isShowModal: Boolean,
    modalTitle: String,
    noBtn: String,
    yesBtn: String,
  },

  data() {
    return {
      modalState: this.isShowModal,
    }

  },
  methods: {
    ...mapActions(["setModalToggle"]),
    closeModal() {
      this.$emit('closeModal')
      this.setModalToggle(false)
    },

    confirm() {
      this.$emit('confirm')
      this.setModalToggle(false)
    }
  }
}
</script>



<style scoped>
.show {
  display: block;
}
</style>