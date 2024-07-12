<template>
    <footer class="footer">
      <div class="terms">
        <NuxtLink to="/users/questionRules">
          <p>利用規約と条件</p>
        </NuxtLink>
      </div>
      <div class="copyright">
        <p class="company">中部電力MIRAI TOWER</p>
        <p class="notice">© 2020 Nagoya TV Tower Corporation.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .footer {
    margin-top: 20px;
    text-align: center;
  }
  
  .terms {
    background-color: #F1F4F9; /* Light grey background */
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .terms p {
    text-decoration: underline;
    color: #4B4B4D;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 23.17px;
    letter-spacing: 0.02em;
    text-align: center;
  }
  
  .copyright {
    background-color: #0082CA; /* Blue background */
    color: white;
    height: 105px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .company {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 23.17px;
    letter-spacing: 0.02em;
    text-align: center;
    margin-bottom: 16px;
  }
  
  .notice {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 23.17px;
    letter-spacing: 0.02em;
    text-align: center;
    margin: 0;
  }
  </style>
  