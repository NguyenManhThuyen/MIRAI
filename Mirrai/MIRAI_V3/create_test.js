import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Tạo một ngày ngẫu nhiên trong khoảng thời gian
function getRandomDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Tạo giá trị boolean ngẫu nhiên
function getRandomBoolean() {
    return Math.random() > 0.5;
}

// Tạo đối tượng log_answer ngẫu nhiên
function generateLogAnswer() {
    const ids = ["1721122131", "1721122220", "1721122359", "1721122471", "1721122532", "1721122603"];
    const numberOfEntries = Math.floor(Math.random() * 6) + 1; // Số lượng mục ngẫu nhiên giữa 1 và 6
    const logAnswer = {};
    const selectedIds = new Set();

    while (selectedIds.size < numberOfEntries) {
        selectedIds.add(ids[Math.floor(Math.random() * ids.length)]);
    }

    selectedIds.forEach(id => {
        logAnswer[id] = getRandomBoolean();
    });

    return logAnswer;
}

// Tạo một record ngẫu nhiên
function generateRecord() {
    return {
        id: uuidv4(),
        log_answer: generateLogAnswer(),
        created_at: getRandomDate('2020-01-01', '2024-07-23').toISOString().split('T')[0] // Định dạng ngày thành YYYY-MM-DD
    };
}

// Tạo nhiều record
function generateRecords(count) {
    const records = [];
    for (let i = 0; i < count; i++) {
        records.push(generateRecord());
    }
    return records;
}

// Xuất dữ liệu ra file JSON
function exportToJsonFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
}

// Tạo 10,000 record và xuất ra tệp
const records = generateRecords(2500);
exportToJsonFile('records.json', records);

console.log('File records.json đã được tạo thành công.');
