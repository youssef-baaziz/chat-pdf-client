<template>
    <div class="error-page">
      <div class="image-container">
        <img src="@/assets/error.jfif" alt="Error Image" />
        <div class="centered-message">
          <button @click="goHome">GO BACK HOME</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goHome() {
        this.$router.push('/');  // Assuming Vue Router is set up
      }
    }
  }
  </script>
  
  <style scoped>
  .error-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .image-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image-container img {
    max-width: 100%;
    width: 80%;
    height: auto;
  }
  
  .centered-message {
    position: absolute;
    top: 84%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
  }
  
  .centered-message h1 {
    font-size: 6rem;
    font-weight: bold;
    margin: 0;
  }
  
  .centered-message p {
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }
  
  .centered-message button {
    background-color: #289fa7;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 13px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .centered-message button:hover {
    background-color: #d87366;
  }

  .text-error{
    color: black;
  }
  </style>
  