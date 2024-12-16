
<template>
  <MachineModal>
    <template v-slot:header>
      <h2>비동기 내역 등록</h2>
    </template>
    <template v-slot:body>
      <div class="inactBody" v-bind="inActData">
        <div class="modalRow ">
          <a>설비 번호</a>
          <material-input id="text" placeholder="" @update:value="inputNum" />
          <machine-input id="text" placeholder="" v-model="inActData.machineNum"/>

        </div>

        <div class="modalRow">
          <a>설비 이름</a>
          <material-input id="text" placeholder="" v-model="inActData.machineName"/>
        </div>

        <div class="modalRow">
          <a>설비 위치</a>
          <material-input id="text" placeholder="" v-model="inActData.machineLocation"/>
        </div>

        <div class="modalRow">
          <a>비가동 일시</a>
          <div class="modalRow">
            <material-input type="date" placeholder="" value="" v-model="inActData.StartDate"/>
            <material-input type="time" placeholder="" value="" v-model="inActData.StartTime"/>
            <a> ~ </a>
            <material-input type="date" placeholder="" value="" v-model="inActData.EndDate"/>
            <material-input type="time" placeholder="" value="" v-model="inActData.EndTime"/>
          </div>
        </div>

        <div class="modalRow">
          <a>비가동 사유</a>
          <select class="form-select" aria-label="Default select example"
                  v-model="inActData.inActType">
            <option :value="{name: '점검'}">점검</option>
            <option :value="{name: '고장'}">고장</option>
            <option :value="{name: '휴식'}">휴식</option>
            <option :value="{name: '기타'}">기타</option>
          </select>
        </div>

        <div class="modalRow">
          <a>비고</a>
          <material-input id="text" placeholder="" v-model="inActData.inActInfo"/>
        </div>
      </div>
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

</template>


<script>
import MaterialInput from "@/components/MaterialInput.vue";
import MachineModal from "@/views/machine/MachineModal.vue";
import MachineInput from "@/components/MachineInput.vue";

export default {
  name: "inActAdd",
  components: {
    MaterialInput,
    MachineModal,
    MachineInput,
  },
  
  data() {
    return {
      inActData: {
        machineNum: 0,
        machineName: '',
        machineLocation: '',
        StartDate: '',
        StartTime: '',
        EndDate: '',
        EndTime: '',
        inActType: '',
        inActInfo: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },

    confirm() {
      this.$emit('confirm', this.inActData);
    },

    inputValue(data) {
      this.inActData.machineNum = data;
    },
  }
};
</script>

<style>
.modalRow > * {
  display: inline-block;
}
</style>