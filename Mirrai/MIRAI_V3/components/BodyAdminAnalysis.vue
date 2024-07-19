<script setup>
import { ref, onMounted, watchEffect, computed, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from 'moment';
import axios from 'axios';

const series = ref([
  {
    name: '参加者',
    data: []
  },
  {
    name: '終了した',
    data: []
  }
]);

const chartOptions = ref({
  chart: {
    toolbar: false,
    type: 'bar',
    height: 700,
    fontFamily: 'Noto Sans JP',
    zoom: {
      enabled: true,
      type: 'x',  
      autoScaleYaxis: false,  
      zoomedArea: {
        fill: {
          color: '#90CAF9',
          opacity: 0.4
        },
        stroke: {
          color: '#0D47A1',
          opacity: 0.4,
          width: 1
        }
      }
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: ''
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return  val + " 人々";
      }
    }
  }
});

const selectedDate = ref(null);
const chartData = ref(series);
const chartRef = ref(null);
const chartKey = ref(0); // Key variable to force re-render
const questionData = ref([]);
const activeFilter = ref('week');
const exportChart = ref([]);
const currentPage = ref(1);
const rowsPerPage = ref(10);

const paginatedQuestionData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return questionData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(questionData.value.length / rowsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const range = 2; // Number of pages to show before and after the current page
  const pages = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - range && i <= current + range)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return pages;
});

const filterWeek = () => {
  activeFilter.value = 'week';
  const endDate = moment().format('DD/MM/yyyy');
  const startDate = moment().subtract(7, 'days').format('DD/MM/yyyy');
  fetchData(startDate, endDate);
};

const filterMonth = async () => {
  activeFilter.value = 'month';
  const endDate = moment().format('DD/MM/yyyy');
  const startDate = moment().startOf('month').format('DD/MM/yyyy');
  fetchData(startDate, endDate);
};

const exportCSV = (data, fileName) => {
  let csvContent = "data:text/csv;charset=utf-8," +
    "Date,";
  
  // Add column headers for questions
  const questions = data[0]?.questions || [];
  questions.forEach((question, index) => {
    csvContent += `Q.${question.sort} - Incorrect,Q.${question.sort} - Correct,Q.${question.sort} - Total,`;
  });
  csvContent += "\n";
  
  // Add data rows
  data.forEach((item) => {
    csvContent += `'${item.date},`;
    item.questions.forEach((question) => {
      csvContent += `${question.statsPerDay.answered - question.statsPerDay.correct},`;
      csvContent += `${question.statsPerDay.correct},`;
      csvContent += `${question.statsPerDay.answered},`;
    });
    csvContent += "\n";
  });
  
  // Create CSV file and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportQuestionData = () => {
  exportCSV(questionData.value, "question_statistics.csv");
};

