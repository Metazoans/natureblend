<template>
  <ModalMachine>
    <template v-slot:header>
      <h2 v-if="isUpdate">설비 수정</h2>
      <h2 v-else>설비 등록</h2>
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
          <input type="file" id="machineImg" name="machineImg" ref="image" @change="onFileChange"/>
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
                  v-model="machineData.process_code">
            <option
              v-for="item in typeSelect"
              :key="item.process_code"
              :value="item.process_code"
            >
              {{ item.machine_type }}
            </option>
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
  props: {
    machineNo: Number,
    isUpdate: Boolean,
  },
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
        client_num: '',
        machine_location: '',
        uph: '',
        buy_date: '',
        
        // 자동
        emp_num: 0,
        process_code: '0',
      },
      typeSelect: [], // 설비 분류 객체
      isInsert: false, // 등록 성공 여부,
    }
  },
  beforeMount() {
    // 설비 분류 및 거래처 정보 가져오기
    this.getSelectItem();
    
  },
  updated() {
    // update 여부 확인
    if(this.machineNo > 0) {
      //수정
      this.getMachineInfo(this.machineNo);
    }
  },
  methods: {
    // 선택지 정보 가져오기
    async getSelectItem() {
      let result = await axios.get(`${ajaxUrl}/machine/machineType`)
                              .catch(err => console.log(err));
      this.typeSelect = result.data;
    },

    // file binding
    onFileChange() {
      console.log('들어왔다');
      let image = this.$refs['image'].files[0];

      const url = URL.createObjectURL(image);
      this.image = url;
      console.log(url);
      console.log(this.image);
      this.machineData.machine_img = this.image + '';
    },
    // 이미지 바인딩 : <img v-bind:src="imgSrc" />

    // 모달 동작
    closeModal() {
      this.$emit('closeModal');
      this.deleteVal();
    },
    confirm() {
      this.machineData.buy_date = this.dateFormat(this.machineData.buy_date, 'yyyy-MM-dd hh:mm:ss');

      if(this.isUpdate) {
        this.machineUpdate();
      }
      else {
        this.machineInsert();
        this.deleteVal();
      }
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
      console.log('이미지 등록 : ', this.machineData.machine_img);

      let obj = {
        machine_name: this.machineData.machine_name,// 설비 이름
        machine_img: this.machineData.machine_img,  // 설비 이미지
        machine_state: this.machineData.machine_state,// 사용 여부
        model_num: this.machineData.model_num,      // 모델 번호
        client_num: Number(this.machineData.client_num),    // 거래처
        uph: this.machineData.uph,                  // 시간당 생산량
        machine_location: this.machineData.machine_location,// 설비 위치
        buy_date: this.machineData.buy_date,
        process_code: this.machineData.process_code,
        
        // 자동
        emp_num: 0     // 등록자
      }

      obj.upd = Number(this.machineData.uph) * 24;     // uph * 24

      if(this.machineData.machine_state == 'run'){
        obj.install_date = this.machineData.buy_date;
      }

      let result = await axios.post(`${ajaxUrl}/machine/machineInsert`, obj)
                              .catch(err => console.log(err));
      let addRes = result.data;

      // 등록 성공 체크
      if(addRes.machine_num > 0){
        // 등록메시지 수정 예정
        alert('등록 성공');
        this.isInsert = true;
        this.$emit('confirm', this.isInsert);
      } else {
        alert('등록 실패');
        this.$emit('confirm', this.isInsert);
      }
    },

    // 설비 데이터 가져오기
    async getMachineInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machineInfo/${selectNo}`)
                              .catch(err => console.log(err));
      this.machineData = result.data;
      this.machineData.buy_date = this.dateFormat(this.machineData.buy_date, 'yyyy-MM-dd hh:mm:ss');
    },
    // update
    async machineUpdate() {
      console.log('이미지 수정 : ', this.machineData.machine_img);

      let obj = {
        machine_name: this.machineData.machine_name,// 설비 이름
        machine_img: this.machineData.machine_img,  // 설비 이미지
        machine_state: this.machineData.machine_state,// 사용 여부
        model_num: this.machineData.model_num,      // 모델 번호
        client_num: Number(this.machineData.client_num),    // 거래처
        uph: this.machineData.uph,                  // 시간당 생산량
        machine_location: this.machineData.machine_location,// 설비 위치
        buy_date: this.machineData.buy_date,
        process_code: this.machineData.process_code,
        
        // 자동
        emp_num: this.machineData.emp_num
      }
      
      obj.upd = Number(this.machineData.uph) * 24;     // uph * 24

      if(this.machineData.machine_state == 'run'){
        obj.install_date = this.machineData.buy_date;
      }
      
      let result = await axios.put(`${ajaxUrl}/machine/machineUpdate/${this.machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      if(updateRes.result) {
        alert('수정 성공');
        this.$emit('confirm');
      } else {
        alert('수정 실패');
        this.$emit('confirm');
      }
    },

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
