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
            navText="자재파트"
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
            navText="품질파트"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
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
    
    <div class="sidenav-footer position-absolute w-100 bottom-0">
      <div class="mx-3">
        <a
          class="btn mt-4 w-100"
          :class="`bg-gradient-${this.$store.state.color}`"
          href="https://www.creative-tim.com/product/vue-material-dashboard-2-pro"
          >Upgrade to pro</a
        >
      </div>
    </div>
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
      // this.$router.push({ name : 'boardInfo', params : { bno : boardNo }});
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
