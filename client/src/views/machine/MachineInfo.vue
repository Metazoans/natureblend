<!-- 설비 상세 페이지 machine/machineInfo -->
<template>
  <div class="container py-4">
    <!-- 설비 이름(설비 위치) / 설비 수정 버튼 / 설비 제거 버튼 -->
    <div class="row align-items-center" style="justify-content: space-between;">
      <div class="col-auto mname">
        <h3>{{ machineData.machine_name }}({{ machineData.machine_location }})</h3>
      </div>

      <div class="col-auto">
        <div class="row">
          <div class="col">
            <button
              class="btn btn-success w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="machineUpdate"
              style="margin: 5px;"
            >
              설비 수정
            </button>
          </div>
          <div class="col">
            <button
              class="btn btn-danger w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="machineDelete"
              style="margin: 5px;"
            >
              설비 제거
            </button>
          </div>
        </div>
      </div>

    </div>

    <MachineManage
      :isShowModal="isShowModal"
      :machineNo="machineNo"
      :isUpdate="true"
      @closeModal="closeModal"
      @confirm="confirmModal"
    />
      
    <!-- 이미지 / 설비 정보 항목-->
    <div class="row">
      <!-- 설비 이미지 -->
      <div class="col-3 mimg">
        <img v-if="machineData.machine_img" :src="`http://localhost:3000${machineData.machine_img}`" />
      </div>

      <!-- 설비 정보 항목 -->
      <div class="col-9 mdata">
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
            생산량 : 
            {{ machineData.upd }}
          </div>
          <div class="col" v-if="machinePrdData.success_sum != null">
            불량률 : 
            {{ (machinePrdData.fail_sum / (machinePrdData.success_sum + machinePrdData.fail_sum)) * 100 }}%
          </div>
          <div class="col" v-else>
            불량률 : 
            {{ 0 }}%
          </div>
        </div>
      </div>
    </div>


    <!-- 부품 정보 -->
    <div class="row">
      <div class="col pinfo" v-if="machinePartList.length >= 1">
        <div>부품명 : {{ machinePartList[0].part_name }}</div>
        <div>설치 일자 : {{ dateFormat(machinePartList[0].replace_date, 'yyyy-MM-dd') }}</div>
        <div>다음 교체일 : {{ replaceDate(machinePartList[0].replace_date, machinePartList[0].replace_cycle) }}</div>
      </div>
      <div class="col pinfo" v-if="machinePartList.length >= 2">
        <div>부품명 : {{ machinePartList[1].part_name }}</div>
        <div>설치 일자 : {{ dateFormat(machinePartList[1].replace_date, 'yyyy-MM-dd') }}</div>
        <div>다음 교체일 : {{ replaceDate(machinePartList[1].replace_date, machinePartList[1].replace_cycle) }}</div>
      </div>
    </div>
    <div class="row">
      <div class="col pinfo" v-if="machinePartList.length >= 3">
        <div>부품명 : {{ machinePartList[2].part_name }}</div>
        <div>설치 일자 : {{ dateFormat(machinePartList[2].replace_date, 'yyyy-MM-dd') }}</div>
        <div>다음 교체일 : {{ replaceDate(machinePartList[2].replace_date, machinePartList[2].replace_cycle) }}</div>
      </div>
      <div class="col pinfo" v-if="machinePartList.length >= 4">
        <div>부품명 : {{ machinePartList[3].part_name }}</div>
        <div>설치 일자 : {{ dateFormat(machinePartList[3].replace_date, 'yyyy-MM-dd') }}</div>
        <div>다음 교체일 : {{ replaceDate(machinePartList[3].replace_date, machinePartList[3].replace_cycle) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from "@/utils/useDates.js";
import MachineManage from "./MachineManage.vue";

export default {
  name: "machineInfo",
  setup() {
  },

  components: {
    MachineManage,
  },
  data() {
    return {
      machineData: {},
      machinePrdData: {},
      machinePartList: [],
      machineNo: 0,
      isShowModal: false,
      selectNo: null,
    }
  },
  beforeMount() {
    this.selectNo = this.$route.params.mno;
    this.getMachineInfo(this.selectNo);
    this.getMachinePrdInfo(this.selectNo);
    this.getMachinePartInfo(this.selectNo);
  },
  methods: {
    // 설비 상세 정보
    async getMachineInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machineInfo/${selectNo}`)
                              .catch(err => console.log(err));

      this.machineData = result.data;
      this.allFormat(this.machineData);
      this.machineNo = this.machineData.machine_num;
    },
    // 설비 생산 정보
    async getMachinePrdInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machinePrdInfo/${selectNo}`)
                              .catch(err => console.log(err));
      this.machinePrdData = result.data;
    },
    // 설비 부품 리스트
    async getMachinePartInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machinePartList/${selectNo}`)
                              .catch(err => console.log(err));
      for(let i in result.data) {
        let partNo = result.data[i].part_num;
        let partInfo = await this.getPartInfo(partNo);
        this.machinePartList.push(partInfo);
      }
    },
    // 부품 상세 정보
    async getPartInfo(pno) {
      let result = await axios.get(`${ajaxUrl}/parts/partInfo/${pno}`)
                              .catch(err => console.log(err));
      return result.data;
    },

    // 설비 수정 모달 = 등록 모달과 같은 모달
    machineUpdate() {
      this.isShowModal = !this.isShowModal;
    },
    confirmModal() {
      console.log('상세페이지 업데이트 완료');
      let selectNo = this.$route.params.mno;
      this.getMachineInfo(selectNo);
      this.getMachinePrdInfo(selectNo);
      this.closeModal();
    },
    closeModal() {
      this.isShowModal = false;
    },

    // 설비 삭제 machineDelete
    async machineDelete() {
      let result = await axios.delete(`${ajaxUrl}/machine/machineDelete/${this.selectNo}`)
                              .catch(err => console.log(err));
      let delRes = result.data;
      if(delRes.result == 'success') {
        this.$notify({
          text: "설비 삭제 성공",
          type: 'success',
        });
        this.$router.go(-1); // 삭제 성공시 뒤로가기(설비 리스트로 이동)
      } else {
        this.$notify({
          text: "설비 삭제 실패",
          type: 'error',
        });
      }
    },
    // 형변환 파트 작업중
    // 전체 텍스트 변환
    allFormat(data) {
      // 날짜, 생산량, 거래처, 사원명 검색
      data.buy_date = this.dateFormat(data.buy_date, 'yyyy-MM-dd');

      switch(data.machine_type){
        case '세척기기':
          data.uph = data.uph + ' 병';
          data.upd = data.upd + ' 병';
          break;
        case '음료제작기기':
          data.uph = data.uph + ' L';
          data.upd = data.upd + ' L';
          break;
        case '포장기기':
          data.uph = data.uph + ' 병';
          data.upd = data.upd + ' 병';
          break;
        default:
          console.log('설비 인식 실패');
      }

      // 거래처, 사원은 공정기준 등록 완성후 메소드 작성
    },
    // 날짜 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    // 교체일 계산
    replaceDate(replace_date, days) {
      let date = new Date(replace_date);

      date.setDate(date.getDate() + days);

      return userDateUtils.dateFormat(date, 'yyyy-MM-dd');
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 800px;
}
.container > .row {
  padding: 5px 0;
}

.mname {
  text-align: left;
}
.mdata .row {
  align-items: center;
}
.mdata .row .col {
  height: 60px;
  // margin: 5px;
  background-color: $gray-200;
  margin: 5px;

  display: flex;
  align-items: center;
}
.mimg {
  background-color: $gray-200;
  margin: 5px;
  width: 23%;

  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  width: 95%;
  height: auto;
}

.pinfo {
  background-color: $gray-200;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
}
</style>
