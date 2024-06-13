<template>
    <div>
      <div class="login-banner">
        <div class="banner-text">ル・ヴァン・サン</div>
      </div>
      
      <div class="login-page">
        <div class="header-container">
          <h2 class="nagoya-heading">名古屋縦走</h2>
        </div>
        <div class="content-container">
          <QuestionList/>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import QuestionList from "@/components/QuestionList.vue";
  
  export default {
    components: {
      QuestionList
    }
  };
  </script>
  
  <style scoped>
  /* Banner */
  .login-banner {
      background-color: #E13A4B; /* Red color */
      width: 100%; /* Full width */
      height: 56px; /* Height of 56px */
    }
    
    /* Login Page */
    .login-page {
      background-color: #F9EFE3; /* Background color */
      background-image: url('@/assets/images/background.svg'); /* Background image */
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      display: flex;
      flex-direction: column; /* Arrange children vertically */
      align-items: center;
      height: calc(100dvh - 56px); /* Full height minus banner */
      margin: 0;
    }
    
    /* Header Container */
    .header-container {
      margin-top: 24px;
      margin-bottom: 16px;
      width: 819px; /* Width */
      height: 92px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #FFFFFF; /* Background color */
      box-shadow: 0px 6px 12px 0px #0000001F; /* Box shadow */
      border-radius: 16px; /* Top rounded corners */
    }
    
    /* Nagoya Heading */
    .nagoya-heading {
      font-family: 'Noto Sans JP', sans-serif; /* Font family */
      font-size: 24px; /* Font size */
      font-weight: 700; /* Font weight */
      line-height: 34.75px; /* Line height */
      text-align: left; /* Text alignment */
      width: 771px;
      height: 44px;
      gap: 16px;
      opacity: 0px;
      position: relative; /* Set position to relative */
    }
  
    /* Add line below Nagoya Heading */
    .nagoya-heading::after {
      content: ''; /* Empty content */
      position: absolute; /* Set position to absolute */
      bottom: 0; /* Align at the bottom */
      left: 0; /* Align at the left */
      width: 100%; /* Full width */
      height: 1px; /* Height of the line */
      background-color: #CCCCCC; /* Color of the line */
    }
    
    /* Content Container */
    .content-container {
      width: 817px; /* Width */
      height: auto; /* Height */
      padding: 24px 24px 12px 24px; /* Padding */
      gap: 10px; /* Gap */
      border-radius: 16px; /* Bottom rounded corners */
      opacity: 1; /* Opacity */
      background: #FFFFFF; /* Background color */
      box-shadow: 0px 6px 12px 0px #0000001F; /* Box shadow */
      display: flex;
      flex-direction: column; /* Arrange children vertically */
      justify-content: left;
    }
    .banner-text {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 16px;
      font-weight: 500;
      line-height: 23.17px;
      text-align: center;
      color: white; /* Màu chữ trắng */
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    
    /* For small devices such as phones */
@media (max-width: 576px) {
  /* .login-page {
    height: auto;
  } */
  
  .header-container {
    width: 100%;
  }
  
  .nagoya-heading {
    width: 100%;
    text-align: center;
  }
  
  .content-container {
    width: 100%;
    padding: 12px;
  }
}
/* For small devices such as phones */
@media (max-width: 576px) {
  /* .login-page {
    height: auto;
  } */
  
  .header-container {
    width: 100%;
  }
  
  .nagoya-heading {
    width: 100%;
    text-align: center;
  }
  
  .content-container {
    width: 100%;
    padding: 12px;
  }
}

/* For medium devices such as tablets */
@media (min-width: 577px) and (max-width: 768px) {
  /* .login-page {
    height: auto;
  } */
  
  .header-container {
    width: 90%;
  }
  
  .nagoya-heading {
    width: 100%;
    text-align: center;
  }
  
  .content-container {
    width: 90%;
    padding: 16px;
  }
}

/* For large devices such as laptops */
@media (min-width: 769px) and (max-width: 1024px) {
  /* .login-page {
    height: calc(100vh - 56px);
  } */
  
  .header-container {
    width: 90%;
  }
  
  .nagoya-heading {
    width: 100%;
    text-align: left;
  }
  
  .content-container {
    width: 90%;
    padding: 24px;
  }
}

/* For extra small devices such as small phones */
@media (max-width: 425px) {
  /* .login-page {
    height: auto;
  } */
  
  .header-container {
    width: 100%;
  }
  
  .nagoya-heading {
    width: 100%;
    text-align: center;
  }
  
  .content-container {
    width: 100%;
    padding: 8px;
  }
}

  </style>
  