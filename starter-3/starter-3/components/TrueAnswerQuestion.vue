<template>
    <div class="container">
      <div class="question-header">
        <span>質問{{ id }}</span>
        <div class="instruction">正しい答えを選択してください</div>
      </div>
      
      <div class="options">
        <div
          v-for="(option, index) in options"
          :key="index"
          :class="['option', { selected: selectedOption === index }]"
          @click="selectOption(index)"
        >
          {{ option.text }}
          <span v-if="selectedOption === index" class="checkmark">✓</span>
        </div>
      </div>
  
      <button class="next-button" @click="submitAnswer">次に</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: {
        type: Number,
        //required: true,
      },
      options: {
        type: Array,
        //required: true,
      },
    },
    data() {
      return {
        selectedOption: null,
      };
    },
    methods: {
      selectOption(index) {
        this.selectedOption = index;
      },
      submitAnswer() {
        if (this.selectedOption !== null) {
          // Handle the answer submission, e.g., emit an event or move to the next step
          this.$emit('answer-selected', this.selectedOption);
        } else {
          alert('正しい答えを選択してください');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    width: 819px;
    margin: 0 auto;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 24px;
    box-sizing: border-box;
    text-align: center;
  }
  
  .question-header {
    margin-bottom: 24px;
  }
  
  .instruction {
    font-size: 18px;
    color: #FF4081;
    margin-top: 8px;
  }
  
  .options {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
  }
  
  .option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .option.selected {
    background-color: #4CAF50;
    color: white;
  }
  
  .checkmark {
    font-size: 18px;
  }
  
  .next-button {
    width: 100%;
    padding: 12px;
    background-color: #FF4081;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .next-button:hover {
    background-color: #e53981;
  }
  </style>
  