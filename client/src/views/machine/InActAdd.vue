
<template>
  <ModalMachine>
    <template v-slot:header>
      <h2>비동기 내역 등록</h2>
    </template>
    <template v-slot:body>
      <div class="inactBody" v-bind="inActData">
        <div class="modalRow">
          <!-- 템플릿 input 컴포넌트 사용시 update:value 메소드 생성해야함 임시로 input 사용 -->
          <!-- <material-input id="text" placeholder="" @update:value="inputNum" /> -->
          <label for="machineNum">설비 번호</label>
          <input type="number" id="machineNum" name="machineNum"
                 v-model.number="inActData.machine_num" :readonly="machineCheck"/>
        </div>

        <div class="modalRow">
          <label for="machineName">설비 이름</label>
          <input type="text" id="machineName" name="machineName"
                 v-model="inActData.machine_name" :readonly="machineCheck"/>
        </div>

        <div class="modalRow">
          <label for="machineLocation">설비 위치</label>
          <input type="text" id="machineLocation" name="machineLocation"
                 v-model="inActData.machine_location" :readonly="machineCheck"/>
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
          v-bind:disabled="!fullInput"
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
  </ModalMachine>

</template>


<script>
import ModalMachine from "@/views/natureBlendComponents/modal/ModalMachine.vue";
import userDateUtils from "@/utils/useDates.js";
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';

export default {
  name: "inActAdd",
  props: {
    machineNo: Number,
  },
  components: {
    ModalMachine,
  },
  data() {
    return {
      inActData: {
        machine_num: '',
        machine_name: '',
        machine_location: '',
        inact_start_time: '',
        inact_end_time: '', // null 허용
        inact_type: '',
        inact_info: '', // type이 기타인 경우만 체크
        inact_start_emp: 1, // 현재 작업자
        inact_end_emp: 0,
      },

      // 설비 정보 확인
      machineCheck: false,
      machineData: {},

      fullInput: false,
      isInsert: false,
    }
  },
  updated() {
    this.inActData.inact_start_time = this.getToday();
    
    // 설비 번호 있는 경우
    if(this.machineNo > 0) {

      this.machineCheck = true;
      this.getMachinData();
    }
  },
  methods: {
    async getMachinData() {
      let result = await axios.get(`${ajaxUrl}/machine/machineInfo/${this.machineNo}`)
                              .catch(err => console.log(err));
      this.machineData = result.data;

      this.inActData.machine_num = this.machineNo;
      this.inActData.machine_name = this.machineData.machine_name;
      this.inActData.machine_location = this.machineData.machine_location;

    },

    // 버튼
    closeModal() {
      this.$emit('closeModal');
      this.deleteVal();
    },
    confirm() {
      this.inActData.inact_start_time = this.dateFormat(this.inActData.inact_start_time, 'yyyy-MM-dd hh:mm:ss');
      if(this.inActData.inact_end_time != ''){
        this.inActData.inact_end_time = this.dateFormat(this.inActData.inact_end_time, 'yyyy-MM-dd hh:mm:ss');
      }
      this.$emit('confirm');
      this.inActInsert();
      this.deleteVal();
    },

    // 모달 데이터 삭제
    deleteVal() {
      for(let key in this.inActData){
        this.inActData[key] = '';
      }
      this.inActData.inact_start_emp = 0;
      this.inActData.inact_end_emp = 0;
    },

    // insert 동작
    async inActInsert() {
      let obj = {
        machine_num: this.inActData.machine_num,
        inact_start_time: this.inActData.inact_start_time,
        inact_type: this.inActData.inact_type,
        inact_info: this.inActData.inact_info,
        inact_start_emp: this.inActData.inact_start_emp,
      }
      if(this.inActData.inact_end_time != ''){
        obj.inact_end_time = this.inActData.inact_end_time;
        obj.inact_end_emp = this.inActData.inact_start_emp;
      }

      let result = await axios.post(`${ajaxUrl}/inActs/inActInsert`, obj)
                              .catch(err => console.log(err));
      let addRes = result.data;
      if(addRes.inact_num > 0){
        alert('등록 성공');
        this.inActUpdate();
        this.isInsert = true;
        this.$emit('confirm', this.isInsert);
      } else {
        alert('등록 실패');
      }
    },

    // 비가동으로 변경
    async inActUpdate() {
      let obj = {
        machine_state: 'stop',
      }
      
      let result = await axios.put(`${ajaxUrl}/machine/machineUpdate/${this.machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      if(updateRes.result) {
        console.log('수정 성공');
      } else {
        console.log('수정 실패');
      }
    },

    
    // 날짜 관련
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    }
  },
  watch: {
    // 유효성 체크
    inActData: {
      handler(newVal) {
        let btnActive = true;
        for(let key in newVal) {
          // console.log(key);
          switch(key) {
            case 'inact_end_time':
              break;
            case 'inact_end_emp':
              break;
            case 'inact_info':
              if(newVal['inact_type'] == '기타' && newVal[key] == '') btnActive = false;
              break;
            default:
              // console.log('공백 체크 : ', key);
              
              if(newVal[key] == '') btnActive = false;
          }
        }
        this.fullInput = btnActive;
      },
      deep: true
    },
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