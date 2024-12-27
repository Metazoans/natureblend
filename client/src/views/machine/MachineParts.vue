<template>
  <div class="container-fluid py-4">
    <div class="row gx-3 gy-2 align-items-center"> <!-- 부품 이름, 교체 주기(년/월/일) -->
      <div class="col-3">
        <div class="row">
          <label for="" class="col-md-auto">부품이름</label>
          <input type="text" class="col" v-model="partInfo.partName">
        </div>
      </div>

      <div class="col-8">
        <div class="row">
          <label for="" class="col-md-auto">교체주기</label>
          <div class="col">
            <div class="row">
              <input type="number" class="col" v-model="partInfo.yearCycle">
              <label for="" class="col">년</label>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <input type="number" class="col" v-model="partInfo.monthCycle">
              <label for="" class="col">월</label>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <input type="number" class="col" v-model="partInfo.dayCycle">
              <label for="" class="col">일</label>
            </div>
          </div>
        </div>
      </div>

      <div class="col" v-if="props.rowNum == props.lastNum">
        <button @click="addBtn"> + </button>
        <button @click="delBtn"> - </button>
      </div>
      <div class="col" v-else>
        <button @click="delBtn"> x </button>
      </div>
    </div>

  </div>
</template>

<script setup>

import { ref, onUpdated , watch } from 'vue';


// props
const props = defineProps({
  partDataList: Array,
  rowNum: Number,
  lastNum: Number,
});

onUpdated (() => {
  partInfo.value = props.partDataList[props.rowNum - 1];
})

// emit
const emit = defineEmits(['add', 'del', 'chInput']);

// 추가 제거 버튼
const addBtn = () => {
  emit('add');
}
const delBtn = () => {
  emit('del', props.rowNum);
}

// 입력 데이터
const partInfo = ref({
  partName: '',
  yearCycle: 0,
  monthCycle: 0,
  dayCycle: 0,
});

watch (
  partInfo.value,
  (newVal) => {
    emit('chInput', props.rowNum, newVal);
  },
  { deep: true }
)


</script>

