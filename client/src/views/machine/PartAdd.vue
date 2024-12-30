<!-- 부품 등록 및 수정 -->
<template>
  <ModalMachine @click.self="closeModal">
    <template v-slot:header>
      <h2 v-if="isUpdate">부품 수정</h2>
      <h2 v-else>부품 등록</h2>
    </template>
    
    <template v-slot:body>
      <div class="partInfo container-fluid py-4" v-bind="partInfo">
        <div class="row gy-2">

          <div class="row align-items-center">
              <div class="col-3">
                <label for="">설비선택</label>
              </div>
              <div class="col-9">
                <!-- <input class="form-control" type="text" id="" name="" v-model=""/> -->
              </div>
          </div>
  
          <div class="row gx-3 gy-2 align-items-center">
              <div class="col-3">
                <label for="machineType">설비목록</label>
              </div>
              <div class="col-9">
                <input class="form-control" type="text" id="machineType" name="machineType" v-model="partInfo.machine_type"/>
              </div>
          </div>
  
          <div class="row gx-3 gy-2 align-items-center">
              <div class="col-3">
                <label for="">부품이름</label>
              </div>
              <div class="col-9">
                <input class="form-control" type="text" id="" name="" v-model="partInfo.part_name"/>
              </div>
          </div>
  
          <div class="row gx-3 gy-2 align-items-center">
              <div class="col-3">
                <label for="">교체주기</label>
              </div>
              <div class="col-9">
                <input class="form-control" type="text" id="" name="" v-model="partInfo.replace_cycle"/>
              </div>
          </div>
  
          <div class="row gx-3 gy-2 align-items-center">
              <div class="col-3">
                <label for="">거래처</label>
              </div>
              <div class="col-9">
                <input class="form-control" type="text" id="" name="" v-model="partInfo.client_num"/>
              </div>
          </div>
  
          <div class="row gx-3 gy-2 align-items-center">
              <div class="col-3">
                <label for="">부품위치</label>
              </div>
              <div class="col-9">
                <input class="form-control" type="text" id="" name="" v-model="partInfo.part_location"/>
              </div>
          </div>
  
          <div class="row gx-3 gy-2 align-items-center">
              <div class="col-3">
                <label for="">구매날짜</label>
              </div>
              <div class="col-9">
                <input class="form-control" type="text" id="" name="" v-model="partInfo.buy_date"/>
              </div>
          </div>
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
        <a v-if="props.isUpdate">수정</a>
        <a v-else>등록</a>
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

<script setup>
import ModalMachine from "@/views/natureBlendComponents/modal/ModalMachine.vue";
import userDateUtils from "@/utils/useDates.js";
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import { ref, onBeforeMount, onUpdated , watch } from "vue";

// props
const props = defineProps({
  partNo: Number,
  isUpdate: Boolean,
});

// emit
const emit = defineEmits(['closeModal', 'confirm']);

// 마운트 전
onBeforeMount(() => {
  getSelectItem();
  
});

// 업데이트
onUpdated(() => {
  if(props.partNo > 0) {
    getPartInfo();
  }
})

// 변수
const partInfo = ref({
  machine_type: '',
  part_name: '',
  replace_cycle: '',
  client_num: '',
  part_location: '',
  buy_date: '',
})
const typeSelect = ref([]); // 설비 분류 선택
const fullInput = ref(true);


// 메소드
const getSelectItem = async () => {
  let result = await axios.get(`${ajaxUrl}/machine/machineType`)
                          .catch(err => console.log(err));
  typeSelect.value = result.data;
}

// 등록
const partInsert = async () => {
  let obj = {
    machine_type: partInfo.value.machine_type,
    part_name: partInfo.value.part_name,
    replace_cycle: partInfo.value.replace_cycle,
    client_num: partInfo.value.client_num,
    part_location: partInfo.value.part_location,
    buy_date: userDateUtils.dateFormat(partInfo.value.buy_date, 'yyyy-MM-dd')
  }

  let result = await axios.post(`${ajaxUrl}/parts/partInsert`, obj)
                          .catch(err => console.log(err));
  let addRes = result.data;

  // 등록 성공 체크
  if(addRes.part_num > 0){
    // 등록메시지 수정 예정
    alert('등록 성공');
    emit('confirm');
  } else {
    alert('등록 실패');
    emit('confirm');
  }
}

// 부품 정보
const getPartInfo = async () => {
  let result = await axios.get(`${ajaxUrl}/parts/partInfo/${props.partNo}`)
                          .catch(err => console.log(err));
  partInfo.value = result.data;
}
// 수정
const partUpdate = async () => {
  let obj = {
    machine_type: partInfo.value.machine_type,
    part_name: partInfo.value.part_name,
    replace_cycle: partInfo.value.replace_cycle,
    client_num: partInfo.value.client_num,
    part_location: partInfo.value.part_location,
    buy_date: userDateUtils.dateFormat(partInfo.value.buy_date, 'yyyy-MM-dd')
  }

  let result = await axios.put(`${ajaxUrl}/parts/partUpdate/${props.partNo}`, obj)
                          .catch(err => console.log(err));
  let updateRes = result.data;

  if(updateRes.result) {
    alert('수정 성공');
    emit('confirm');
  } else {
    alert('수정 실패');
    emit('confirm');
  }

}

function closeModal() {
  emit('closeModal');
  deleteVal();
}
function confirm() {
  if(props.isUpdate) {
    partUpdate();
  } else {
    partInsert();
  }
  deleteVal();
}
function deleteVal() {
  for(let key in partInfo.value){
    partInfo.value[key] = '';
  }
}


// 입력 확인
watch (
  partInfo.value,
  (newVal) => {
    let btnActive = true;
    for(let key in newVal) {
      if(newVal[key] == '') {
        // btnActive = false;
        break;
      }
    }
    fullInput.value = btnActive;
  },
  { deep: true }
)
</script>


<style scoped lang="scss">
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

.partInfo {
  padding-left: 29px;
}

</style>

