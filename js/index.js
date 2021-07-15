$(document).ready(function () {
  function minSecFormatter (t) {
    const date = new Date(t)
    return date.getHours().toString().padStart(2, '0') + ':'
                            + date.getMinutes().toString().padStart(2, '0') + ':'
                            + date.getSeconds().toString().padStart(2, '0')
  }

  function getCpuData () {
    const datas = window.cpuData.data
    const frequency = []
    const power = []
    const temperature = []
    $.each(datas, function (i, d) {
      frequency.push(d.frequency)
      power.push(d.power)
      temperature.push(d.temperature)
    })
    return {
      frequency: frequency,
      power: power,
      temperature: temperature
    }
  }

  const cpuResults = getCpuData()

  function cpuDataGenerator (data = [], type = 'frequency', max = 999, min = 0, count = 10) {
    const _data = [].concat(data)

    function randomNumber () {
      return (Math.random() * (max - min) + min).toFixed(0)
    }

    if (!_data.length) {
      return new Array(count).fill(undefined).map(() => cpuResults[type][randomNumber()])
    }
    _data.push(cpuResults[type][randomNumber()])
    _data.splice(0, 1)
    return _data
  }

  function dataGenerator (data = [], max = 100, min = 80, count = 10, fix = 0) {
    const _data = [].concat(data)

    function randomNumber () {
      return (Math.random() * (max - min) + min).toFixed(fix)
    }

    if (!_data.length) {
      return new Array(count).fill(undefined).map(() => randomNumber())
    }
    _data.push(randomNumber())
    _data.splice(0, 1)
    return _data
  }

  function secondGenerator (data = [], count = 10) {
    // const _data = [].concat(data)
    const now = new Date()
    if (!data.length) {
      const secArr = []
      for (let i = 0; i < count; i++) {
        secArr.unshift(minSecFormatter(now.getTime() - 1000 * i))
      }
      return secArr
    } else {
      data.shift()
      data.push(minSecFormatter(now.getTime()))
      return data
    }
  }

  function freqChartRender () {
    let x = secondGenerator()
    // let y = dataGenerator()
    let y = cpuDataGenerator([], 'frequency')

    var chartDom = document.getElementById('freqChart')
    var myChart = echarts.init(chartDom)

    function render () {
      var option = {
        title: {
          text: 'CPU 频率',
          textAlign: 'left',
          textStyle: {
            color: '#ffffff',
            fontWeight: 'normal'
          },
          padding: [10, 17]
        },
        xAxis: {
          type: 'category',
          data: x,
          axisLabel: {
            color: '#fff'
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          name: 'MHz',
          max: 2500,
          min: 2000,
          nameTextStyle: {
            color: '#48b1fe'
          },
          splitLine: {
            lineStyle: {
              color: '#48b1fe',
              opacity: 0.5
            }
          },
          axisLabel: {
            color: '#48b1fe'
          }
        },
        series: [{
          data: y,
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#00a8ff' // 0% 处的颜色
            },
              {
                offset: 1,
                color: '#00ffcc' // 100% 处的颜色
              }
            ]),
            opacity: 0.7
          },
          markArea: {
            silent: false,
            itemStyle: {
              opacity: 0.3
            },
            data: [
              [{
                x: '60px'
              }, {
                x: '540px'
              }]
            ]
          },
          lineStyle: {
            color: '#00a1f8'
          }
        }]
      }
      option && myChart.setOption(option)
      $('#currentFreq').html(y[y.length - 1])
    }

    function update () {
      x = secondGenerator(x)
      // y = dataGenerator(y)
      y = cpuDataGenerator(y, 'frequency')
      // render()
      myChart.setOption({
        xAxis: {
          data: x,
        },
        series: [{
          data: y,
        }]
      })
    }

    return { render, update }

  }

  function tempChartRender () {
    let x = secondGenerator()
    // let y = dataGenerator()
    let y = cpuDataGenerator([], 'temperature')

    var chartDom = document.getElementById('temp')
    var myChart = echarts.init(chartDom)

    function render () {
      var option = {
        title: {
          text: 'CPU 温度',
          textAlign: 'left',
          textStyle: {
            color: '#ffffff',
            fontWeight: 'normal'
          },
          padding: [10, 17]
        },
        xAxis: {
          type: 'category',
          data: x,
          axisLabel: {
            color: '#fff'
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          name: '℃',
          min: 30,
          max: 100,
          nameTextStyle: {
            color: '#48b1fe'
          },
          splitLine: {
            lineStyle: {
              color: '#48b1fe',
              opacity: 0.5
            }
          },
          axisLabel: {
            color: '#48b1fe'
          }
        },
        series: [{
          data: y,
          type: 'line',
          markArea: {
            silent: false,
            itemStyle: {
              opacity: 0.3
            },
            data: [
              [{
                x: '60px'
              }, {
                x: '540px'
              }]
            ]
          },
          lineStyle: {
            color: '#00a1f8'
          }
        }]
      }
      option && myChart.setOption(option)
      $('#currentTemp').html(y[y.length - 1])
    }

    function update () {
      x = secondGenerator(x)
      // y = dataGenerator(y)
      y = cpuDataGenerator(y, 'temperature')
      render()
    }

    return { render, update }

  }

  function power2ChartRender () {
    let x = secondGenerator()
    // let y = dataGenerator()
    let y = cpuDataGenerator([], 'power')
    var chartDom = document.getElementById('power2')
    var myChart = echarts.init(chartDom)

    function render () {
      var option = {
        title: {
          text: 'CPU 功耗',
          textAlign: 'left',
          textStyle: {
            color: '#ffffff',
            fontWeight: 'normal'
          },
          padding: [10, 17],
        },
        xAxis: {
          type: 'category',
          data: x,
          axisLabel: {
            color: '#fff'
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          name: 'W',
          nameTextStyle: {
            color: '#48b1fe'
          },
          min: 100,
          splitLine: {
            lineStyle: {
              color: '#48b1fe',
              opacity: 0.5
            }
          },
          axisLabel: {
            color: '#48b1fe'
          }
        },
        series: [{
          data: y,
          type: 'line',
          markArea: {
            silent: false,
            itemStyle: {
              opacity: 0.3
            },
            data: [
              [{
                x: '60px'
              }, {
                x: '540px'
              }]
            ]
          },
          lineStyle: {
            color: '#00a1f8'
          }
        }]
      }
      option && myChart.setOption(option)
      $('#currentPower').html(y[y.length - 1])
    }

    function update () {
      x = secondGenerator(x)
      // y = dataGenerator(y)
      y = cpuDataGenerator(y, 'power')
      render()
    }

    return { render, update }

  }

  function waterTempChartRender () {
    let x = secondGenerator()
    let y = dataGenerator([], 39, 37)
    var chartDom = document.getElementById('waterTemp')
    var myChart = echarts.init(chartDom)

    function render () {
      var option = {
        title: {
          text: '水温',
          textAlign: 'left',
          textStyle: {
            color: '#ffffff',
            fontWeight: 'normal'
          },
          padding: [10, 17]
        },
        xAxis: {
          type: 'category',
          data: x,
          axisLabel: {
            color: '#fff'
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          name: '℃',
          min: 30,
          max: 50,
          nameTextStyle: {
            color: '#48b1fe'
          },
          splitLine: {
            lineStyle: {
              color: '#48b1fe',
              opacity: 0.5
            }
          },
          axisLabel: {
            color: '#48b1fe'
          }
        },
        series: [{
          data: y,
          type: 'line',
          markArea: {
            silent: false,
            itemStyle: {
              opacity: 0.3
            },
            data: [
              [{
                x: '60px'
              }, {
                x: '540px'
              }]
            ]
          },
          lineStyle: {
            color: '#00a1f8'
          }
        }]
      }
      option && myChart.setOption(option)
      $('#current_water_temp').html(y[y.length - 1] + '<span class="unit">℃</span>')
    }

    function update () {
      x = secondGenerator(x)
      y = dataGenerator(y, 39, 37)
      render()
    }

    return { render, update }

  }

  function speedChartRender () {
    let x = secondGenerator()
    let y = dataGenerator([], 0.5, 0.3, 10, 1)
    var chartDom = document.getElementById('speed')
    var myChart = echarts.init(chartDom)

    function render () {
      var option = {
        title: {
          text: '流速',
          textAlign: 'left',
          textStyle: {
            color: '#ffffff',
            fontWeight: 'normal'
          },
          padding: [10, 17]
        },
        xAxis: {
          type: 'category',
          data: x,
          axisLabel: {
            color: '#fff'
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          name: 'LPM',
          min: 0,
          max: 0.5,
          nameTextStyle: {
            color: '#48b1fe'
          },
          splitLine: {
            lineStyle: {
              color: '#48b1fe',
              opacity: 0.5
            }
          },
          axisLabel: {
            color: '#48b1fe'
          }
        },
        series: [{
          data: y,
          type: 'line',
          markArea: {
            silent: false,
            itemStyle: {
              opacity: 0.3
            },
            data: [
              [{
                x: '60px'
              }, {
                x: '540px'
              }]
            ]
          },
          lineStyle: {
            color: '#00a1f8'
          }
        }]
      }
      option && myChart.setOption(option)
      $('#current_speed').html(y[y.length - 1] + '<span class="unit">LPM</span>')
    }

    function update () {
      x = secondGenerator(x)
      y = dataGenerator(y, 0.5, 0.3, 10, 1)
      render()
    }

    return { render, update }

  }

  function power1Render () {
    var chartDom = document.getElementById('power1')
    var myChart = echarts.init(chartDom)

    const data = gflops.sort(function (a, b) {
      return Math.random() > .5 ? -1 : 1
    })

    let index = 0

    // 取最新的n条数据，不足则全取
    function getData (count = 1) {
      const _data = [].concat(data)
      return _data.splice(Math.max(index - 1 - count, 0), Math.min(count, index + 1))
    }

    function getAve (arr) {
      if (arr.length) {
        return ((arr.reduce(function (prev, curr) {
          return prev + curr
        }) / arr.length) / 1000).toFixed(1)
      }
      return 0
    }

    function render () {
      const lastestData = (getData()[0] / 1000).toFixed(1)
      var dataArr = [{
        value: lastestData,
      }]
      $('#power1value').html(lastestData)
      $('#powerAve1').html(getAve(getData(1)))
      $('#powerAve2').html(getAve(getData(10)))
      $('#powerAve3').html(getAve(getData(30)))
      $('#powerAve4').html(getAve(getData(50)))
      var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        offset: 0,
        color: '#72eb01' // 0% 处的颜色
      },
        // {
        //   offset: 0.17,
        //   color: '#468EFD' // 100% 处的颜色
        // },
        {
          offset: 0.5,
          color: '#fec601' // 100% 处的颜色
        },
        {
          offset: 1,
          color: '#f50b0b' // 100% 处的颜色
        }
      ])
      var colorSet = [
        [1, color],
        // [0.91, color],
        // [1, '#FFF']
      ]
      var rich = {
        white: {
          fontSize: 50,
          color: '#fff',
          fontWeight: '500',
          padding: [-150, 0, 0, 0]
        },
        bule: {
          fontSize: 70,
          fontFamily: 'DINBold',
          color: '#fff',
          fontWeight: '700',
          padding: [-120, 0, 0, 0],
        },
        radius: {
          width: 350,
          height: 80,
          // lineHeight:80,
          borderWidth: 1,
          borderColor: '#0092F2',
          fontSize: 50,
          color: '#fff',
          backgroundColor: '#1B215B',
          borderRadius: 20,
          textAlign: 'center',
        },
        size: {
          height: 400,
          padding: [100, 0, 0, 0]
        }
      }

      option = {

        series: [
          {
            type: 'gauge',
            name: '外层辅助',
            radius: '74%',
            startAngle: '225',
            endAngle: '-45',
            splitNumber: '120',
            center: ['50%', '55%'],
            pointer: {
              show: false
            },
            detail: {
              show: false,
            },
            data: [{
              value: 1
            }],
            // data: [{value: 1, name: 90}],
            title: {
              show: true,
              offsetCenter: [0, 30],
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 20,
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colorSet,
                width: 2,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              length: 20,
              lineStyle: {
                color: '#051932',
                width: 0,
                type: 'solid',
              },
            },
            axisLabel: {
              show: false
            }
          },
          {
            type: 'gauge',
            radius: '70%',
            startAngle: '225',
            endAngle: '-45',
            center: ['50%', '55%'],
            max: 5,
            min: 2,
            pointer: {
              show: true,
              length: '120%',
              itemStyle: {
                color: '#fe8101'
              }
            },
            detail: {
              show: false,
              // formatter: function (value) {
              //   return value
              // },
              // rich: rich,
              // 'offsetCenter': ['0%', '55%'],
            },
            data: dataArr,
            title: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colorSet,
                width: 20,
                // shadowBlur: 15,
                // shadowColor: '#B0C4DE',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false,
              splitNumber: 0.5
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              distance: -60,
              color: '#999',
              fontSize: 20,
              // formatter: function (value) {
              //   if (value === 0) {
              //     return 0;
              //   }
              //   else if (value === 0.5) {
              //     return 0.5;
              //   }
              //   else if (value === 1) {
              //     return 1.0;
              //   }
              //   else if (value === 1.5) {
              //     return 1.5;
              //   }
              //   else if (value === 2.0) {
              //     return 2.0;
              //   }
              // }
            },
            animationDuration: 4000,
          },
          { //内圆
            type: 'pie',
            radius: '30%',
            center: ['50%', '55%'],
            data: dataArr,
            z: 999,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(.5, .5, .8, [{
                  offset: 0,
                  color: '#00d4e6'
                },
                  {
                    offset: .5,
                    color: '#00d4e6'
                  },
                  {
                    offset: 1,
                    color: '#00d4e6'
                  }
                ], false),
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
            },
            hoverAnimation: false,
            label: {
              show: false,
            },
            tooltip: {
              show: false
            },
            // data: [100],
            animationType: 'scale'
          },
        ]
      }

      option && myChart.setOption(option)
    }

    function update () {
      if (index >= data.length - 1) {
        index = 0
      } else {
        index++
      }
      render()
    }

    return { render, update }

  }

  const power1 = power1Render()
  const freqChart = freqChartRender()
  const tempChart = tempChartRender()
  const power2Chart = power2ChartRender()
  const waterTempChart = waterTempChartRender()
  const speedChart = speedChartRender()

  function render () {
    power1.render()
    freqChart.render()
    tempChart.render()
    power2Chart.render()
    waterTempChart.render()
    speedChart.render()
  }

  function update () {
    power1.update()
    freqChart.update()
    tempChart.update()
    power2Chart.update()
    waterTempChart.update()
    speedChart.update()
  }

  render()

  setInterval(update, 1000)
})
