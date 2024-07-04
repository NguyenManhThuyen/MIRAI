<template>
    <div class="custom-component">
        <!-- Phần tiêu đề -->
        <div class="title-section">
            <p class="title-text">スタンプラリーのタイトル:</p>
        </div>

        <div class="content-section">
            <p class="content-title">スマイル、重要文化財ウォーキング</p>
            <div class="icon-container" @click="openEdit1Modal">
                <img src="@/assets/images/admin-home-edit-icon.svg" alt="edit icon" class="edit-icon" />
            </div>
        </div>

        <!-- Thanh ngang xám -->
        <div class="gray-line"></div>

        <div class="title-section">
            <p class="title-text">最後の結果ページ下部の文言変更:</p>
            <div class="switch-container">
                <label class="switch">
                    <input type="checkbox" v-model="switchValue" />
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div class="content-section">
            <p class="title-text-temp">記念品の引き換えは、帰りの際に係の者にこのページをご提示してね！</p>
            <div class="icon-container" @click="openEdit2Modal">
                <img src="@/assets/images/admin-home-edit-icon.svg" alt="edit icon" class="edit-icon" />
            </div>
        </div>

        <!-- Thanh ngang xám -->
        <div class="gray-line"></div>

        <BodyAdminHomeListQuestion/>

        <!-- Modal -->
        <div v-if="showModal" class="modal-container">
            <div class="modal-content">
                <div class="modal-header">
                    <p class="modal-title">{{ modalTitle }}</p>
                    <img src="@/assets/images/admin-home-change-topic-icon-plus.svg" alt="close icon" class="close-icon" @click="closeModal" />
                </div>
                <div class="modal-body">
                    <!-- Nội dung của modal -->
                    <textarea v-model="modalContent" class="modal-textarea"></textarea>
                </div>
                <div class="modal-footer">
                    <button class="cancel-button" @click="closeModal">キャンセル</button>
                    <button class="save-button" @click="saveModalChanges">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

let switchValue = false;
let showModal = ref(false);
let modalTitle = ref('');
let modalContent = ref('');

const openEdit1Modal = () => {
    showModal.value = true;
    modalTitle.value = 'スマイル、重要文化財ウォーキング'; // Set appropriate title
    modalContent.value = 'Modal content for スマイル、重要文化財ウォーキング...'; // Set appropriate content
};

const openEdit2Modal = () => {
    showModal.value = true;
    modalTitle.value = '最後の結果ページ下部の文言変更'; // Set appropriate title
    modalContent.value = 'Modal content for 最後の結果ページ下部の文言変更...'; // Set appropriate content
};

const closeModal = () => {
    showModal.value = false;
};

const saveModalChanges = () => {
    // Call your API to save modalContent
    axios.post('/your/api/endpoint', { content: modalContent.value })
        .then(response => {
            console.log('Save successful:', response.data);
            closeModal(); // Close modal after successful save
        })
        .catch(error => {
            console.error('Error saving content:', error);
            // Handle error here
        });
};
</script>

<style scoped>
.custom-component {
    margin: 16px;
    border-radius: 8px;
    background-color: #FFFFFF;
}

.title-section {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.title-text {
    font-family: Noto Sans JP;
    font-size: 16px;
    font-weight: 700;
    line-height: 23.17px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #6A6A6A;
    margin-right: 10px;
}

.icon-container {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.edit-icon {
    width: 24px;
    height: 24px;
}

.content-section {
    margin-top: 10px;
    display: flex;
    width: fit-content;
    height: fit-content;
    background-color:  #F1F4F9;
    padding: 9px 16px 9px 16px;
    gap: 10px;
    border-radius: 8px;
    text-align: center;
    justify-content: center;
    margin-bottom: 10px;
}

.content-title {
    font-family: Noto Sans JP;
    font-size: 20px;
    font-weight: 700;
    line-height: 28.96px;
    letter-spacing: 0.02em;
    text-align: center;
    color:#4B4B4D;
}

.title-text-temp {
    font-family: Noto Sans JP;
    font-size: 16px;
    font-weight: 400;
    line-height: 23.17px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #4B4B4D;
    background-color:  #F1F4F9;
    padding-top: 3.5px;
    padding-bottom: 3.5px;
}

.switch-container {
    display: inline-block;
    margin-right: 12px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 22px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 22px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:checked+.slider:before {
    transform: translateX(13.5px);
}

.gray-line {
    border-bottom: 1px solid #E3E4EC;
}

/* Modal styles */
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Màu nền mờ */
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 80%;
    max-width: 600px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Đổ bóng cho modal */
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E3E4EC;
    padding-bottom: 10px;
}

.modal-title {
    font-size: 18px;
    font-weight: 700;
}

.close-icon {
    cursor: pointer;
}

.modal-body {
    padding: 20px 0;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-button, .save-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
}

.cancel-button {
    background-color: #E0E0E0;
    color: #333333;
}

.save-button {
    background-color: #2196F3;
    color: white;
}
</style>