const exportSeriesData = () => {
  const data = exportChart.value; // Dữ liệu từ chartOptions.value.xaxis.categories
  const fileName = "series_data.csv";

  let csvContent = "data:text/csv;charset=utf-8," +
    "Category,Total,Correct\n";

  data.forEach((item, index) => {
    // Thêm ký tự ' vào trước ngày để Excel hiểu đúng định dạng
    csvContent += `'${item},${series.value[0].data[index]},${series.value[1].data[index]}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fetchData = async (startDate, endDate) => {
  try {
    const apiUrl = `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-analysis-lambda/totalUser?startdate=${startDate}&enddate=${endDate}`;
    const response = await axios.get(apiUrl);
    const apiData = response.data;

    // Tạo mảng để lưu số true và tổng số true + false của từng ngày
    const trueCounts = [];
    const totalCounts = [];
    const dates = [];

    // Duyệt qua các phần tử của apiData và lấy dữ liệu
    for (const key in apiData) {
      if (Object.hasOwnProperty.call(apiData, key)) {
        const element = apiData[key];
        const trueCount = element.true || 0;
        const totalCount = (element.true || 0) + (element.false || 0);

        trueCounts.push(trueCount);
        totalCounts.push(totalCount);
        dates.push(key);
      }
    }

    // Sắp xếp lại các mảng theo thứ tự ngày tháng
    const sortedDates = dates.slice().sort((a, b) => moment(a, 'DD/MM/YYYY').valueOf() - moment(b, 'DD/MM/YYYY').valueOf());

    // Tạo một mảng chỉ số dựa trên sortedDates
    const indexMap = sortedDates.map(date => dates.indexOf(date));

    // Sử dụng mảng chỉ số để lấy dữ liệu từ trueCounts và totalCounts
    const sortedTrueCounts = indexMap.map(index => trueCounts[index]);
    const sortedTotalCounts = indexMap.map(index => totalCounts[index]);

    // Cập nhật dữ liệu cho biểu đồ
    series.value[0].data = sortedTotalCounts;
    series.value[1].data = sortedTrueCounts;
    chartOptions.value.xaxis.categories = sortedDates.map(date => moment(date, 'DD/MM/YYYY').format('DD/MM'));
    exportChart.value = sortedDates.map(date => moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'));

    chartKey.value++; // Buộc render lại biểu đồ
  } catch (error) {
    console.error('Error fetching API data:', error);
  }
};

const fetchQuestionData = async () => {
  try {
    const response = await axios.get('https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-analysis-lambda/totalUserPerQuestion');
    questionData.value = response.data.sort((a, b) => moment(b.date, 'DD/MM/YYYY') - moment(a.date, 'DD/MM/YYYY'));
  } catch (error) {
    console.error('Error fetching question data:', error);
  }
};

// Lấy dữ liệu từ API khi component được mount
onMounted(() => {
  filterMonth();
  
  // Fetch question data
  fetchQuestionData();
});

watchEffect(() => {
  if (selectedDate.value && selectedDate.value.length === 2) {
    const startDate = moment(selectedDate.value[0]).format('DD/MM/yyyy');
    const endDate = moment(selectedDate.value[1]).format('DD/MM/yyyy');
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    // Gọi API với startDate và endDate
    fetchData(startDate, endDate);
  }
});

watch(rowsPerPage, () => {
  currentPage.value = 1; // Reset to the first page when rowsPerPage changes
});
</script>

<template>
  <div id="chart">
    <div class="header-container">
      <div class="left-section">
        <span>参加と完了の統計</span>
      </div>
      <div class="right-section">
        <div class="date-picker-container">
          <vue-date-picker
            v-model="selectedDate"
            type="daterange"
            format="dd/MM/yyyy"
            range
            class="date-picker"
          >
            <template #calendar-header="{ index, day }">
              <div :class="index === 5 || index === 6 ? 'red-color' : ''">
                {{ day }}
              </div>
            </template>
            <template #input-icon>
              <div 
              style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; pointer-events: none;"
            >
              <img src="@/assets/images/calendar-icon.svg" class="centered-icon" />
            </div>
            </template>
          </vue-date-picker>
        </div>
        
        <div class="button-analysis">
        <button
          :class="{ 'filter-week': true, 'active': activeFilter === 'week' }"
          @click="filterWeek"
        >
          今週
        </button>
        <button
          :class="{ 'filter-month': true, 'active': activeFilter === 'month' }"
          @click="filterMonth"
        >
          今月
        </button>
        <div class="vertical-separator"></div>
        <button class="export-csv" @click="exportSeriesData">
          <img src="@/assets/images/export-icon.svg" alt="CSV Icon" class="csv-icon">
          <span>CSV出力</span>
        </button>
      </div>
      </div>
    </div>
    <apexchart ref="chartRef" v-if="chartData" type="bar" height="600" :options="chartOptions" :series="chartData" :key="chartKey">
    </apexchart>

    <div class="footer-container">
      <div class="forward-section">
        <span>前進</span>
        <img src="@/assets/images/arrow-right-icon.svg" class="arrow-icon">
      </div>
    
      <button class="export-csv" @click="exportQuestionData">
        <img src="@/assets/images/export-icon.svg" alt="CSV Icon" class="csv-icon">
        <span>CSV出力</span>
      </button>
    </div>

    <div class="table-container">
        <table>
      <thead>
        <tr>
          <th class="date-cell">日付</th>
          <th v-for="question in (questionData[0]?.questions || [])" :key="question.sort">
            Q.{{ question.sort }}
            <table class="inner-table">
              <thead>
                <tr>
                  <th>間違い</th>
                  <th>正しい</th>
                  <th>合計</th>
                </tr>
              </thead>
            </table>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in paginatedQuestionData" :key="data.date">
          <td class="date-cell">{{ data.date }}</td>
          <td v-for="question in data.questions" :key="question.sort">
            <table>
              <tbody>
                <tr>
                  <td>{{ question.statsPerDay.answered - question.statsPerDay.correct }}</td>
                  <td>{{ question.statsPerDay.correct }}</td>
                  <td>{{ question.statsPerDay.answered }}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>  
    </div>
    <div class="pagination">
      <div class="rows-per-page">
        <span>表示件数:</span>
        <select v-model="rowsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div>
        <button @click="prevPage" :disabled="currentPage === 1">前へ</button>
        <span v-for="page in visiblePages" :key="page" :class="{ 'current-page': page === currentPage }">
          <button @click="goToPage(page)" v-if="page !== '...'">{{ page }}</button>
          <span v-else>{{ page }}</span>
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages">次へ</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#chart {
  max-width: 100%;
  margin: auto;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left-section {
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  text-align: center;
  color: #292D32;
}

.right-section {
  display: flex;
  align-items: center;
}

.date-picker-container {
  display: flex;
  align-items: center;
  position: relative;
}

.button-analysis {
  display: flex;
}

.date-picker {
  margin-right: 16px;
}

/* Chỉnh CSS cho input bên trong vue-date-picker */
.date-picker :deep(input) {
  display: flex;
  justify-content: center;
  width: 250px;
  height: 48px;
  border-radius: 12px;
  background-color: #f1f4f9; /* Màu nền xám */
  border: none; /* Không có đường viền */
  padding-left: 50px;
  padding-right: 16px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: center;
  color: #292D32;
}

/* Ẩn icon bên phải của input trong vue-date-picker */
.date-picker :deep(.dp--clear-btn) {
  display: none;
}


.filter-week,
.filter-month,
.export-csv {
  width: auto;
  height: 48px;
  padding: 11px 16px;
  gap: 10px;
  border-radius: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #f1f4f9;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: center;
  transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
}

.filter-week:hover,
.filter-month:hover,
.export-csv:hover {
  transform: scale(1.17); /* Phóng to khi di chuột vào */
}

.filter-week:active,
.filter-month:active,
.export-csv:active {
  transform: scale(1); /* Phóng to khi di chuột vào */
}


.filter-week.active {
  background: #2E7CF6;
  color: white;
  margin-right: 16px;
}

.filter-month.active {
  background: #2E7CF6;
  color: white;
  margin-left: 16px;
}

.export-csv {
  width: auto;
  height: 48px;
  padding: 11px 0;
  border-radius: var(--CornerMedium);
  color: #2E7CF6;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.vertical-separator {
  height: 24px;
  border-left: 1px solid #E6E8EC;
  margin: 0 12px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.forward-section {
  display: flex;
  align-items: center;
  font-family: Noto Sans JP;
  font-size: 20px;
  font-weight: 700;
  line-height: 28.96px;
  text-align: center;
  color: #6A6A6A;
}

.arrow-icon {
  margin-left: 8px;
  height: 24px;
}
.red-color {
  color: red;
}

.table-container {
  overflow-x: scroll; /* Ẩn thanh cuộn ngang */
  overflow-y: auto; /* Cho phép thanh cuộn dọc nếu cần */
  position: relative;
  white-space: nowrap; /* Ngăn không cho dòng xuống */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: none; /* Ẩn viền ngoài cùng */
  cursor: pointer; /* Hiển thị con trỏ tay khi di chuột vào bảng */
}

th, td {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #E6E8EC; /* Thêm viền phải cho tất cả các ô */
  border-bottom: 1px solid #E6E8EC; /* Thêm viền dưới cho tất cả các ô */
  min-width: 60px;
}

td:first-child {
  padding-left: 0px;
}

/* Ẩn border-right của phần tử cuối cùng trong mỗi hàng */
th:last-child, td:last-child {
  border-right: none;
}

/* Ẩn border-bottom của hàng cuối cùng */
tr:last-child td {
  border-bottom: none;
}

thead {
  background-color: transparent;
}
/* Căn lề trái cho cột chứa ngày */
.date-cell{
  text-align: left;
}

th {
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 700;
  line-height: 20.29px;
  padding: 25px 0;
}

td {
  height: 63px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 20.29px;
}

.inner-table {
  margin-top: 10px;
}

/* Thêm đường viền dọc giữa các thẻ th */
.inner-table th:nth-child(2), .inner-table th:nth-child(3) {
  border-left: 1px solid #E6E8EC;
}

th > table, td > table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

th > table th, td > table th, th > table td, td > table td {
  border: none;
  padding: 4px;
  background-color: transparent;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  background-color: #f1f4f9;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f1f4f9;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  font-weight: 500;
}

.current-page button {
  background-color: #2E7CF6;
  color: white;
}

.rows-per-page {
  display: flex;
  align-items: center;
}

.rows-per-page span {
  margin-right: 10px;
}

.rows-per-page select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
}

/* Responsive từ 768px trở lên */
@media screen and (max-width: 768px) {
  .header-container {
    flex-direction: column;
  }

  .left-section {
    display: none; /* Ẩn left-section khi màn hình nhỏ hơn */
  }
}

/* Responsive từ 576px trở lên */
@media screen and (max-width: 576px) {
  .right-section {
    flex-direction: column; /* Sắp xếp theo cột cho right-section */
  }
  .date-picker-container {
    flex-direction: column; /* Sắp xếp theo cột cho date-picker-container */
  }

  .date-picker {
    width: 100%; /* Đảm bảo date-picker chiếm toàn bộ chiều rộng */
    margin-right: 0; /* Xóa khoảng cách phải của date-picker */
    margin-bottom: 10px; /* Khoảng cách từ date-picker xuống các button */
  }

  .filter-week,
  .filter-month,
  .export-csv {
    margin-bottom: 10px; /* Khoảng cách giữa các button */
  }

  .footer-container {
    flex-direction: column; /* Chuyển sang sắp xếp theo cột cho footer-container */
    align-items: flex-start; /* Căn trái các phần tử trong footer-container */
  }
}

/* Responsive từ 480px trở lên */
@media screen and (max-width: 480px) {
  .right-section {
    flex-direction: column; /* Sắp xếp theo cột cho right-section */
  }
}

/* Responsive từ 320px trở lên */
@media screen and (max-width: 320px) {
  .header-container {
    padding: 10px; /* Thêm padding để tránh các phần tử quá gần nhau */
  }

  .rows-per-page select {
    font-size: 14px; /* Giảm kích thước font chọn số lượng bản ghi trên một trang */
  }
}

</style>