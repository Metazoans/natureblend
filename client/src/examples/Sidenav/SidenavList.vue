<!-- 출력 리스트 -->

<template>
  <div
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
    id="sidenav-collapse-main"
  >
    <!-- 전체 네비게이션바 목록 -->
    <ul class="navbar-nav">

      <!-- 네비게이션바 항목 시작 -->
      <li v-if="headerMenu === $departments[1]" class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="true"
          collapseRef="mainpage"
          navText="영업파트"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[2]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="자재 주문"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('materialList')">자재 주문 관리</li>
            <li class="sub-item" @click="movePage('materialOrderList')">자재 주문 조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="자재 입고"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('materialInput')">자재 입고</li>
            <li class="sub-item" @click="movePage('materialInputList')">자재 입고 조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="자재 재고"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('materialLotqty')">자재 LOT 조회</li>
            <li class="sub-item" @click="movePage('materialqty')">자재 재고 조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="테스트페이지"
            @click="movePage('tabletest')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[3]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="production"
            navText="생산계획"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('productionAdd')">생산계획 등록</li>
            <li class="sub-item" @click="movePage('productionList')">생산계획 목록</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="생산지시"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item">생산계획 등록</li>
            <li class="sub-item">생산계획 목록</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="공정작업"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item">생산계획 등록</li>
            <li class="sub-item">생산계획 목록</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="공정실적"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[4]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="입고검사"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('qualityList')">검사신청</li>
            <li class="sub-item" @click="movePage('qualityList2')">입고검사관리</li>
            <li class="sub-item" @click="movePage('qualityList3')">검사기록조회</li>
            <li class="sub-item" @click="movePage('qualityList4')">불량내역조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="공정품질검사"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item">세척검사관리</li>
            <li class="sub-item">음료검사관리</li>
            <li class="sub-item">검사기록조회</li>
            <li class="sub-item">불량내역조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="포장품질검사"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item">관리</li>
            <li class="sub-item">검사기록조회</li>
            <li class="sub-item">불량내역조회</li>
          </template>
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[5]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="설비파트"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[6]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="기준정보파트"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      
      <!-- 네비게이션바 항목 끝-->
    </ul>
    

  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
import {mapState} from "vuex";

export default {
  name: "SidenavList",
  props: {
    cardBg: String,
  },
  data() {
    return {
      title: "Soft UI Dashboard PRO",
      controls: "dashboardsExamples",
      isActive: "active",
    };
  },
  components: {
    SidenavCollapse,
  },

  computed: {
    ...mapState([
      "headerMenu"
    ]),
  },

  created() {
  },

  methods: {
    movePage(page) {
      this.$router.push({ name: page })
    }
  }
};
</script>
<style scoped>
.sub-item {
  font-size: 14px;
  cursor: pointer;
  border-left: 3px solid #ffa500;
  margin: 4px 0 10px 0;
  padding: 0 0 0 5px;
}

.sub-item:hover {
  color: $orange !important;
}
</style>
