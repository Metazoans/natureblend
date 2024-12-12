<template>
    <header class="header-bar">
      <div class="logo">
        <img src="@/assets/img/logogo.jpg" alt="Logo" class="logo-img" />
      </div>
      <ul class="nav-list">
        <li v-for="(item, index) in navItems" :key="index" @click="handleClick(item)" :class="{ active: item.active }">
          {{ item.text }}
        </li>
      </ul>
      <div>

    <a href="#" @click="toggleSidebar">
    btn
    </a>

  </div>
    </header>
  </template>
  
  <script>
  import { mapMutations, mapState } from "vuex";
  export default {
    name: "AppHeader",
    data() {
      return {
        navItems: [
          { text: "영업", active: false },
          { text: "자재", active: false },
          { text: "생산", active: false },
          { text: "품질", active: false },
          { text: "설비", active: false },
          { text: "기준정보", active: false }
        ]
      };
    },
    methods: {
      handleClick(item) {
        this.navItems.forEach(i => i.active = false);
        item.active = true;
      },
      ...mapMutations(["navbarMinimize", "toggleConfigurator"]),
      toggleSidebar() {
      this.navbarMinimize();
    },
      
    },

      computed: {
      ...mapState(["isRTL", "isAbsolute"]),

      currentRouteName() {
        return this.$route.name;
      },
    },
  };
  </script>
  
  <style scoped>
  .header-bar {
    background-color: rgba(255, 166, 0, 0.87);
    padding: 10px 20px;
    width: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 20px;
  }
  
  .logo-img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    vertical-align: middle;
  }
  
  .nav-list {
    list-style-type: none;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .nav-list li {
    color: gray;
    cursor: pointer;
    padding: 10px 10px;
    margin-left: 40px;
    margin-right: 40px;
    transition: background-color 0.3s;
  }
  </style>