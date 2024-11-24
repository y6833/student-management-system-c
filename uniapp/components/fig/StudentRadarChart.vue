<template>
  <div class="radar-chart-container">
    <div id="StudentRadarChart"></div>
  </div>
</template>
    
<script>
import * as echarts from "echarts";
export default {
  name: "StudentRadarChart",
  props: ["subRankList", "examValue"],
  data() {
    return {
      studentScoreList: [], //学生成绩
      ScoreAveList: [], //平均成绩
      courseMAxList: [],
    };
  },
  watch: {
    subRankList: {
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
    examValue: {
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.showChart();
    // 添加窗口resize监听
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 移除resize监听
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      const chartDom = document.getElementById("StudentRadarChart");
      if (chartDom) {
        const chart = echarts.getInstanceByDom(chartDom);
        chart && chart.resize();
      }
    },
    async showChart() {
      this.studentScoreList = [];
      this.ScoreAveList = [];
      this.courseMAxList = [];
      
      let chartDom = document.getElementById("StudentRadarChart");
      let myChart = echarts.init(chartDom);
      let option;

      if (this.subRankList.length > 0) {
        this.subRankList.forEach((element) => {
          let courseMax = {
            name: "",
            max: 0,
          };
          if (element.course != "总分") {
            this.studentScoreList.push(element.subject);
            this.ScoreAveList.push(element.average);
            courseMax.name = element.course;
            courseMax.max = element.max;
            this.courseMAxList.push(courseMax);
          }
        });

        option = {
          title: {
            text: '成绩分析雷达图',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#303133',
              fontSize: 16,
              fontWeight: 500
            }
          },
          backgroundColor: '#ffffff',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ebeef5',
            borderWidth: 1,
            padding: [10, 15],
            textStyle: {
              color: '#606266',
              fontSize: 14
            },
            formatter: (params) => {
              return `${params.name}<br/>${params.marker}分数：${params.value}`;
            }
          },
          legend: {
            data: ['个人成绩', '年级平均'],
            bottom: 0,
            itemWidth: 14,
            itemHeight: 14,
            textStyle: {
              color: '#606266',
              fontSize: 13
            },
            itemStyle: {
              borderWidth: 0
            }
          },
          radar: {
            center: ['50%', '50%'],
            radius: '65%',
            splitNumber: 4,
            shape: 'circle',
            axisName: {
              color: '#606266',
              fontSize: 12,
              padding: [4, 8],
              formatter: (name) => {
                if (name.length > 4) {
                  return name.substring(0, 4) + '...';
                }
                return name;
              }
            },
            splitArea: {
              areaStyle: {
                color: ['#f8f9fb', '#f0f2f5', '#e6e8eb', '#dcdfe6'],
                shadowColor: 'rgba(0, 0, 0, 0.05)',
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: '#dcdfe6'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#ebeef5'
              }
            },
            indicator: this.courseMAxList || []
          },
          series: [
            {
              name: '成绩对比',
              type: 'radar',
              data: [
                {
                  value: this.studentScoreList,
                  name: '个人成绩',
                  symbol: 'circle',
                  symbolSize: 6,
                  lineStyle: {
                    width: 2,
                    color: '#409EFF'
                  },
                  areaStyle: {
                    color: 'rgba(64, 158, 255, 0.2)'
                  },
                  itemStyle: {
                    color: '#409EFF'
                  },
                  label: {
                    show: true,
                    color: '#409EFF',
                    fontSize: 12,
                    formatter: '{c}'
                  }
                },
                {
                  value: this.ScoreAveList,
                  name: '年级平均',
                  symbol: 'circle',
                  symbolSize: 6,
                  lineStyle: {
                    width: 2,
                    color: '#67c23a'
                  },
                  areaStyle: {
                    color: 'rgba(103, 194, 58, 0.2)'
                  },
                  itemStyle: {
                    color: '#67c23a'
                  },
                  label: {
                    show: true,
                    color: '#67c23a',
                    fontSize: 12,
                    formatter: '{c}'
                  }
                }
              ]
            }
          ]
        };
        
        option && myChart.setOption(option);
      }
    },
  },
};
</script>
    
<style scoped>
.radar-chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

#StudentRadarChart {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

@media screen and (max-width: 768px) {
  .radar-chart-container,
  #StudentRadarChart {
    min-height: 300px;
  }
}
</style>