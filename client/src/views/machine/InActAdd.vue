
<template>
  <MachineModal>
    <template v-slot:header>
      <h2>비동기 내역 등록</h2>
    </template>
    <template v-slot:body>
      <div class="inactBody" v-bind="inActData">
        <div class="modalRow ">
          <!-- 템플릿 input 컴포넌트 사용시 update:value 메소드 생성해야함 임시로 input 사용 -->
          <!-- <material-input id="text" placeholder="" @update:value="inputNum" /> -->
          <label for="machineNum">설비 번호</label>
          <input type="number" id="machineNum" name="machineNum" v-model.number="inActData.machine_num"/>
        </div>

        <div class="modalRow">
          <label for="machineName">설비 이름</label>
          <input type="text" id="machineName" name="machineName" v-model="inActData.machine_name"/>
        </div>

        <div class="modalRow">
          <label for="machineLocation">설비 위치</label>
          <input type="text" id="machineLocation" name="machineLocation" v-model="inActData.machine_location"/>
        </div>

        <div class="modalRow">
          <label for="StartDate">비가동 일시</label>
          <div class="modalRow">
            <input type="datetime-local" id="StartDate" name="StartDate" v-model="inActData.inact_start_time"/>
            <a> ~ </a>
            <input type="datetime-local" id="EndDate" name="EndDate" v-model="inActData.inact_end_time"/>
          </div>
        </div>

        <div class="modalRow">
          <a>비가동 사유</a>
          <select class="form-select" aria-label="Default select example"
                  v-model="inActData.inact_type">
            <option value="점검">점검</option>
            <option value="고장">고장</option>
            <option value="휴식">휴식</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div class="modalRow">
          <label for="inActInfo">비고</label>
          <input type="text" id="inActInfo" name="inActInfo" v-model="inActData.inact_info" />
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
  name: "inActAdd",
  components: {
    MachineModal,
  },
  
  data() {
    return {
      inActData: {
        machine_num: '',
        machine_name: '',
        machine_location: '',
        inact_start_time: '',
        inact_end_time: '',
        inact_type: '',
        inact_info: '',
        inact_start_emp: 0,
      }
    }
  },
  created() {
    //등록
    this.inActData.inact_start_time = this.getToday();  

  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
      this.deleteVal();
    },
    confirm() {
      this.inActData.inact_start_time = this.dateFormat(this.inActData.inact_start_time, 'yyyy-MM-dd hh:mm:ss');
      if(this.inActData.inact_end_time != ''){
        this.inActData.inact_end_time = this.dateFormat(this.inActData.inact_end_time, 'yyyy-MM-dd hh:mm:ss');
      }
      this.$emit('confirm', this.inActData);
      this.inActInsert();
    },
    deleteVal() {
      for(let key in this.inActData){
        this.inActData[key] = '';
      }
      this.inActData.inact_start_emp = 0;
    },

    // insert 동작
    async inActInsert(){
      let obj = {
        machine_num: this.inActData.machine_num,
        inact_start_time: this.inActData.inact_start_time,
        inact_type: this.inActData.inact_type,
        inact_info: this.inActData.inact_info,
        inact_start_emp: this.inActData.inact_start_emp,
      }
      if(this.inActData.inact_end_time != ''){
        obj.inact_end_time = this.inActData.inact_end_time;
      }

      let result = await axios.post(`${ajaxUrl}/inActs/inActInsert`, obj)
                              .catch(err => console.log(err));
      let addRes = result.data;
      if(addRes.inact_num > 0){
        alert('등록되었습니다.');
      }
    },

    // 날짜 관련
    getToday(){
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    }
  }
};
</script>

<style scoped lang="scss">
.modalRow > * {
  display: inline-block;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox  */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>