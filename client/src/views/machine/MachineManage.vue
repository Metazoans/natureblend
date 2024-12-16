<template>
  <MachineModal>
    <template v-slot:header>
      <h2>설비 등록 및 수정</h2>
    </template>

    
    <template v-slot:body>
      <div class="inactBody" v-bind="inActData">
        <div class="modalRow">
          <label for="machineName">설비 이름</label>
          <input type="text" id="machineName" name="machineName" v-model="machineData.machine_name"/>
        </div>
        <div class="modalRow">
          <label for="">설비 이미지</label>
          <input type="text" id="" name="" v-model="machineData.machine_img"/>
        </div>
        <div class="modalRow">
          <label for="">사용 여부</label>
          <input type="text" id="" name="" v-model="machineData.machine_state"/>
        </div>
        <div class="modalRow">
          <label for="">모델 번호</label>
          <input type="text" id="" name="" v-model="machineData.model_num"/>
        </div>
        <div class="modalRow">
          <label for="">설비 분류</label>
          <input type="text" id="" name="" v-model="machineData.machine_type"/>
        </div>
        <div class="modalRow">
          <label for="">제작 업체</label>
          <input type="text" id="" name="" v-model="machineData.client_num"/>
        </div>
        <div class="modalRow">
          <label for="">UPH</label>
          <input type="text" id="" name="" v-model="machineData.uph"/>
        </div>
        <div class="modalRow">
          <label for="">설비 위치</label>
          <input type="text" id="" name="" v-model="machineData.machine_location"/>
        </div>
        <div class="modalRow">
          <label for="">등록자</label>
          <input type="text" id="" name="" v-model="machineData.emp_num"/>
        </div>
        <div class="modalRow">
          <label for="">구매 일자</label>
          <input type="text" id="" name="" v-model="machineData.buy_date"/>
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
  import MachineModal from "@/views/machine/MachineModal.vue";
  import userDateUtils from "@/utils/useDates.js";
  import { ajaxUrl } from '@/utils/commons.js';
  import axios from 'axios';

  export default {
    name: "MachineManage",
    components: {
      MachineModal,
    },
    data() {
      return {
        machineData: {
          machine_name: '',
          machine_img: '',
          model_num: '',
          machine_state: '',
          machine_type: '세척기기',
          machine_location: '',
          uph: '',
          upd: '',
          buy_date: '',
          install_date: '',
          emp_num: 0,
          client_num: 0,
          process_code: '세척',
        }
      }
    },
    created() {
      this.inActData.inact_start_time = this.getToday();  
    },
  };
</script>