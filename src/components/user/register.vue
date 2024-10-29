<template>
    <div class="registration-container">
      <h2>Register</h2>
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="form.username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>
        <div class="form-group">
          <label for="firstname">First Name:</label>
          <input type="text" id="firstname" v-model="form.firstName" required />
        </div>
        <div class="form-group">
          <label for="lastname">Last Name:</label>
          <input type="text" id="lastname" v-model="form.lastName" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import { HTTP } from '@/lib/axios';
  
  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
          firstName: '',
          lastName: ''
        },
        errorMessage: ''
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await HTTP.post('/register', this.form);
          console.log('Registration successful:', response.data);
          this.$router.replace({ path: "/login" });
        } catch (error) {
          console.error('Registration failed:', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .registration-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .error {
    color: red;
  }
  </style>
  