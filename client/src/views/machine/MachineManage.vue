<template>
  <ModalMachine>
    <template v-slot:header>
      <h2>설비 등록 및 수정</h2>
    </template>
    
    <template v-slot:body>
      <div class="machineBody" v-bind="machineData">
        <div class="modalRow">
          <label for="machineName">설비 이름</label>
          <input type="text" id="machineName" name="machineName" v-model="machineData.machine_name"/>
        </div>

        <!-- 이미지 안들어감 input file 데이터 바인딩 수정 필요 -->
        <div class="modalRow">
          <label for="machineImg">설비 이미지</label>
          <input type="file" id="machineImg" name="machineImg" v-bind:src="machineData.machine_img"/>
        </div>

        <div class="modalRow">
          <a for="machineState">사용 여부</a>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="machineState" id="machineState1"
                   value="run" v-model="machineData.machine_state" checked>
            <label class="form-check-label" for="flexRadioDefault1">사용</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="machineState" id="machineState2"
                   value="stop" v-model="machineData.machine_state">
            <label class="form-check-label" for="flexRadioDefault2">미사용</label>
          </div>
        </div>

        <div class="modalRow">
          <label for="modelNum">모델 번호</label>
          <input type="text" id="modelNum" name="modelNum" v-model="machineData.model_num"/>
        </div>

        <div class="modalRow">
          <a>설비 분류</a>
          <select class="form-select" aria-label="Default select example"
                  v-model="machineData.machine_type">
            <option value="세척기">세척기</option>
            <option value="음료제작기">음료제작기</option>
            <option value="포장기">포장기</option>
          </select>
        </div>

        <div class="modalRow">
          <a>제작 업체</a>
          <select class="form-select" aria-label="Default select example"
                  v-model="machineData.client_num">
            <option value="1">거래처1</option>
            <option value="2">거래처2</option>
            <option value="3">거래처3</option>
          </select>
        </div>

        <div class="modalRow">
          <label for="uph">UPH</label>
          <input type="number" id="uph" name="uph" v-model="machineData.uph"/>
        </div>

        <div class="modalRow">
          <label for="machineLocation">설비 위치</label>
          <input type="text" id="machineLocation" name="machineLocation" v-model="machineData.machine_location"/>
        </div>

        <div class="modalRow">
          <label for="empNum">등록자</label>
          <input type="number" id="empNum" name="empNum" v-model="machineData.emp_num"/>
        </div>

        <div class="modalRow">
          <label for="buyDate">구매 일자</label>
          <input type="datetime-local" id="buyDate" name="buyDate" v-model="machineData.buy_date"/>
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
        <a v-if="isUpdate">수정</a>
        <a v-else>등록</a>
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
  name: "MachineManage",
  components: {
    ModalMachine,
  },
  data() {
    return {
      machineData: {
        // 입력
        machine_name: '',
        machine_img: '',
        model_num: '',
        machine_state: 'run',
        machine_type: '',
        client_num: '',
        machine_location: '',
        uph: '',
        buy_date: '',
        
        // 자동
        emp_num: 0,
        process_code: '0',
      },
      isUpdate: false, // 수정페이지 체크
      typeSelect: [], // 설비 분류 객체
    }
  },
  created() {
    // 설비 분류 및 거래처 정보 가져오기
    

    // update 여부 확인
    let selectNo = this.$route.query.mno;
    if(selectNo > 0) {
      //수정
      this.getMachineInfo(selectNo)    
      this.isUpdated = true;      
    }
  },
  methods: {
    // 선택지 정보 가져오기
    async getSelectItem() {
      let result = await axios.get(`${ajaxUrl}/machine/machineType`)
                              .catch(err => console.log(err));
      this.typeSelect = result.data;
    },

    // 모달 동작
    closeModal() {
      this.$emit('closeModal');
      this.deleteVal();
    },
    confirm() {
      this.machineData.buy_date = this.dateFormat(this.machineData.buy_date, 'yyyy-MM-dd hh:mm:ss');
      this.$emit('confirm', this.machineData);
      this.machineInsert();
    },
    deleteVal() {
      for(let key in this.machineData){
        this.machineData[key] = '';
      }
      this.machineData.emp_num = 0;
      this.machineData.process_code = '0';
    },

    // insert
    async machineInsert(){
      let obj = {
        machine_name: this.machineData.machine_name,// 설비 이름
        machine_img: this.machineData.machine_img,  // 설비 이미지
        machine_state: this.machineData.machine_state,// 사용 여부
        model_num: this.machineData.model_num,      // 모델 번호
        //machine_type: this.machineData.machine_type,// 설비 분류
        client_num: Number(this.machineData.client_num),    // 거래처
        uph: this.machineData.uph,                  // 시간당 생산량
        machine_location: this.machineData.machine_location,// 설비 위치
        buy_date: this.machineData.buy_date,
        
        // 자동
        emp_num: 0,     // 등록자
        process_code: '0',// 설비 분류 기반
      }

      obj.upd = Number(this.machineData.uph) * 24;     // uph * 24

      if(this.machineData.machine_state == 'run'){
        obj.install_date = this.machineData.buy_date;
      }

      let result = await axios.post(`${ajaxUrl}/machine/machineInsert`, obj)
                              .catch(err => console.log(err));
      let addRes = result.data;
      if(addRes.machine_num > 0){
        alert('등록되었습니다.');
      }
    },

    // update 기존 데이터
    async getMachineInfo(selectNo) {
      console.log('설비 정보 가져오기');
      console.log(selectNo);
    },

    // update

    // 날짜 관련
    getToday() {
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
