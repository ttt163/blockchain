/**
 * Author：tantingting
 * Time：2018/4/25
 * Description：Description
 */

import {pageLoadingHide, axiosAjax, proxyUrl, fomartQuery} from './public/public'
import {MessageBanner} from './markets/index'
import Echarts from 'echarts'
import Highcharts from 'highcharts/highstock'
import layer from 'layui-layer'
// import Cookies from 'js-cookie'

$(function () {
    pageLoadingHide()
    const coinId = $('#containMain').data('id')
    // const coinTitleName = $('#containMain').data('cname')
    const rateData = $('#containMain').data('rate')

    // 上边详情
    let messageBanner = new MessageBanner(coinId, rateData)
    messageBanner.init()

    // 查看更多
    $('.project-table-more').on('click', function () {
        let record = $(this).data('record')
        let len = $(this).data('len')
        if (record > len) {
            window.open(`/exchangelist/${coinId}`, '_blank')
        } else {
            layer.msg('暂无更多数据！')
        }
    })

    // 饼图
    class PieCharts {
        constructor () {
            this.color = ['#d9dce3', '#f48fb1', '#ff8a80', '#80cbc4', '#fadd60', '#80cbc4', '#ce93d8', '#90caf9', '#ffcc80', '#bdbdbd', '#80deea', '#619fb4', '#a7c7ee', '#580a06', '#af777a', '#486585']
        }
        init () {
            let coinData = JSON.parse($('#pieData').val())
            // coinData = coinData.length < this.color.length ? coinData : coinData.slice(0, this.color.length - 1)
            let chartsData = this.formatChartData(coinData)
            let opt = this.chartOption(chartsData.pieData)
            let legendData = chartsData.legendData
            this.renderLegend(legendData)
            let rateChart = Echarts.init(document.getElementById('tradingRateChart'))
            rateChart.setOption(opt)
            window.onresize = () => {
                rateChart.resize()
            }
        }

        formatChartData (coinData) {
            let legendData = ['Other']
            let pieChartsData = [
                {
                    value: 0,
                    name: 'Other'
                }
            ]
            let rateNum = 0
            coinData.map(function (item) {
                rateNum += parseFloat(item.volume_rate_24h)
                let index = pieChartsData.findIndex(function (d) {
                    return item.exchange_name === d.name
                })
                if (index !== -1) {
                    pieChartsData[index].value = pieChartsData[index].value + parseFloat(item.volume_rate_24h)
                } else {
                    pieChartsData.push({
                        value: parseFloat(item.volume_rate_24h),
                        name: item.exchange_name
                    })
                    legendData.push(item.exchange_name)
                }
            })
            pieChartsData[0].value = 100 - rateNum
            if (pieChartsData.length > this.color.length) {
                pieChartsData = pieChartsData.slice(0, this.color.length)
                legendData = legendData.slice(0, this.color.length)
            }
            return {
                pieData: pieChartsData,
                legendData: legendData
            }
        }

        chartOption (chartsData) {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} <br/>{d}%'
                },
                color: this.color,
                legend: null,
                series: [
                    {
                        name: '成交额占比',
                        type: 'pie',
                        radius: ['40%', '80%'],
                        avoidLabelOverlap: false,
                        label: null,
                        data: chartsData
                    }
                ]
            }
        }

        renderLegend (data) {
            let str = ''
            data.map((d, i) => {
                str += `<li><span style="background: ${this.color[i]}"></span><em>${d}</em></li>`
            })
            $('.trading-rate-legend').html(str)
        }
    }

    let ratePieCharts = new PieCharts()
    ratePieCharts.init()

    // 价格趋势
    class PriceHighCharts {
        init () {
            this.getChartsData()
        }

        getChartsData () {
            let sendData = {
                coinid: coinId,
                from: Date.parse(new Date()) / 1000 - (3650 * 3600 * 24),
                to: Date.parse(new Date()) / 1000
            }
            let self = this
            axiosAjax({
                type: 'get',
                url: `${proxyUrl}/market/coin/graph?${fomartQuery(sendData)}`,
                formData: false,
                params: {},
                fn: function (res) {
                    if (res.code === 1) {
                        let usdPrice = res.data.price_usd
                        let dataConvert = usdPrice.map(function (item) {
                            return [item[0] * 1000, parseFloat(item[1])]
                        })
                        let opt = self.chartOption(dataConvert)
                        Highcharts.setOptions({
                            global: {
                                useUTC: true
                            },
                            lang: {
                                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                                weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                                loading: '加载中...',
                                noData: '没有数据',
                                numericSymbols: ['千', '兆', 'G', 'T', 'P', 'E'],
                                printChart: '打印图表',
                                resetZoom: '恢复缩放',
                                resetZoomTitle: '恢复图表',
                                shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                                thousandsSep: ',',
                                rangeSelectorFrom: '从',
                                rangeSelectorTo: '到',
                                rangeSelectorZoom: '缩放'
                            }
                        })
                        Highcharts.stockChart('highChartsContent', opt)
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        }

        chartOption (arrOption) {
            return {
                chart: {
                    zoomType: 'x'
                },
                rangeSelector: {
                    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1周'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1月'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3月'
                    }, {
                        type: 'ytd',
                        text: '今年'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1年'
                    }, {
                        type: 'all',
                        text: '全部'
                    }],
                    // 按钮样式
                    buttonTheme: {
                        fill: 'none',
                        'stroke-width': 1,
                        stroke: '#BDE8FC',
                        width: 60,
                        r: 0,
                        zIndex: 7,
                        style: {
                            'font-size': '14px',
                            color: '#379dfc'
                        },
                        states: {
                            select: {
                                fill: '#52b8fc',
                                style: {
                                    fontWeight: 'normal',
                                    color: 'white'
                                }
                            }
                        }
                    },
                    inputBoxBorderColor: '#BDE8FC',
                    inputStyle: {
                        'font-size': '14px',
                        color: '#22a5ff'
                    },
                    inputPosition: {
                        verticalAlign: 'middle'
                    },
                    labelStyle: {
                        color: '#9c9c9c'
                    },
                    inputDateFormat: '%Y-%m-%d',
                    inputEditDateFormat: '%Y-%m-%d',
                    selected: 6
                },
                navigator: {
                    adaptToUpdatedData: false,
                    series: {
                        lineWidth: 1,
                        data: arrOption
                        // data: [].concat(this.state.data, UTC)
                    }
                },
                plotOptions: {
                    series: {
                        showInLegend: true
                    }
                },
                tooltip: {
                    split: false,
                    shared: true
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true
                },
                series: [{
                    name: '价格(美元)',
                    data: arrOption,
                    // data: [].concat(this.state.data, UTC),
                    lineWidth: 1,
                    dataGrouping: {
                        enabled: true
                    }
                }],
                xAxis: {
                    events: {
                        // afterSetExtremes: this.setExtremes
                    },
                    minRange: 3600 * 1000,
                    labels: {
                        autoRotation: false,
                        formatter: function () {
                            let vDate = new Date(this.value)
                            return vDate.getFullYear() + '-' + (vDate.getMonth() + 1) + '-' + vDate.getDate()
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '价格(美元)'
                    },
                    opposite: false
                },
                scrollbar: {
                    liveRedraw: false
                }
            }
        }
    }
    let priceCharts = new PriceHighCharts()
    priceCharts.init()
})
