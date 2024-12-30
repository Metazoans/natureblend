<template>
    <button v-if = "loginData.name" @click = "logout">
        logout
    </button>
    <button v-else @click = "login">
        login
    </button>
</template>

<script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';

  
  export default {
    data() {
      return {
        loginData:{},
      };
    },
    watch:{
        loginData:{},
    },
    methods: {
      async loginconfig() {
        const result = await axios.get(`${ajaxUrl}/loginconfig`)
                                  .catch(err => console.log(err));
        console.log('세션 출력',result.data);
        this.loginData = result.data;
        console.log(this.loginData);
      },

      async logout() {
        try {
          const result = await axios.post(`${ajaxUrl}/logout`);
          if (result.data === '로그아웃'){
              console.log('로그아웃 성공', result.data);
              this.loginData = {};  // 로그아웃 후 세션 초기화
              console.log(this.loginData);
              this.$router.push({name : 'login'});
          }
        } catch (err) {
          console.log('로그아웃 실패', err);
        }
    },
    async login(){
        this.$router.push({name : 'login'});
    }

      

  },
  mounted() { // 페이지 조회시 바로 발생
        console.log('로그인 테스트');
        this.loginconfig();
    },
};
</script>