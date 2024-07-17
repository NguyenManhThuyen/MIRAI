<script setup>
import { ref, watchEffect } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from 'moment';
import axios from 'axios';

const series = ref([
  {
    name: '参加者',
    //data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  },
  {
    name: '終了した',
    data: []
    //data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }
]);


const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
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
        return  val + " 人々"
      }
    }
  }
});


const selectedDate = ref(null);
const chartData = ref(series);
const chartRef = ref(null);
const chartKey = ref(0); // Key variable to force re-render

const filterWeek = () => {
  const endDate = moment().format('DD/MM/yyyy');
  const startDate = moment().subtract(7, 'days').format('DD/MM/yyyy');
  fetchData(startDate, endDate);
};

const filterMonth = async () => {
  const endDate = moment().format('DD/MM/yyyy');
  const startDate = moment().startOf('month').format('DD/MM/yyyy');
  fetchData(startDate, endDate);
};


const exportCSV = () => {

};

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

const fetchData = async (startDate, endDate) => {
  try {
    const apiUrl = `https://naadstkfr7.execute-api.ap-southeast-1.amazonaws.com/mirai-analysis-lambda/totalUser?startdate=${startDate}&enddate=${endDate}`;
    const response = await axios.get(apiUrl);
    const apiData = response.data;

    // Tạo mảng để lưu số true và tổng số true + false của từng ngày
    const trueCounts = [];
    const totalCounts = [];
    const dates = [];

    // Duyệt qua các phần tử của apiData
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

    // Cập nhật dữ liệu cho biểu đồ
    series.value[0].data = trueCounts;
    series.value[1].data = totalCounts;
    chartOptions.value.xaxis.categories = dates.map(date => moment(date, 'DD/MM/YYYY').format('DD/MM'));

    chartKey.value++; // Buộc render lại biểu đồ
  } catch (error) {
    console.error('Error fetching API data:', error);
  }
};


// Lấy dữ liệu từ API khi component được mount
onMounted(() => {
  filterMonth();
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
              <img src="@/assets/images/calendar-icon.svg" />
            </template>
          </vue-date-picker>
        </div>
        <button class="filter-week" @click="filterWeek">今週</button>
        <button class="filter-month" @click="filterMonth">今月</button>
        <div class="vertical-separator"></div>
        <button class="export-csv" @click="exportCSV">
          <img src="@/assets/images/export-icon.svg" alt="CSV Icon" class="csv-icon">
          <span>CSV出力</span>
        </button>
      </div>
    </div>
    <apexchart ref="chartRef" v-if="chartData" type="bar" height="350" :options="chartOptions" :series="chartData" :key="chartKey">
    </apexchart>

    <div class="forward-section">
      <span>前進</span>
      <img src="@/assets/images/arrow-right-icon.svg" class="arrow-icon">
    </div>
  
    <button class="export-csv" @click="exportCSV">
      <img src="@/assets/images/export-icon.svg" alt="CSV Icon" class="csv-icon">
      <span>CSV出力</span>
    </button>
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

.date-picker {
  margin-right: 16px;
}

/* Chỉnh CSS cho input bên trong vue-date-picker */
.date-picker :deep(input) {
  display: flex;
  justify-content: center;
  height: 48px;
  border-radius: 12px;
  background-color: #f1f4f9; /* Màu nền xám */
  border: none; /* Không có đường viền */

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


.input-slot-image {
  display: flex;
  justify-content: center;
  height: 24px;
  width: auto;
  right: 16px; /* Canh phải cách lề 16px */
  z-index: 1;
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

  font-family: Noto Sans JP;
  font-size: 16px;
  font-weight: 500;
  line-height: 23.17px;
  text-align: center;

}

.filter-week {
  background: #F1F4F9;
  color: black;
  margin-right: 16px;
}

.filter-month {
  background: #2E7CF6;
  color: white;
  margin-right: 16px;
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
  width: 1px;
  height: 24px;
  background-color: #ccc;
  margin-right: 16px;
}

.red-color {
  color: red;
}
</style>