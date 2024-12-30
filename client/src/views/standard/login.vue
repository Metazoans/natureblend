<template>
    <div class="login-container">
      <div class="login-form">
        <h2>로그인</h2>
        <form @submit.prevent="eventLogin">
          <div class="form-group">
            <label for="username">사원번호</label>
            <input
              type="text"
              id="username"
              v-model="empnum"
              placeholder="사원번호를 입력하세요"
              required
            />
          </div>
  
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
  
          <div v-if="errorMessage" class="error-message">
            <p>{{ errorMessage }}</p>
          </div>
  
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" @click="login">로그인</button>
          </div>
        </form>
  
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';

  import { mapMutations } from "vuex";

  
  export default {
    name: 'Login',
    data() {
      return {
        empnum: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      ...mapMutations(["addLoginInfo"]),
      async login() {
        const loginInfo = {
          empnum : this.empnum,
          password : this.password,
        }
        const result = await axios.post(`${ajaxUrl}/login`,loginInfo)
                                  .catch(err => console.log(err));
        console.log('사원번호 비밀번호 출력',result);
        console.log('로그인 데이터 확인',result.data);
        if(result.data[0].name){
          console.log('로그인성공');
          const loginObj = {
            emp_num: result.data[0].emp_num,
            name: result.data[0].name,
            birth: result.data[0].birth,
            tel: result.data[0].tel,
            job: result.data[0].job,
            job_num: result.data[0].job_num,
            position: result.data[0].position,
            employment_date: result.data[0].employment_date,
            resignation_date: result.data[0].resignation_date,
            level: result.data[0].level,
          };
          console.log('aaa', loginObj);
          this.addLoginInfo(loginObj);

          console.log('dkdkdkdk',this.$store.state.loginInfo);
          if(this.$store.state.loginInfo.name){
            this.$router.push({name : 'MainPage'});
          }
          // this.$store.dispatch('addLoginInfo', loginObj)
          //this.$router.push({name:'MainPage',params:{loginId:result.data}})
          // window.location.reload();
        }
      },
      async loginconfig() {

      },
    },
    mounted() { // 페이지 조회시 바로 발생
        console.log('로그인 테스트');
        // this.loginconfig();
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: white;
  }
  
  .login-form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
  }
  
  .login-form h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  .form-actions {
    text-align: center;
  }
  
  .form-actions button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .form-actions button:hover {
    background-color: #0056b3;
  }
  
  .signup-link {
    text-align: center;
    margin-top: 15px;
  }
  
  .signup-link a {
    color: #007bff;
    text-decoration: none;
  }
  
  .signup-link a:hover {
    text-decoration: underline;
  }
  </style>
