<template>
    <div class="question-header" ref="questionHeader">
        <div 
            v-for="index in numberOfQuestions" 
            :key="index" 
            class="question"
            :class="{ active: index <= props.currentQuestion }">
            <div class="circle">
                <span>Q.{{ index }}</span>
            </div>
            <img class="question-arrow" src="@/assets/images/question-arrow-yellow.svg">
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
    numberOfQuestions: {
        type: Number,
        required: true,
    },
    currentQuestion: {
        type: Number,
        default: 1,
    },
});

const questionHeader = ref(null);

const updateRows = () => {
    nextTick(() => {
        if (questionHeader.value) {
            const questions = Array.from(questionHeader.value.children);
            questions.forEach(el => el.classList.remove('last-in-row', 'last-row'));

            let currentTop = null;
            let lastInRow = [];

            questions.forEach((question, index) => {
                const top = question.offsetTop;
                if (currentTop === null) {
                    currentTop = top;
                }

                if (top !== currentTop) {
                    lastInRow.push(questions[index - 1]);
                    currentTop = top;
                }
            });

            lastInRow.push(questions[questions.length - 1]);

            lastInRow.forEach(el => el.classList.add('last-in-row'));

            const lastRowTop = lastInRow[lastInRow.length - 1]?.offsetTop;
            questions.forEach(question => {
                if (question.offsetTop === lastRowTop) {
                    question.classList.add('last-row');
                }
            });
        }
    });
};

onMounted(() => {
    updateRows();
    window.addEventListener('resize', updateRows);
});

watch(() => props.currentQuestion, updateRows);
</script>


<style scoped>
.question-header {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background-image: url('@/assets/images/question-background.svg');
    background-repeat: no-repeat;
    background-position: center center;
    margin: 0;
    overflow-y: auto;

    /* Hide scrollbar for WebKit browsers */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.question {
    display: flex;
    align-items: center;
    font-family: "Noto Sans JP", sans-serif;
    font-weight: bold;
}

.circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: transparent;
    color: #fff;
    border: 1.75px solid #ffffff8a;
    font-family: Noto Sans JP;
    font-size: 14.7px;
    font-weight: 700;
    line-height: 21.29px;
    letter-spacing: 0.02em;
    text-align: center;
}

.circle.active {
    border-color: red;
}

.question-arrow {
    margin-left: 8px;
  }
  

/* Hide the arrow for the last active question in each row */
.question.last-in-row .question-arrow {
    display: none;
}
</style>
