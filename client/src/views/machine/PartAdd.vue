<!-- 부품 등록 및 수정 -->
<template>
  <ModalMachine @click.self="closeModal">
    <template v-slot:header>
      <h1 class="modal-title fs-5" v-if="isUpdate">부품 수정</h1>
      <h1 class="modal-title fs-5" v-else>부품 등록</h1>
    </template>
    
    <template v-slot:body>
      <div class="partInfo container-fluid py-4" v-bind="partInfo">
        <div class="row gy-2">

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-3">
              <label class="">설비선택</label>
            </div>
            <div class="col-9">
              <label class="me-3" v-for="type in machineType" :key="type">
                {{ type }}
                <input
                  class="form-check-input"
                  :value="type"
                  type="checkbox"
                  v-model="pickedType"
                >
              </label>
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
                <input class="form-control" type="text" id="" name="" v-model="partInfo.client_num" @click="openClientModal('client')" readonly/>
              </div>
              
              <Modal
                  :isShowModal="isShowModal.client"
                  :modalTitle="'거래처선택'"
                  :noBtn="'닫기'"
                  :yesBtn="'선택'"
                  @closeModal="closeClientModal('client')"
                  @confirm="confirmClientModal('client')"
              >
                  <template v-slot:list>
                      <ComList v-show="isShowModal.client" @selectclient="selectclient"/>
                  </template>
              </Modal>
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
                <input class="form-control" type="date" id="" name="" v-model="partInfo.buy_date"/>
              </div>
          </div>
        </div>

      </div>
    </template>
    
    <template v-slot:footer>
      <button
        class="btn btn-secondary w-100 mb-0 toast-btn"
        type="button"
        data-target="warningToast"
        @click="closeModal"
      >
        닫기
      </button>
      <button
        class="btn btn-success w-100 mb-0 toast-btn"
        type="button"
        data-target="warningToast"
        @click="confirm"
        :disabled="!fullInput || !checkJob"
      >
        <a v-if="props.isUpdate">수정</a>
        <a v-else>등록</a>
      </button>
    </template>
  </ModalMachine>

</template>

<script setup>
import ModalMachine from "@/views/natureBlendComponents/modal/ModalMachine.vue";
import userDateUtils from "@/utils/useDates.js";
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import { ref, onUpdated } from "vue";
import { useStore } from 'vuex';
import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다

import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/machine/clientModal.vue";


//거래처 모달 
const searchCom = ref(""); // 저장 될 거래처 명 
const selectedCom = ref(""); //선택된 거래처 명

const isShowModal = ref({
  client: false,
})
// 거래처 모달
function selectclient(client){
    selectedCom.value = client.com_name; 
    partInfo.value.client_num = client.client_num;
};
function openClientModal(modalType,index) {
    isShowModal.value[modalType] = true; 
    this.indexNum = index; //현재 선택된 index
};
function confirmClientModal(modalType){
    if (modalType === 'client') {
    searchCom.value = selectedCom.value;
  } 

  this.closeClientModal(modalType); // 모달 닫기
};
function closeClientModal(modalType) {
    this.isShowModal[modalType] = false;
};


const store = useStore();
const checkJob = ref(
  store.state.loginInfo.job == '설비' ? true : store.state.loginInfo.position == '관리자' ? true : false
);

// props
const props = defineProps({
  partNo: Number,
  isUpdate: Boolean,
});

// emit
const emit = defineEmits(['closeModal', 'confirm']);

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
const fullInput = ref(true);


// 메소드
const machineType = ["세척기기", "음료제작기기", "포장기기"];
const pickedType = ref([]);

const { notify } = useNotification();  // 노티 내용변수입니다

// 등록
const partInsert = async () => {
  for(let i in pickedType.value) {
    if(pickedType.value[i] == '세척기기') {
      partInfo.value.machine_type += 'p1';
    } else if(pickedType.value[i] == '음료제작기기') {
      partInfo.value.machine_type += 'p2';
    } else if(pickedType.value[i] == '포장기기') {
      partInfo.value.machine_type += 'p3';
    }
    if((Number(i) + 1) < pickedType.value.length) {
      partInfo.value.machine_type += ' / ';
    }
  }

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
    notify({
      text: "부품 등록이 성공했습니다.",
      type: 'success',
    });
    emit('confirm');
  } else {
    notify({
      text: "부품 등록이 실패했습니다.",
      type: 'error',
    });
    emit('confirm');
  }
}

// 부품 정보
const getPartInfo = async () => {
  let result = await axios.get(`${ajaxUrl}/parts/partInfo/${props.partNo}`)
                          .catch(err => console.log(err));
  partInfo.value = result.data;
  partInfo.value.machine_type = '';
}
// 수정
const partUpdate = async () => {
  for(let i in pickedType.value) {
    if(pickedType.value[i] == '세척기기') {
      partInfo.value.machine_type += 'p1';
    } else if(pickedType.value[i] == '음료제작기기') {
      partInfo.value.machine_type += 'p2';
    } else if(pickedType.value[i] == '포장기기') {
      partInfo.value.machine_type += 'p3';
    }
    if((Number(i) + 1) < pickedType.value.length) {
      partInfo.value.machine_type += ' / ';
    }
  }

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
    notify({
      text: "부품 수정이 성공했습니다.",
      type: 'success',
    });
    emit('confirm');
  } else {
    notify({
      text: "부품 수정이 실패했습니다.",
      type: 'error',
    });
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
// watch (
//   partInfo.value,
//   (newVal) => {
//     let btnActive = true;
//     for(let key in newVal) {
//       if(newVal[key] == '') {
//         // btnActive = false;
//         break;
//       }
//     }
//     fullInput.value = btnActive;
//   },
//   { deep: true }
// )
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

