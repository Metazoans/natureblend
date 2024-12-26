<template>
  <div class="modal fade" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">slot</slot>
        </div>
        <div class="modal-body">
          <slot name="body">slot</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">slot</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modalMachine",
  props: {
    isShowModal: Boolean,
    modalSize: String,
  },

  data() {
    return {
      modalState: this.isShowModal,
    }

  },

}
</script>



<style scoped>
.show {
  display: block;
}
</style>