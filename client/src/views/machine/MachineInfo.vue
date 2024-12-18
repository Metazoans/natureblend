<!-- 설비 상세 페이지 machine/machineInfo -->
<!--
설비 이름(설비 위치) machine_name(machine_location)
설비 이미지 machine_img
모델 번호
설비 분류
작동 상태
제작 업체
등록자
구매 일자
UPH

일 평균 생산량
일 평균 불량률
공정 번호
공정 이름
생산 품목

--부품 목록
-->
<template>
  <div class="container">
    <!-- 설비 이름(설비 위치) / 설비 수정 버튼 / 설비 제거 버튼 -->
    <div class="row">
      <div class="col-6">
        <h3>{{ machineData.machine_name }}({{ machineData.machine_location }})</h3>
      </div>
      <div class="col-2">
        <button
          class="btn bg-gradient-warning w-100 mb-0 toast-btn"
          type="button"
          data-target="warningToast"
          style="margin: 5px;"
        >
          설비 수정
        </button>
      </div>
      <div class="col-2">
        <button
          class="btn bg-gradient-warning w-100 mb-0 toast-btn"
          type="button"
          data-target="warningToast"
          style="margin: 5px;"
        >
          설비 제거
        </button>
      </div>
    </div>

    <!-- 이미지 / 설비 정보 항목-->
    <div class="row">
      <!-- 설비 이미지 -->
      <div class="col-3">
        이미지
        {{ machineData.machine_img }}
      </div>

      <!-- 설비 정보 항목 -->
      <div class="col-9">
        <div class="row">
          <div class="col">
            모델 번호 : 
            {{ machineData.model_num }}
          </div>
          <div class="col">
            설비 분류 : 
            {{ machineData.machine_type }}
          </div>
          <div class="col">
            작동 상태 : 
            {{ machineData.machine_state }}
          </div>
        </div>
        
        <div class="row">
          <div class="col">
            제작 업체 : 
            {{ machineData.client_num }}
          </div>
          <div class="col">
            등록자 : 
            {{ machineData.emp_num }}
          </div>
          <div class="col">
            구매 일자 : 
            {{ machineData.buy_date }}
          </div>
        </div>
        
        <div class="row">
          <div class="col">
            UPH : 
            {{ machineData.uph }}
          </div>
          <div class="col" v-if="machinePrdData.success_sum != null">
            생산량 : 
            {{ (machinePrdData.success_sum / machinePrdData.hour_sum) * 24 }}
          </div>
          <div class="col" v-else>
            {{ machineData.upd }}
          </div>
          <div class="col" v-if="machinePrdData.success_sum != null">
            불량률 : 
            {{ (machinePrdData.fail_sum / (machinePrdData.success_sum + machinePrdData.fail_sum)) * 100 }}%
          </div>
          <div class="col" v-else>
            {{ 0 }}%
          </div>
        </div>
      </div>
    </div>


    <!-- 부품 정보 -->
    <div class="row">
      부품 정보
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

// machine_name,
// machine_location,
// machine_img,
// model_num,
// machine_type,
// machine_state,
// client_num,
// emp_num,
// buy_date,
// uph

// const machinePrdInfo = shallowRef([]);
// success_sum,
// fail_sum,
// hour_sum

export default {
  name: "machineInfo",
  setup() {
  },

  data() {
    return {
      machineData: {},
      machinePrdData: {},
    }
  },
  beforeMount() {
    let selectNo = this.$route.params.mno;
    this.getMachineInfo(selectNo);
    this.getMachinePrdInfo(selectNo);
  },
  methods: {
    async getMachineInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machineInfo/${selectNo}`)
                              .catch(err => console.log(err));
      this.machineData = result.data;
      console.log(this.machineData);
    },
    async getMachinePrdInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machinePrdInfo/${selectNo}`)
                              .catch(err => console.log(err));
      this.machinePrdData = result.data;
      console.log(this.machinePrdData);
    },

  }
}
</script>
