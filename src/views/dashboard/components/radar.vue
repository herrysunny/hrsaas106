<template>

  <!-- 雷达图  必须给高、宽-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>

var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  created() {
    // 实例创建完毕

  },
  //   页面渲染完毕事件
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv)

    // 指定图表的配置项和数据
    myChart.setOption = {
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle', 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: ' 张三'
            },
            {
              value: [50, 50, 50, 50, 10, 0],
              name: '李四'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style>
    .radar-echart{
        width: 600px;
        height: 400px;
    }
</style>

// import * as echarts from 'echarts';

// var chartDom = document.getElementById('main');
// var myChart = echarts.init(chartDom, 'dark');
// var option;

// option && myChart.setOption(option);
