<template>
  <div id="app">
    
    <sidenav
    :custom_class="color"
    class="fixed-start"
    v-if="showSidenav"
    />
    <main
      class="main-content position-relative max-height-vh-100 h-100 overflow-x-hidden"
    >
      <AppHeader />


      <div class="content-container">
        <router-view />
      </div>

    </main>
    <div v-if="isModalOpen" class="modal-back"></div>
</div>

</template>
<script>
import Sidenav from "./examples/Sidenav";
import { mapMutations, mapState } from "vuex";
import AppHeader from './components/AppHeader.vue';

export default {
  name: "App",
  components: {
    Sidenav,
    AppHeader,
  },
  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"]),
  },
  computed: {
    ...mapState([
      "color",
      "isAbsolute",
      "isNavFixed",
      "navbarFixed",
      "absolute",
      "showSidenav",
      "showNavbar",
      "showFooter",
      "showConfig",
      "hideConfigButton",
        'isModalOpen',
    ]),
  },

  created() {

  },

  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";

    const sidenav = document.getElementsByClassName("g-sidenav-show")[0];

    if (window.innerWidth > 1200) {
      sidenav.classList.add("g-sidenav-pinned");
    }
  },
};
</script>
<style>
#app {
  padding-right: 10px;
}
.content-container {
  background-color: #fff;
  margin: 10px 0 10px 0;
  border-radius: 8px;

}
.modal-back {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}
</style>
