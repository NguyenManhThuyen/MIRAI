<script setup>
import { ref, onMounted, watchEffect, computed, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from 'moment';
import axios from 'axios';
import NProgress from 'nprogress';

const series = ref([
  {
    name: '参加者数',
    data: []
  },
  {
    name: '完了者数',
    data: []
  }
]);

const chartOptions = ref({
  chart: {
    toolbar: {
      show: false
    },
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
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
      borderRadius: 2,
      borderRadiusApplication: 'end',
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
        return val + " 人々";
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
const totalPages = ref(10);
const startDate = ref('');
const endDate = ref('');

const goToPage = (page) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const range = 1; // Number of pages to show before and after the current page
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
  endDate.value = moment().format('DD/MM/yyyy');
  startDate.value = moment().subtract(7, 'days').format('DD/MM/yyyy');
  fetchData();
  fetchQuestionData();
  fetchPageData();
};

const filterMonth = async () => {
  activeFilter.value = 'month';
  endDate.value = moment().format('DD/MM/yyyy');
  startDate.value = moment().startOf('month').format('DD/MM/yyyy');
  fetchData();
  fetchQuestionData();
  fetchPageData();
};

const exportCSV = (data, fileName) => {
  // Thêm BOM cho mã hóa UTF-8
  const bom = "\uFEFF";
  let csvContent = bom +
    "日,";

  // Thêm tiêu đề cột cho các câu hỏi
  const questions = data[0]?.questions || [];
  questions.forEach((question, index) => {
    csvContent += `Q.${question.sort} - 正しくない,Q.${question.sort} - 正しい,Q.${question.sort} - 合計,`;
  });
  csvContent += "\n";

  // Thêm dữ liệu vào các hàng
  data.forEach((item) => {
    csvContent += `'${item.date},`;
    item.questions.forEach((question) => {
      csvContent += `${question.statsPerDay.answered - question.statsPerDay.correct},`;
      csvContent += `${question.statsPerDay.correct},`;
      csvContent += `${question.statsPerDay.answered},`;
    });
    csvContent += "\n";
  });

  // Tạo đối tượng Blob với loại MIME là "text/csv" và mã hóa là "UTF-8"
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Tạo URL đối tượng từ blob
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Dọn dẹp URL đối tượng
  }
};


const exportQuestionData = () => {
  exportCSV(questionData.value, "question_statistics.csv");
};

const exportSeriesData = () => {
  const data = exportChart.value; // Dữ liệu từ chartOptions.value.xaxis.categories
  const fileName = "series_data.csv";

  // Thêm BOM cho mã hóa UTF-8
  const bom = "\uFEFF";
  let csvContent = bom +
    "日,参加者,終了した\n";

  data.forEach((item, index) => {
    // Thêm ký tự ' vào trước ngày để Excel hiểu đúng định dạng
    csvContent += `'${item},${series.value[0].data[index]},${series.value[1].data[index]}\n`;
  });

  // Tạo blob với loại MIME là "text/csv" và mã hóa là "UTF-8"
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Tạo URL đối tượng từ blob
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Dọn dẹp URL đối tượng
  }
};


function formatDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

const fetchData = async () => {
  NProgress.start();
  NProgress.set(0.4);

  try {
    // Chuyển đổi định dạng ngày tháng cho API URL
    const startDatee = formatDate(startDate.value);
    const endDatee = formatDate(endDate.value);

    // URL cho hai API
    const statsApiUrl = `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-statistic-lambda?start_date=${startDatee}&end_date=${endDatee}`;

    // Gửi yêu cầu lấy dữ liệu song song
    const statsResponse = await axios.get(statsApiUrl);

    const apiData = statsResponse.data;

    // Xử lý dữ liệu từ API thống kê
    const trueCounts = [];
    const totalCounts = [];
    const dates = [];

    for (const item of apiData) {
      const { created_at, join_count, done_count } = item;
      dates.push(created_at);
      totalCounts.push(join_count);
      trueCounts.push(done_count);
    }

    const sortedDates = [...dates].sort((a, b) => moment(a, 'YYYY-MM-DD').diff(moment(b, 'YYYY-MM-DD')));
    const sortedTotalCounts = sortedDates.map(date => totalCounts[dates.indexOf(date)]);
    const sortedTrueCounts = sortedDates.map(date => trueCounts[dates.indexOf(date)]);

    series.value[0].data = sortedTotalCounts;
    series.value[1].data = sortedTrueCounts;
    chartOptions.value.xaxis.categories = sortedDates.map(date => moment(date, 'YYYY-MM-DD').format('DD/MM'));
    exportChart.value = sortedDates.map(date => moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'));

    chartKey.value++; // Buộc render lại biểu đồ

  } catch (error) {
    console.error('Error fetching API data:', error);
  } finally {
    NProgress.done();
  }
};
const fetchPageData = async () => {
  NProgress.start();
  NProgress.set(0.4);
  try {
    const startDatee = formatDate(startDate.value);
    const endDatee = formatDate(endDate.value);

    // Gửi yêu cầu lấy tổng số trang
    const apiUrlPage = `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-analysis-lambda/totalUserPerQuestion?limit=${rowsPerPage.value}&startDate=${startDatee}&endDate=${endDatee}`;
    const responsePage = await axios.get(apiUrlPage);

    // Kiểm tra cấu trúc dữ liệu và tính toán số trang
    if (responsePage.data && responsePage.data.totalPages) {
      totalPages.value = Math.ceil(responsePage.data.totalPages);
    } else {
      console.error('Dữ liệu không hợp lệ từ API tổng số trang.');
      return;
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu câu hỏi:', error);
  }
  NProgress.done();
};

const fetchQuestionData = async () => {
  NProgress.start();
  NProgress.set(0.4);
  try {
    // Chuyển đổi định dạng ngày tháng cho API URL
    const startDatee = formatDate(startDate.value);
    const endDatee = formatDate(endDate.value);

    // Gửi yêu cầu lấy dữ liệu phân trang
    const apiUrl = `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-analysis-lambda/totalUserPerQuestion?page=${currentPage.value}&limit=${rowsPerPage.value}&startDate=${startDatee}&endDate=${endDatee}`;
    const response = await axios.get(apiUrl);

    // Kiểm tra cấu trúc dữ liệu trả về
    if (response.data) {
      questionData.value = [...response.data];
    } else {
      console.error('Dữ liệu không hợp lệ từ API dữ liệu câu hỏi.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu câu hỏi:', error);
  }
  NProgress.done();
};

// Lấy dữ liệu từ API khi component được mount
onMounted(() => {
  filterWeek();
  NProgress.done();
});

// Theo dõi sự thay đổi của selectedDate
watch(selectedDate, (newVal, oldVal) => {
  if (newVal && newVal.length === 2) {
    startDate.value = moment(newVal[0]).format('DD/MM/yyyy');
    endDate.value = moment(newVal[1]).format('DD/MM/yyyy');
    activeFilter.value = "year";
    fetchData();
    fetchQuestionData();
    fetchPageData();
  }
});

watch(rowsPerPage, () => {
  currentPage.value = 1;
  fetchQuestionData();
  fetchPageData();
});

watch(currentPage, () => {
  fetchQuestionData();
  fetchPageData();
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
          <vue-date-picker v-model="selectedDate" type="daterange" format="dd/MM/yyyy" range class="date-picker">
            <template #calendar-header="{ index, day }">
              <div :class="index === 5 || index === 6 ? 'red-color' : ''">
                {{ day }}
              </div>
            </template>
            <template #input-icon>
              <div
                style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; pointer-events: none;">
                <img src="@/assets/images/calendar-icon.svg" class="centered-icon" />
              </div>
            </template>
          </vue-date-picker>
        </div>

        <div class="button-analysis">
          <button :class="{ 'filter-week': true, 'active': activeFilter === 'week' }" @click="filterWeek">
            今週
          </button>
          <button :class="{ 'filter-month': true, 'active': activeFilter === 'month' }" @click="filterMonth">
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
    <apexchart ref="chartRef" v-if="chartData" type="bar" height="600" :options="chartOptions" :series="chartData"
      :key="chartKey">
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
                    <th>正解</th>
                    <th>不正解</th>
                    <th>合計</th>
                  </tr>
                </thead>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in questionData" :key="data.date">
            <td class="date-cell">{{ data.date }}</td>
            <td v-for="question in data.questions" :key="question.sort">
              <table>
                <tbody>
                  <tr>
                    <td>{{ question.statsPerDay.correct }}</td>
                    <td>{{ question.statsPerDay.answered - question.statsPerDay.correct }}</td>
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
      <div class="page">
        <button class="hidden" @click="prevPage" :disabled="currentPage === 1">前へ</button>
        <span v-for="page in visiblePages" :key="page" :class="{ 'current-page': page === currentPage }">
          <button @click="goToPage(page)" v-if="page !== '...'">{{ page }}</button>
          <span v-else>{{ page }}</span>
        </span>
        <button class="hidden" @click="nextPage" :disabled="currentPage === totalPages">次へ</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

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

/* Chỉnh CSS cho input bên trong vue-date-picker */
.date-picker :deep(input) {
  display: flex;
  justify-content: center;
  width: 280px;
  height: 48px;
  border-radius: 12px;
  background-color: #f1f4f9;
  /* Màu nền xám */
  border: none;
  /* Không có đường viền */
  padding-left: 45px;
  padding-right: 16px;
  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: center;
  color: #292D32;
}

.date-picker .dp__input-icon img {
  width: 20px;
  /* Kích thước icon */
  height: 20px;
}

/* Thay đổi giao diện của Vue Datepicker */
.date-picker {
  --dp-menu-min-width: 260px;
  /*Adjust the min width of the menu*/
  --dp-font-family: 'Noto Sans JP';
  --dp-border-radius: 12px;
  /*Configurable border-radius*/
  --dp-cell-border-radius: 4px;
  --dp-month-year-row-button-size: 35px;
  /*Specific height for the next/previous buttons*/
  --dp-button-icon-height: 24px;
  /*Icon sizing in buttons*/
  --dp-cell-size: 40px;
  /*Width and height of calendar cell*/
  --dp-cell-padding: 3px;
  /*Padding in the cell*/

  --dp-action-buttons-padding: 4px 12px;
  /*Adjust padding for the action buttons in action row*/
  --dp-row-margin: 5px 5px;
  /*Adjust the spacing between rows in the calendar*/
}

/* Thay đổi màu cho các ngày cuối tuần */
.date-picker .dp__calendar .dp__day.red-color {
  color: #ff0000;
  /* Màu chữ cho các ngày cuối tuần */
}

/* Ẩn icon bên phải của input trong vue-date-picker */
.date-picker :deep(.dp--clear-btn),
.date-picker :deep(.dp__icon.dp__clear_icon.dp__input_icons),
.date-picker :deep(.dp__btn.dp__button.dp__overlay_action),
.date-picker :deep(.dp--tp-wrap) {
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
  transition: transform 0.3s ease-in-out;
  /* Thêm hiệu ứng transition */
  margin-left: 16px;
}

.filter-week:hover,
.filter-month:hover,
.export-csv:hover {
  transform: scale(1.17);
  /* Phóng to khi di chuột vào */
}

.filter-week:active,
.filter-month:active,
.export-csv:active {
  transform: scale(1);
  /* Phóng to khi di chuột vào */
}


.filter-week.active {
  background: #2E7CF6;
  color: white;
}

.filter-month.active {
  background: #2E7CF6;
  color: white;
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
  margin-top: 8.5px;
  height: 31px;
  border-left: 1px solid #E6E8EC;
  margin-left: 16px;
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
  overflow-x: scroll;
  /* Ẩn thanh cuộn ngang */
  overflow-y: auto;
  /* Cho phép thanh cuộn dọc nếu cần */
  position: relative;
  white-space: nowrap;
  /* Ngăn không cho dòng xuống */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: none;
  /* Ẩn viền ngoài cùng */
  cursor: pointer;
  /* Hiển thị con trỏ tay khi di chuột vào bảng */
}

th,
td {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #E6E8EC;
  /* Thêm viền phải cho tất cả các ô */
  border-bottom: 1px solid #E6E8EC;
  /* Thêm viền dưới cho tất cả các ô */
  min-width: 60px;
}

td:first-child {
  padding-left: 0px;
}

/* Ẩn border-right của phần tử cuối cùng trong mỗi hàng */
th:last-child,
td:last-child {
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
.date-cell {
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
.inner-table th:nth-child(2),
.inner-table th:nth-child(3) {
  border-left: 1px solid #E6E8EC;
}

th>table,
td>table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

th>table th,
td>table th,
th>table td,
td>table td {
  border: none;
  padding: 4px;
  background-color: transparent;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
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
  font-family: Noto Sans JP;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f1f4f9;
  cursor: pointer;
  outline: none;
}

/* Responsive từ 768px trở lên */
@media screen and (max-width: 768px) {
  .header-container {
    flex-direction: column;
  }

  .left-section {
    display: none;
    /* Ẩn left-section khi màn hình nhỏ hơn */
  }
}

/* Responsive từ 576px trở lên */
@media screen and (max-width: 576px) {
  .right-section {
    flex-direction: column;
    /* Sắp xếp theo cột cho right-section */
  }

  .date-picker-container {
    flex-direction: column;
    /* Sắp xếp theo cột cho date-picker-container */
  }

  .date-picker {
    width: 100%;
    /* Đảm bảo date-picker chiếm toàn bộ chiều rộng */
    margin-right: 0;
    /* Xóa khoảng cách phải của date-picker */
    margin-bottom: 10px;
    /* Khoảng cách từ date-picker xuống các button */
  }

  .filter-week,
  .filter-month,
  .export-csv {
    margin-bottom: 10px;
    /* Khoảng cách giữa các button */
  }


  .pagination {
    flex-direction: column;
  }

  .rows-per-page {
    margin-bottom: 12px;
  }

  .filter-week {
    margin-left: 0px;
  }

  /* Chỉnh CSS cho input bên trong vue-date-picker */
  .date-picker :deep(input) {
    width: 450px;
    margin-bottom: 4px 0 16px 0;
  }
}

/* Responsive từ 480px trở lên */
@media screen and (max-width: 480px) {
  .right-section {
    flex-direction: column;
    /* Sắp xếp theo cột cho right-section */
  }

  .page {
    justify-content: space-between;
  }

  .filter-week,
  .filter-month,
  .export-csv,
  .vertical-separator {
    margin-left: 14px;
  }

  /* Chỉnh CSS cho input bên trong vue-date-picker */
  .date-picker :deep(input) {
    width: 350px;
    margin-bottom: 4px 0 16px 0;
  }
}

@media screen and (max-width: 420px) {
  .hidden {
    display: none;
  }

  .filter-week,
  .filter-month,
  .export-csv,
  .vertical-separator {
    margin-left: 12px;
  }

  /* Chỉnh CSS cho input bên trong vue-date-picker */
  .date-picker :deep(input) {
    width: 320px;
    margin-bottom: 4px 0 16px 0;
  }
}

/* Responsive từ 320px trở lên */
@media screen and (max-width: 320px) {
  .header-container {
    padding: 10px;
    /* Thêm padding để tránh các phần tử quá gần nhau */
  }

  .rows-per-page select {
    font-size: 14px;
    /* Giảm kích thước font chọn số lượng bản ghi trên một trang */
  }

  /* Chỉnh CSS cho input bên trong vue-date-picker */
  .date-picker :deep(input) {
    width: 260px;
    margin-bottom: 4px 0 16px 0;
  }
}
</style>