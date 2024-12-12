<!-- 출력 리스트 -->

<template>
  <div
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
    id="sidenav-collapse-main"
  >
    <!-- 전체 네비게이션바 목록 -->
    <ul class="navbar-nav">

      <!-- 네비게이션바 항목 시작 -->
      <li class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="mainpage"
          navText="MainPage"
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
};
</script>
