<template>
  <ModalMachine @click.self="closeModal" :modalSize="modalSize">
    <template v-slot:header>
      <h2 v-if="isUpdate">설비 수정</h2>
      <h2 v-else>설비 등록</h2>
    </template>
    
    <template v-slot:body>
      <div class="container-fluid py-4">
        <div class="machineBody row gy-3" v-bind="machineData">
          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="machineName">설비 이름</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="text" id="machineName" name="machineName" v-model="machineData.machine_name"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="machineImg">설비 이미지</label>
            </div>
            <div class="col-6" style="text-align: left;">
              <input type="file" id="machineImg" name="machineImg" @change="uploadImage"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <label class="col-sm-2 col-form-label">사용 여부</label>
            <div class="col-sm-6" style="text-align: left;">
              <label v-for="status in statusList" :key="status" class="me-3">
                {{ status }}
                <input
                  type="radio"
                  name="status"
                  :value="status"
                  v-model="machineData.machine_state"
                />
              </label>
            </div>

          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="modelNum">모델 번호</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="text" id="modelNum" name="modelNum" v-model="machineData.model_num"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <a>설비 분류</a>
            </div>
            <div class="col-3">
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
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <a>제작 업체</a>
            </div>
            <div class="col-3">
              <select class="form-select" aria-label="Default select example"
                      v-model="machineData.client_num">
                <option value="1">거래처1</option>
                <option value="2">거래처2</option>
                <option value="3">거래처3</option>
              </select>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="uph">UPH</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="number" id="uph" name="uph" v-model="machineData.uph"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="machineLocation">설비 위치</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="text" id="machineLocation" name="machineLocation" v-model="machineData.machine_location"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="empNum">등록자</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="number" id="empNum" name="empNum" v-model="machineData.emp_num"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="buyDate">구매 일자</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="datetime-local" id="buyDate" name="buyDate" v-model="machineData.buy_date" v-bind:readonly="isUpdate"/>
            </div>
          </div>

          <!-- 부품 추가 버튼 -->
          <div>
            <button
              class="btn bg-gradient-warning mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="partNum++"
              v-if="partNum == 0"
            >
              부품 추가
            </button>
          </div>

        </div>

        <div v-for="i in partNum" :key="i">
          <MachineParts 
            :partDataList="partDataList" 
            :rowNum="i" 
            :lastNum="partNum" 
            @add="addClicked" 
            @del="delClicked" 
            @chInput="partInput">
          </MachineParts>
        </div>

      </div>
    </template>
    
    <template v-slot:footer>

      <button
        class="btn btn-success w-100 mb-0 toast-btn"
        type="button"
        data-target="warningToast"
        @click="confirm"
        v-bind:disabled="!fullInput"
      >
        <a v-if="isUpdate" style="color: white;">수정</a>
        <a v-else style="color: white;">등록</a>
      </button>

      <button
        class="btn btn-danger w-100 mb-0 toast-btn"
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
import MachineParts from "@/views/machine/MachineParts.vue";
import userDateUtils from "@/utils/useDates.js";
import { ajaxUrl, localUrl } from '@/utils/commons.js';
import axios from 'axios';

export default {
  name: "MachineManage",

  props: {
    machineNo: Number,
    isUpdate: Boolean,
  },
  components: {
    ModalMachine,
    MachineParts,
  },
  data() {
    return {
      modalSize: 'modal-lg',
      localUrl: localUrl,
      imgUrlTest: '',
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
        process_code: '',
        
        // 자동
        emp_num: 0,
      },
      statusList: ["사용", "미사용"], // 작동 상태 옵션
      typeSelect: [], // 설비 분류 객체
      isInsert: false, // 등록 성공 여부,
      fullInput: false,
      imagePreview: null,


      // 부품 데이터
      partNum: 0,
      partDataList: [],
      emptyData: {
        partName: '',
        yearCycle: 0,
        monthCycle: 0,
        dayCycle: 0,
      },
    }
  },
  beforeMount() {
    // 설비 분류 및 거래처 정보 가져오기
    this.getSelectItem();

    this.createPartsData();
  },
  updated() {
    // update 여부 확인
    if(this.machineNo > 0) {
      //수정
      this.getMachineInfo(this.machineNo);
    }
    this.machineData.buy_date = this.getToday();


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
      console.log('confirm 동작 : ', this.machineData);
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
      this.machineData.machine_state = 'run';
      this.machineData.emp_num = 0;
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
        emp_num: this.machineData.emp_num     // 등록자
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

    // 부품 관련
    addClicked() {
      if(this.partNum < 4) {
          this.partNum++;
      } else {
        alert('최대 부품 수입니다.');
      }
    },
    async delClicked(row) {
      let newArray = [...this.partDataList];

      newArray.splice(row-1, 1);
      newArray.length = 4;
      newArray[3] = {...this.emptyData};

      this.partDataList = newArray;
      this.partNum--;
    },
    partInput(row, data) { // 부품 정보 입력 감지 => 자식 컴포넌트에서 입력된 값을 객체 배열에 저장
      this.partDataList[row-1] = data;
    },
    createPartsData() { // 빈 객체 배열 생성(beforeMount시 작동)
      this.partDataList.length = 4;
      for(let i = 0; i < 4; i++) {
        this.partDataList[i] = {...this.emptyData};
      }
    },



    // 날짜 관련
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    // 이미지 관련
    async uploadImage(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('machineImg', file);
      
      formData.append('previousImgPath', this.machineData.machine_img); // 기존 이미지 경로

      try {
        const response = await axios.post(`${ajaxUrl}/machine/uploadImg`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('가져온 경로 : ', response.data.filePath);
        this.machineData.machine_img = response.data.filePath;
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }

      console.log('저장한 값 : ', this.machineData.machine_img);
    },

  },
  // 유효성 체크 : 설비 이름, 모델 번호, 설비 분류, 제작업체, uph, 설비 위치, 등록자
  watch: {
    machineData: {
      handler(newVal) {
        let btnActive = true;
        for(let key in newVal) {
          if(newVal[key] == '') {
            btnActive = false;
            break;
          }
        }
        this.fullInput = btnActive;
      },
      deep: true
    },
    partDataList: {
      handler(newVal) {
        let btnActive = true;
        for(let i in newVal) {
          for(let key in newVal[i]) {
            if(newVal[key] == '') {
              btnActive = false;
              break;
            }
          }
        }
        this.fullInput = btnActive;
      },
      deep: true
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

/* 일반 input 태그 스타일 */
input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px #ced4da; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}

button {
  width: 100px !important;
}

.machineBody {
  padding-left: 29px;
}

</style>
