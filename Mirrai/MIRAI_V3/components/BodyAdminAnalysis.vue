<template>
  <div id="chart">
    <div class="header-container">
      <div class="left-section">
        <span>参加と完了の統計</span>
      </div>
      <div class="right-section">
        <div class="date-picker-container">
          <vue-date-picker
            id="datePicker"
            v-model="selectedDate"
            type="daterange"
            format="yyyy-MM-dd"
            range
            class="date-picker"
          ></vue-date-picker>
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
    <apexchart ref="chartRef" v-if="chartData" type="bar" height="350" :options="chartOptions" :series="chartData"></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const series = [
  {
    name: '参加者',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  },
  {
    name: '終了した',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }
];

const chartOptions = {
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
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
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
        return "$ " + val + " thousands"
      }
    }
  }
};

const selectedDate = ref(null);
const chartData = ref(series);
const chartRef = ref(null);

const updateChartData = () => {
  if (selectedDate.value) {
    const startDate = selectedDate.value[0];
    const endDate = selectedDate.value[1];
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
  } else {
    console.error('No date range selected');
  }
};

const filterWeek = () => {
  // Logic to filter data for the current week
};

const filterMonth = () => {
  // Logic to filter data for the current month
};

const exportCSV = () => {

};
</script>

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
}

.date-picker {
  margin-right: 16px;
}

.filter-week, .filter-month, .export-csv {
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

</style>
