<template>
  <div>
    <!-- <h1>我是首页</h1> -->
    <div id="con"></div>
  </div>
</template>

<script>
// 引入数据图表库
import Echart from "echarts"
export default {
  data () {
    return {

    };
  },
  mounted () {
    console.log(this, '组件实例')
    let myChart = Echart.init(document.getElementById("con"));
    var data = [];

    for (var i = 0; i <= 100; i++) {
      var theta = i / 100 * 360;
      var r = 5 * (1 + Math.sin(theta / 180 * Math.PI));
      data.push([r, theta]);
    }

    let options = {
      title: {
        text: '相互吹捧，共同进步'
      },
      legend: {
        data: ['line']
      },
      polar: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      angleAxis: {
        type: 'value',
        startAngle: 0
      },
      radiusAxis: {
      },
      series: [{
        coordinateSystem: 'polar',
        name: 'line',
        type: 'line',
        data: data
      }]
    };
    //设置创建好的配置项
    myChart.setOption(options)
  },
};
</script>

<style  lang="" scoped>

#con {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  background-color: chartreuse;
}
</style>
