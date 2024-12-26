<!-- 부품 등록 및 수정 -->
<template>
  <ModalMachine>
    <template v-slot:header>
      <h2 v-if="isUpdate">부품 수정</h2>
      <h2 v-else>부품 등록</h2>
    </template>
    
    <template v-slot:body>
      <div class="partInfo" v-bind="partInfo">
        <div class="modalRow">
          <label for="">설비선택</label>
          <!-- <input type="text" id="" name="" v-model=""/> -->
        </div>

        <div class="modalRow">
          <label for="machineType">설비목록</label>
          <input type="text" id="machineType" name="machineType" v-model="partInfo.machine_type"/>
        </div>

        <div class="modalRow">
          <label for="">부품이름</label>
          <input type="text" id="" name="" v-model="partInfo.part_name"/>
        </div>

        <div class="modalRow">
          <label for="">교체주기</label>
          <input type="text" id="" name="" v-model="partInfo.replace_cycle"/>
        </div>

        <div class="modalRow">
          <label for="">거래처</label>
          <input type="text" id="" name="" v-model="partInfo.client_num"/>
        </div>

        <div class="modalRow">
          <label for="">부품위치</label>
          <input type="text" id="" name="" v-model="partInfo.part_location"/>
        </div>

        <div class="modalRow">
          <label for="">구매날짜</label>
          <input type="text" id="" name="" v-model="partInfo.buy_date"/>
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
        <a v-if="props.isUpdate">수정</a>
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

// 모달 동작
const emit = defineEmits(['closeModal', 'confirm']);
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



