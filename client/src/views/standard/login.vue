<template>
    <div class="login-container">
      <div class="login-form">
        <h2>로그인</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">사원번호</label>
            <input
              type="text"
              id="username"
              v-model="email"
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
            <button type="submit" class="btn btn-primary">로그인</button>
          </div>
        </form>
  
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post('/api/login', {
            email: this.email,
            password: this.password,
          });
  
          if (response.data.success) {
            localStorage.setItem('authToken', response.data.token);
            this.$router.push('/dashboard');
          } else {
            this.errorMessage = '로그인에 실패했습니다.';
          }
        } catch (error) {
          this.errorMessage = '서버에 문제가 발생했습니다.';
          console.error(error);
        }
      },
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
  