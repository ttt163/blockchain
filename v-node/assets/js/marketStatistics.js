/**
 * Author：yangbo
 * Time：2018/8/29 15:38
 * Description：marketStatistics.js
 */
import {
    axiosAjax,
    pageLoadingHide,
    proxyUrl
} from './public/public'
// import Cookies from 'js-cookie'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/treemap')
require('echarts/lib/chart/candlestick')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')

$(function () {
    pageLoadingHide()

    // 数字千分位格式
    const tranFormat = (num) => {
        let d = null
        if (num.toString().indexOf('.') !== -1) {
            let q = num.toString().split('.')
            q[0] = q[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
            d = q.join('.')
        } else {
            d = num.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
        }
        return d
    }

    // 单位转换（四舍五入保留两位小数）
    const numTrans = (num) => {
        let isNeg = false
        num = Number(num)
        if (num < 0) {
            num = Math.abs(num)
            isNeg = true
        }
        if (num > 99999999) {
            return (isNeg ? '-' : '') + (Math.round((num / 100000000).toFixed(3) * 100) / 100).toFixed(2) + '亿'
        } else if (num > 9999 && num < 99999999) {
            return (isNeg ? '-' : '') + (Math.round((num / 10000).toFixed(3) * 100) / 100).toFixed(2) + '万'
        } else {
            return (isNeg ? '-' : '') + num.toFixed(2)
        }
    }

    // 获取年月日
    const formatDate = (date, year) => {
        // let _str = !str ? '-' : str
        const zero = (m) => {
            return m < 10 ? '0' + m : m
        }
        let time = date < 10000000001 ? new Date(date * 1000) : new Date(date)
        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        if (date) {
            if (year) {
                return y + '-' + zero(m) + '-' + zero(d)
            } else {
                return zero(m) + '-' + zero(d)
            }
        } else {
            return ''
        }
    }

    // 获取时间
    const getTime = (time) => new Date(time).getHours()

    // 补双位
    const addZero = (n) => n < 10 ? '0' + n : n

    // 计算总市值变动start参数
    let getStartHour = (time) => parseInt(time / 1000) - 86400 * 7 - 3600 * getTime(time)

    // 金钱符号
    let getSymbol = (s) => {
        switch (s) {
            case 'CNY':
                return '￥'
            case 'USD':
                return '$'
            case 'EUR':
                return '€'
            default:
                return '￥'
        }
    }

    let baseInfo = $('#baseInfo')
    let UtoC = baseInfo.data('cny') || 1 // 美元兑人民币汇率
    let UtoE = baseInfo.data('eur') || 1 // 美元兑欧元汇率
    let marketQuot = $('#marketQuot') // 涨跌比
    let marketDist = $('#marketDist') // 数字货币涨跌幅分布
    let marketRank = $('#marketRank') // 总市值变动
    let marketDateList = $('#marketDateList') // 数字货币排序表
    let marketTreeMap = $('#marketTreeMap') // 区块图
    let marketRation = $('#marketRation') // 市值占比
    let marketAccer = $('#marketAccer') // 涨速
    let marketNewCoin = $('#marketNewCoin') // 七日新币
    let marketVolRatio = $('#marketVolRatio') // 交易所交易对成交量比例
    let marketVolume = $('#marketVolume') // 交易所成交量

    // 头部行情 轮播效果
    let marketSwiper = new Swiper('.swiper-container.market', {
        nextButton: '.swiper-button-next.market-next',
        prevButton: '.swiper-button-prev.market-prev',
        pagination: '.swiper-pagination.market-page',
        initialSlide: 0,
        observer: true,
        slidesPerView: 1,
        observeParents: true,
        simulateTouch: false,
        autoplay: 5000
    })
    const $marketCont = $('.topMarket-cont')
    $marketCont.mouseenter(() => {
        marketSwiper.stopAutoplay()
    })
    $marketCont.mouseleave(() => {
        if ($('.bottom-Market').hasClass('bounceInDown')) {
            marketSwiper.stopAutoplay()
        } else {
            marketSwiper.startAutoplay()
        }
    })

    // 生成列表信息
    const setIntervalFn = (animation) => {
        const getMarketStr = (obj) => {
            let marketNew = []
            for (let i = 0; i < obj.length; i += 7) {
                marketNew.push(obj.slice(i, i + 7))
            }
            let marketStr = ''
            marketNew.map((ele, index) => {
                marketStr += `<div class="swiper-slide">`
                ele.map((item, i) => {
                    let hasNum = parseFloat(item.coin.percent_change_24h)
                    marketStr += `<div class="market-list" data-id="${item.coin.coin_id}" data-mark='${JSON.stringify(item.price)}'>
                    <div class="icon-cont">
                        <p class="icon-text"><img src="${item.coin.icon}" alt=""><span>${item.coin.symbol}</span></p>
                        <h5>${Math.round((UtoC * item.coin.price_usd) * 100) / 100}</h5>
                    </div>
                    <div class="exponent-big"><p  class="exponent ${hasNum > 0 ? 'rise' : 'fall'}">${hasNum > 0 ? '+' + Math.round(item.coin.percent_change_24h * 100) / 100 + '%' : Math.round(item.coin.percent_change_24h * 100) / 100 + '%'}</p><span class="${hasNum > 0 ? 'rise' : 'fall'}"></span></div>
                    <div class="exponent-curve" id="${item.coin.coin_id}"></div>
                </div>`
                })
                marketStr += `</div>`
            })
            $('#marketWrapper').html(marketStr)
        }
        // 行情
        const marketData = () => {
            axiosAjax({
                type: 'GET',
                url: proxyUrl + '/market/coin/summary',
                params: {},
                noloading: true,
                fn: function (resData) {
                    let thisData = []
                    if (resData.code === 1) {
                        thisData = resData.data
                        getMarketStr(thisData)
                        thisData.map((ele, index) => {
                            let dateList = ele.price.map(function (item) {
                                return item[0]
                            })
                            let valueList = ele.price.map(function (item) {
                                return item[1]
                            })
                            echarts.init($(`#${ele.coin.coin_id}`)[0]).dispose()
                            let myChart = echarts.init($(`#${ele.coin.coin_id}`)[0])
                            let option = {
                                animation: animation,
                                xAxis: {
                                    type: 'category',
                                    data: '',
                                    boundaryGap: false
                                },
                                yAxis: {
                                    type: 'value',
                                    splitLine: {show: false},
                                    scale: true,
                                    show: false,
                                    boundaryGap: true,
                                    data: dateList
                                },
                                grid: {
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    top: 0
                                },
                                series: [{
                                    data: valueList,
                                    type: 'line',
                                    showSymbol: false,
                                    itemStyle: {
                                        normal: {
                                            lineStyle: {
                                                type: 'solid',
                                                width: 2,
                                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                    offset: 0,
                                                    color: '#8693dc'
                                                }, {
                                                    offset: 1,
                                                    color: '#6cd4f1'
                                                }])
                                            }
                                        }
                                    },
                                    smooth: true
                                }]
                            }
                            myChart.setOption(option)
                        })
                    } else {
                        thisData = null
                    }
                }
            })
        }
        marketData()
    }
    setIntervalFn(true)

    // 获取交易所信息
    const getBourse = (coinid) => {
        let sendData = {
            coinid: coinid,
            currentpage: 1,
            pagesize: 3
        }
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/coin/exchange`,
            params: sendData,
            fn: function (resData) {
                if (resData.code === 1) {
                    let str = ''
                    let data = resData.data.inforList
                    data.map((item, index) => {
                        str += `<tr>
                                    <td>${item.exchange_name}</td>
                                    <td>${item.pair}</td>
                                    <td>￥${Math.round((UtoC * item.price) * 1000) / 1000}</td>
                                </tr>`
                    })
                    $('#exchange tbody').html(str)
                }
            }
        })
    }

    // 展开走势图
    $('.topMarket').on('click', '.market-list', function (e) {
        e.stopPropagation()
        let index = $(this).index()
        let currencyID = $(this).attr('data-id')
        $('.currency .icon img').attr('src', $(this).find('p.icon-text').children('img').attr('src'))
        $('.bottomMarket-cont .price h5').html($(this).find('.icon-cont').children('h5').html())
        $('.bottomMarket-cont .icon span').html($(this).find('p.icon-text').children('span').html())
        let getClass = $(this).find('.exponent-big span').attr('class')
        $('.bottomMarket-cont .increase span').removeClass().addClass(getClass).html($(this).find('p.exponent').html())
        getBourse(currencyID)
        // 行情走势
        let getMarketLine = JSON.parse($(this).attr('data-mark'))
        let myMarketLine = echarts.init(document.getElementById('marketLine'))
        let dateLine = getMarketLine.map(function (item) {
            let dataTime = new Date(parseInt(item[0]) * 1000)
            let h = dataTime.getHours() < 10 ? '0' + dataTime.getHours() : dataTime.getHours()
            let m = dataTime.getMinutes() < 10 ? '0' + dataTime.getMinutes() : dataTime.getMinutes()
            return h + ' : ' + m
        })
        let valueLien = getMarketLine.map(function (item) {
            return (Math.floor((item[1] * UtoC) * 1000) / 1000)
        })
        let optionLine = {
            backgroundColor: '#f2f6fb',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function (point, asa) {
                    let index = point[0].dataIndex
                    let timeData = parseInt(getMarketLine[index][0])
                    const date = new Date(timeData * 1000)
                    const Y = date.getFullYear() + '-'
                    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
                    const D = date.getDate() + ' '
                    const h = date.getHours() + ':'
                    const m = date.getMinutes()
                    return Y + M + D + h + m + '<br/>市场价格(￥): ' + point[0].data
                }
            },
            toolbox: {
                show: false,
                feature: {
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            xAxis: {
                type: 'category',
                data: dateLine,
                boundaryGap: false,
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#5b5f73'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#5b5f73'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#5b5f73'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '6%',
                bottom: '10%',
                top: '12%'
            },
            yAxis: {
                type: 'value',
                name: '(人民币)',
                scale: true,
                boundaryGap: false,
                data: dateLine,
                position: 'right',
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#5b5f73'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#5b5f73'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            series: [{
                data: valueLien,
                type: 'line',
                name: '￥',
                showSymbol: false,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            type: 'solid',
                            width: 3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#8693dc'
                            }, {
                                offset: 1,
                                color: '#6cd4f1'
                            }])
                        }
                    }
                }
            }]
        }
        myMarketLine.setOption(optionLine)
        // 显示
        $('.bottom-Market').removeClass('bounceInUp').addClass('bounceInDown')
        $('.market-active').addClass('active').css('left', (index * 173))
    })

    // 关闭走势图
    $('.closeBtn, .marketBtn').on('click', function () {
        $('.bottom-Market').removeClass('bounceInDown').addClass('bounceInUp')
        $('.market-active').removeClass('active')
        // --- marketSwiper.startAutoplay()
    })

    // 图表载体
    let quotChart = null // 涨跌比
    let distChart = null // 数字货币涨跌幅分布
    let rankChart = null // 总市值变动
    let treeMapChart = null // 区块图
    let ratChart = null // 市场占比
    let accChart = null // 涨速
    let ncChart = null // 新币涨跌
    let volChart = null // 交易所成交量

    // 数据存储变量
    let rankReqData = null // 总市值变动数据
    let treeReqData = null // 区块图数据
    let volReqData = null // 交易所成交量数据
    let listReqData = null // 排行榜数据
    let heatReqData = baseInfo.data('heat') // 总体信息数据

    // 市场温度横栏执行函数
    let marketTempFn = (data, unit) => {
        let rank = $('.heat-rank')
        let bourse = $('.heat-bourse')
        let ud = $('.heat-ud')
        let vol24 = $('.heat-vol24')
        let coinNum = $('.heat-coinNum')
        let resData = JSON.parse(JSON.stringify(data))

        if (unit === 'CNY') {
            resData.cap_total *= UtoC
            resData.volume_24h *= UtoC
        } else if (unit === 'EUR') {
            resData.cap_total *= UtoE
            resData.volume_24h *= UtoE
        } else {
            resData.cap_total *= 1
            resData.volume_24h *= 1
        }
        let useData = {
            market_count: tranFormat(resData.market_count),
            coin_count: tranFormat(resData.coin_count),
            cap_total: tranFormat(numTrans(resData.cap_total)),
            volume_24h: tranFormat(numTrans(resData.volume_24h)),
            cap_change_percent_24h: (resData.cap_change_percent_24h > 0 ? '+' : '') + (Math.round(resData.cap_change_percent_24h * 10000) / 100).toFixed(2) + '%',
            current_price: tranFormat(numTrans(resData.cap_total - (resData.cap_total / (1 + parseFloat(resData.cap_change_percent_24h)))))
        }

        rank.html(`${getSymbol(unit)}${useData.cap_total}`)
        ud.html(`${useData.cap_change_percent_24h}(${getSymbol(unit)}${useData.current_price})`)
        vol24.html(`${getSymbol(unit)}${useData.volume_24h}`)
        coinNum.html(`${useData.coin_count}个`)
        bourse.html(`${useData.market_count}个`)
    }

    // 涨跌比执行函数
    let quotChartFn = (resData) => {
        let quotData = [
            {value: resData.rise, name: '涨幅'},
            {value: resData.fall, name: '跌幅'}
        ]
        return {
            title: {
                text: '24H数字货币涨跌数',
                top: 15,
                left: 20,
                textStyle: {
                    fontSize: 16,
                    color: '#222',
                    verticalAlign: 'center',
                    lineHeight: '50'
                }
            },
            color: ['#3ae4a7', '#f43974'],
            grid: {
                show: false,
                top: '15%',
                left: '5%',
                right: '5%',
                bottom: '10%'
            },
            tooltip: {
                show: false,
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                show: false,
                orient: 'vertical',
                selectedMode: true,
                x: 'left',
                data: quotData
            },
            series: [
                {
                    name: '24H数字货币涨跌数',
                    type: 'pie',
                    startAngle: 160,
                    radius: ['40%', '60%'],
                    avoidLabelOverlap: false,
                    silent: true,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: p => `${p.value} ${p.name.slice(0, 1)}`,
                                fontSize: 15
                            },
                            labelLine: {
                                show: true,
                                length: 5,
                                length2: 15
                            }
                        }
                    },
                    data: quotData
                }
            ]
        }
    }

    // 涨跌幅分布执行函数
    let distChartFn = (distData) => {
        distData.forEach((item, index) => distData.splice((index * 2), 0, ''))
        return {
            color: '#4d93ff',
            title: {
                text: '24H数字货币涨跌幅分布',
                top: 15,
                left: 20,
                textStyle: {
                    fontSize: 16,
                    color: '#222',
                    verticalAlign: 'center',
                    lineHeight: 36
                }
            },
            grid: {
                show: false,
                top: '15%',
                left: '4%',
                right: '4%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: ['< -1', false, '-100%', false, '-90%', false, '-80%', false, '-70%', false, '-60%', false, '-50%', false, '-40%', false, '-30%', false, '-20%', false, '-10%', false, '0%', false, '10%', false, '20%', false, '30%', false, '40%', false, '50%', false, '60%', false, '70%', false, '80%', false, '90%', false, '100%', false, '> 1'],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ccc'
                    },
                    interval: 1,
                    rotate: 0
                },
                axisLine: {
                    lineStyle: {
                        width: 2,
                        color: '#fff',
                        shadowColor: '#eee',
                        shadowOffsetY: 5
                    }
                },
                axisTick: {
                    show: true,
                    interval: 1,
                    alignWithLabel: true,
                    lineStyle: {
                        width: 2,
                        color: '#fff',
                        shadowColor: '#eee',
                        shadowOffsetY: 5
                    }
                },
                offset: 10,
                scale: true
            },
            yAxis: {
                show: false,
                type: 'value'
            },
            series: [
                {
                    name: '24H数字货币涨跌幅分布',
                    type: 'bar',
                    // silent: true,
                    // renderItem: function (params, api) {
                    //     console.log(params, api)
                    //     let categoryIndex = api.value(0)
                    //     let start = api.coord([api.value(1), categoryIndex])
                    //     let end = api.coord([api.value(2), categoryIndex])
                    //     let height = api.size([0, 1])[1] * 0.6
                    //     console.log(echarts)
                    //     return {
                    //         name: '数字货币涨跌幅分布',
                    //         type: 'bar',
                    //         shape: echarts.graphic.clipRectByRect({
                    //             x: start[0],
                    //             y: start[1] - height / 2,
                    //             width: end[0] - start[0],
                    //             height: height
                    //         }, {
                    //             x: params.coordSys.x,
                    //             y: params.coordSys.y,
                    //             width: params.coordSys.width,
                    //             height: params.coordSys.height
                    //         }),
                    //         style: api.style()
                    //     }
                    // },
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top',
                                color: '#ccc',
                                fontSize: 12,
                                barWidth: '80%'
                            }
                        }
                    },
                    data: distData
                }
            ]
        }
    }

    // 总市值变动执行函数
    let rankChartFn = (data, unit) => {
        let resData = JSON.parse(JSON.stringify(data))

        let getDate = (resData, unit) => {
            let categoryData = []
            let data = []
            resData.map((item) => {
                if (unit === 'CNY') {
                    item.cap_total *= UtoC
                } else if (unit === 'EUR') {
                    item.cap_total *= UtoE
                } else {
                    item.cap_total *= 1
                }
                categoryData.push(formatDate(item.create_time, true))
                data.push({
                    name: formatDate(item.create_time, true),
                    value: parseFloat(numTrans(item.cap_total)),
                    hour: getTime(item.create_time),
                    volumes: item.cap_change_percent_1h
                })
            })

            return {
                categoryData,
                data
            }
        }
        let ref = null
        let rankData = getDate(resData, unit)
        return {
            title: {
                text: '总市值变动(单位：亿)',
                top: 15,
                left: 20,
                textStyle: {
                    fontSize: 16,
                    color: '#222',
                    verticalAlign: 'center',
                    lineHeight: 36
                }
            },
            animation: false,
            legend: {
                show: false
            },
            color: ['#4d5af6', '#9faab4'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        show: true,
                        formatter: (params) => {
                            return `${params.seriesData[0] && params.seriesData[0].data ? `${params.seriesData[0].name} ${addZero(params.seriesData[0].data.hour)} 时` : params.value.toFixed(2)}`
                        }
                    }
                },
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#fff'
                },
                formatter: (params) => {
                    if (params[0].axisIndex === 0) {
                        return `${params[0].axisValue} <br/> ${params[0].seriesName} : ${getSymbol(unit)}${params[0].value + '亿'} <br/> ${params[1].seriesName} : ${(params[1].data.volumes * 100).toFixed(2) + '%'}`
                    } else {
                        return `${params[0].axisValue} <br/> ${params[0].seriesName} : ${(params[0].data.volumes * 100).toFixed(2) + '%'} <br/> ${params[1].seriesName} : ${getSymbol(unit)}${params[1].value + '亿'}`
                    }
                },
                position: function (pos, params, el, elRect, size) {
                    let obj = {top: 10}
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
                    return obj
                }
            },
            axisPointer: {
                link: {xAxisIndex: 'all'},
                label: {
                    backgroundColor: '#666'
                }
            },
            brush: {
                xAxisIndex: 'all',
                brushLink: 'all',
                outOfBrush: {
                    colorAlpha: 0.1
                }
            },
            visualMap: {
                show: false,
                seriesIndex: 5,
                dimension: 2,
                pieces: [{
                    value: 1
                }, {
                    value: -1
                }]
            },
            grid: [
                {
                    left: '8%',
                    right: '5%',
                    height: '58%'
                },
                {
                    left: '8%',
                    right: '5%',
                    top: '75%',
                    height: '15%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: rankData.categoryData,
                    scale: true,
                    boundaryGap: false,
                    splitLine: {show: false},
                    // splitNumber: 20,
                    axisPointer: {
                        z: 100
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    axisTick: {show: false},
                    axisLabel: {
                        interval: (index, value) => {
                            if (index === 0) return true
                            if (value === ref) {
                                return false
                            } else {
                                ref = value
                                return true
                            }
                        },
                        min: 'dataMin',
                        max: 'dataMax'
                        // rotate: 20
                    }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: rankData.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax'
                }
            ],
            yAxis: [
                {
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        onZero: false,
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    splitLine: {
                        show: true
                    },
                    axisTick: {show: false},
                    splitNumber: 5,
                    scale: true
                },
                {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: {show: false},
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false}
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 0,
                    end: 100,
                    minSpan: 20,
                    zoomOnMouseWheel: false
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    left: '7.5%',
                    right: '4.5%',
                    top: '92%',
                    start: 0,
                    end: 100,
                    minSpan: 20,
                    showDetail: false
                }
            ],
            series: [
                {
                    name: '市值总',
                    type: 'line',
                    data: rankData.data
                }, {
                    name: '涨幅',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: rankData.data
                }
            ]
        }
    }

    // 区块图执行函数
    let treeMapChartFn = (data, unit) => {
        let resData = JSON.parse(JSON.stringify(data))
        let getColor = (n) => {
            let resColor = ''
            n = n * 100
            if (n < -50) {
                resColor = '#ee250a'
            } else if (n < -45) {
                resColor = '#ef2e14'
            } else if (n < -40) {
                resColor = '#ef361d'
            } else if (n < -35) {
                resColor = '#f04028'
            } else if (n < -30) {
                resColor = '#f14831'
            } else if (n < -25) {
                resColor = '#f1513b'
            } else if (n < -20) {
                resColor = '#f25c47'
            } else if (n < -15) {
                resColor = '#f36754'
            } else if (n < -10) {
                resColor = '#f47160'
            } else if (n < -5) {
                resColor = '#f57c6c'
            } else if (n < 0) {
                resColor = '#f68778'
            } else if (n < 5) {
                resColor = '#abdaad'
            } else if (n < 10) {
                resColor = '#a3d6a6'
            } else if (n < 15) {
                resColor = '#9bd39e'
            } else if (n < 20) {
                resColor = '#94d097'
            } else if (n < 25) {
                resColor = '#8ccc8f'
            } else if (n < 30) {
                resColor = '#85c988'
            } else if (n < 35) {
                resColor = '#7fc682'
            } else if (n < 40) {
                resColor = '#79c37c'
            } else if (n < 45) {
                resColor = '#72c076'
            } else if (n < 50) {
                resColor = '#6cbe70'
            } else {
                resColor = '#66bb6a'
            }
            return resColor
        }
        let tmDate = resData.map((item) => {
            if (unit === 'CNY') {
                item.total_value *= UtoC
            } else if (unit === 'EUR') {
                item.total_value *= UtoE
            } else {
                item.total_value *= 1
            }
            return {
                name: item.cn_name,
                value: Number(item.total_value.toFixed(2)),
                percent: Math.round(item.change_percent * 10000) / 100,
                itemStyle: { // 色块的深浅在这调整
                    color: getColor(item.change_percent)
                    // colorAlpha: 0,  透明度  1等同于default
                    // colorSaturation: 0 // 饱和度 0.5等同于default
                }
            }
        })
        return {
            title: {
                show: false
            },
            tooltip: {
                show: true,
                formatter: (p) => {
                    return `${p.name}: ${getSymbol(unit)}${tranFormat(p.value)}`
                }
            },
            series: [
                {
                    name: 'Disk Usage',
                    type: 'treemap',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    nodeClick: false,
                    breadcrumb: false,
                    roam: false,
                    visibleMin: 100,
                    label: {
                        show: true,
                        formatter: '{b}',
                        position: 'insideBottomRight',
                        // rotate: 90,
                        // align: 'left',
                        color: '#fff'
                    },
                    // silent: true,
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            gapWidth: 3
                        }
                    },
                    data: tmDate
                }
            ]
        }
    }

    // 市值占比执行函数
    let ratChartFn = (resData) => {
        let ratDate = []
        let known = 0
        resData.inforList.forEach((item, index) => {
            if (index === 9) return
            known += Number(item.cap_percent)
            ratDate.push({
                name: item.symbol,
                value: Number(item.cap_percent)
            })
        })
        ratDate.push({
            name: '其他',
            value: 1 - known
        })
        let formatter = function (name) {
            let total = 0
            let target
            for (let i = 0, l = ratDate.length; i < l; i++) {
                total += ratDate[i].value
                if (ratDate[i].name === name) {
                    target = ratDate[i].value
                }
            }
            return `{n|${name}}${((target / total) * 100).toFixed(2)}%`
        }
        let legend = () => {
            let res = []
            ratDate.map((item, index) => {
                res.push({
                    orient: 'vertical',
                    top: Math.floor(index / 2) * 15 + 20 + '%',
                    left: index % 2 ? '72%' : '42%',
                    textStyle: {
                        fontSize: '13',
                        color: '#222',
                        fontWeight: '600',
                        rich: {
                            n: {
                                fontSize: '14',
                                color: '#222',
                                fontWeight: '600',
                                width: 70
                            }
                        }
                    },
                    selectedMode: false,
                    formatter,
                    data: [{name: item.name, icon: 'circle'}]
                })
            })
            return res
        }
        return {
            color: ['#94c9ff', '#8796fd', '#ff9493', '#af87fe', '#71ebe6', '#cff6fd', '#797cc4', '#c8dbff', '#82d5ce', '#79a6f0'],
            title: {
                text: '市值占比',
                textStyle: {
                    fontSize: 16,
                    color: '#222',
                    verticalAlign: 'center',
                    lineHeight: '50'
                }
            },
            tooltip: {
                show: false,
                trigger: 'item',
                confine: true,
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: legend(),
            series: [
                {
                    name: '市值占比',
                    type: 'pie',
                    center: ['20%', '55%'],
                    radius: ['42%', '70%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    data: ratDate,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter: '{b}\n{d}%',
                            textStyle: {
                                fontSize: '28',
                                align: 'center',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                }
            ]
        }
    }

    // 涨速执行函数
    let accChartFn = (resData) => {
        let accDate = []
        resData.fall.forEach((item, index) => {
            accDate.push({
                name: resData.fall[index].name,
                value: Math.round(resData.fall[index].value * 10000) / 10000
            }, {
                name: resData.rise[index].name,
                value: Math.round(resData.rise[index].value * 10000) / 10000
            })
        })
        accDate.map((item) => {
            item.label = {
                normal: {
                    position: item.value > 0 ? 'top' : 'bottom',
                    align: item.value > 0 ? 'right' : 'left',
                    rotate: -90,
                    offset: item.value > 0 ? [-5, 0] : [6, 0],
                    color: '#999',
                    formatter: (params) => {
                        return `${(params.value * 100).toFixed(2)}%`
                    }
                }
            }
            item.itemStyle = {
                normal: {
                    color: item.value > 0 ? '#3ae4a7' : '#f43974'
                }
            }
        })
        let axis = []
        for (let key of accDate) {
            axis.push(key.name)
        }
        return {
            title: {
                text: '5分钟涨跌速排行',
                top: 15,
                left: 20,
                textStyle: {
                    fontSize: 16,
                    color: '#222',
                    verticalAlign: 'center',
                    lineHeight: '50'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params) => {
                    return `${params[0].name} <br/> ${params[0].seriesName} : ${(params[0].value * 100).toFixed(2)}%`
                }
            },
            legend: {
                show: false
            },
            grid: {
                top: '15%',
                left: '0%',
                right: '3%',
                bottom: '2%',
                containLabel: true
            },
            yAxis: {
                show: false
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#999',
                    rotate: 45,
                    align: 'right',
                    padding: [5, 2, 0, 0],
                    margin: 40
                },
                axisTick: {show: false},
                splitLine: {show: false},
                data: axis
            },
            series: [
                {
                    name: '涨跌速度',
                    type: 'bar',
                    barCategoryGap: '60%',
                    legendHoverLink: false,
                    barMinHeight: 5,
                    silent: true,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: accDate
                }
            ]
        }
    }

    // 新币涨跌执行函数
    let ncChartFn = (resData) => {
        let end = (data) => {
            let len = data.length
            if (len < 24) {
                return 100
            } else {
                return parseInt(24 / len * 100)
            }
        }
        resData.map((item) => {
            item.label = {
                normal: {
                    show: false
                }
            }
            item.itemStyle = {
                normal: {
                    color: '#1875f0'
                }
            }
        })
        let axis = []
        for (let key of resData) {
            axis.push(key.name)
        }
        return {
            title: {
                text: '新币涨跌',
                top: 15,
                left: 20,
                textStyle: {
                    fontSize: 16,
                    color: '#222',
                    verticalAlign: 'center',
                    lineHeight: '50'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                },
                formatter: (params) => {
                    return `${params[0].name} <br/> ${params[0].seriesName} : ${(params[0].value * 100).toFixed(2)}%`
                }
            },
            legend: {
                show: false
            },
            dataZoom: [{
                show: true,
                type: 'slider', // inside 无滚动条
                // xAxisIndex: [0],
                handleSize: 0,
                height: 8,
                left: 10,
                right: 10,
                bottom: '2%',
                start: 0,
                end: end(axis),
                zoomLock: true,
                // maxValueSpan: end(axis),
                // realtime: false // 是否实时更新,
                // minSpan: 20,
                // maxSpan: end(axis),
                // minValueSpan: 24,
                showDetail: false // 拖拽
            }],
            grid: {
                left: '0%',
                right: '3%',
                bottom: '5%',
                containLabel: true
            },
            yAxis: {
                show: false
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#999',
                    rotate: 45,
                    margin: 15,
                    interval: 0
                },
                axisTick: {show: false},
                splitLine: {show: false},
                data: axis
            },
            series: [
                {
                    name: '新币涨跌',
                    type: 'bar',
                    barCategoryGap: '80%',
                    legendHoverLink: false,
                    silent: true,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: resData
                }
            ]
        }
    }

    // 交易所主要交易对执行函数
    let volRatioFn = (resData) => {
        let parentDom = $('.top-ten')
        let str = createTopTenDom(resData)
        parentDom.html(str)
    }

    // 交易所成交量执行函数
    // let volChartFn = (data, unit) => {
    //     let resData = JSON.parse(JSON.stringify(data))
    //     let colorAry = ['#94c9ff', '#8796fd', '#ff9493', '#af87fe', '#71ebe6', '#525cb9', '#fdca42']
    //     let volDate = resData.map((item, index) => {
    //         if (unit === 'CNY') {
    //             item.volume *= UtoC
    //         } else if (unit === 'EUR') {
    //             item.volume *= UtoE
    //         } else {
    //             item.volume *= 1
    //         }
    //         item = {
    //             name: item.market,
    //             value: parseFloat(item.volume.toFixed(2)),
    //             label: {
    //                 labelLine: {
    //                     normal: {
    //                         show: true,
    //                         length: 20,
    //                         length2: 10, // 第二段线长
    //                         lineStyle: {
    //                             type: 'solid',
    //                             width: 1
    //                         }
    //                     }
    //                 },
    //                 normal: {
    //                     show: true,
    //                     position: 'outside',
    //                     formatter: (params) => {
    //                         return `{c|${getSymbol(unit)}${tranFormat(params.value)}}\n{hr|}\n{d|${params.percent}%}{b|${params.name}}`
    //                     },
    //                     rich: {
    //                         b: {
    //                             fontSize: 13,
    //                             // color: '#222',
    //                             align: 'left',
    //                             padding: [0, 0, 0, 5]
    //                         },
    //                         hr: {
    //                             borderColor: colorAry[index],
    //                             width: '100%',
    //                             align: 'left',
    //                             lineHeight: 10,
    //                             borderWidth: 1,
    //                             height: 0
    //                         },
    //                         d: {
    //                             fontSize: 13,
    //                             color: '#999',
    //                             align: 'left',
    //                             padding: [0, 10, 0, 5]
    //                         },
    //                         c: {
    //                             fontSize: 13,
    //                             color: '#222',
    //                             align: 'left',
    //                             fontWeight: 700,
    //                             padding: [0, 10, 0, 5]
    //                         }
    //                     }
    //                 },
    //                 emphasis: {
    //                     position: 'center'
    //                 }
    //             }
    //         }
    //         return item
    //     })
    //     return {
    //         color: ['#94c9ff', '#8796fd', '#ff9493', '#af87fe', '#71ebe6', '#525cb9', '#fdca42', '#35495d', '#65c39e', '#f85461'],
    //         title: {
    //             text: '交易所成交量',
    //             top: 15,
    //             left: 20,
    //             textStyle: {
    //                 fontSize: 16,
    //                 color: '#222',
    //                 verticalAlign: 'center',
    //                 lineHeight: '50'
    //             }
    //         },
    //         grid: {
    //             top: '10%',
    //             left: '10%',
    //             right: '10%',
    //             bottom: '15%',
    //             containLabel: true
    //         },
    //         tooltip: {
    //             show: false,
    //             trigger: 'item',
    //             confine: true,
    //             formatter: '{a} <br/>{b} : {c} ({d}%)'
    //         },
    //         legend: {
    //             show: false
    //         },
    //         series: [
    //             {
    //                 name: '市值占比',
    //                 type: 'pie',
    //                 minAngle: 20,
    //                 center: ['50%', '55%'],
    //                 radius: ['36%', '60%'],
    //                 avoidLabelOverlap: false,
    //                 hoverAnimation: false,
    //                 data: volDate,
    //                 itemStyle: {
    //                     emphasis: {
    //                         shadowBlur: 10,
    //                         shadowOffsetX: 0,
    //                         shadowColor: 'rgba(0, 0, 0, 0.3)'
    //                     }
    //                 }
    //             }
    //         ]
    //     }
    // }

    let volChartFn = (data, unit) => {
        let resData = JSON.parse(JSON.stringify(data))
        let colorAry = ['#5ea0ef', '#647bd0', '#f68789', '#fccc7a', '#5ed7a7', '#36cafb', '#26a3f9', '#fbb493', '#d09dfc', '#7cf0d3', '#90caf9', 'fadd60']
        let volDate = resData.map((item, index) => {
            if (unit === 'CNY') {
                item.volume *= UtoC
            } else if (unit === 'EUR') {
                item.volume *= UtoE
            } else {
                item.volume *= 1
            }
            item = {
                name: item.market,
                value: parseFloat(item.volume.toFixed(2)),
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        formatter: (p) => {
                            return `{a|${p.name}}\n{a|${getSymbol(unit)}${tranFormat(numTrans(p.value))}}\n{a|${p.percent}}%`
                        },
                        textStyle: {
                            fontSize: '14',
                            align: 'center',
                            fontWeight: '500',
                            rich: {
                                a: {
                                    lineHeight: 20
                                }
                            }
                        }
                    }
                }
            }
            return item
        })
        let formatter = function (name) {
            let total = 0
            let target
            for (let i = 0, l = volDate.length; i < l; i++) {
                total += volDate[i].value
                if (volDate[i].name === name) {
                    target = volDate[i].value
                }
            }
            return `{n|${name}}${((target / total) * 100).toFixed(2)}%`
        }
        let legend = () => {
            let res = []
            volDate.map((item, index) => {
                res.push({
                    orient: 'vertical',
                    top: Math.floor(index / 2) * 10 + 22 + '%',
                    // top: index * 8 + 15 + '%',
                    left: index % 2 ? '70%' : '42%',
                    textStyle: {
                        fontSize: '14',
                        color: '#222',
                        fontWeight: '600',
                        rich: {
                            n: {
                                fontSize: '14',
                                color: '#222',
                                fontWeight: '600',
                                width: 82
                            }
                        }
                    },
                    selectedMode: false,
                    formatter,
                    data: [{name: item.name, icon: 'circle'}]
                })
            })
            return res
        }
        return {
            color: colorAry,
            title: {
                text: '交易所成交量',
                top: 15,
                left: 20,
                textStyle: {
                    fontSize: 16,
                    color: '#222',
                    verticalAlign: 'center',
                    lineHeight: '50'
                }
            },
            grid: {
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '15%',
                containLabel: true
            },
            tooltip: {
                show: false,
                trigger: 'item',
                confine: true,
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: legend(),
            series: [
                {
                    name: '市值占比',
                    type: 'pie',
                    minAngle: 5,
                    center: ['22%', '50%'],
                    radius: ['28%', '55%'],
                    // startAngle: 70,
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    data: volDate,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                }
            ]
        }
    }

    // 列表数据处理
    let getListItem = (data, type, unit) => {
        let resData = JSON.parse(JSON.stringify(data))
        return resData.map((item) => {
            if (unit === 'CNY') {
                item.total_value *= UtoC
                item.volume_24h *= UtoC
                item.price *= UtoC
            } else if (unit === 'EUR') {
                item.total_value *= UtoE
                item.volume_24h *= UtoE
                item.price *= UtoE
            } else {
                item.total_value *= 1
                item.volume_24h *= 1
                item.price *= 1
            }
            return `<li class="clearfix">
            <p>
                <img src="${item.icon}" alt="">
                <span>${item.symbol} (${item.name})</span>
            </p>
            <p>${tranFormat(numTrans(item.total_value))}</p>
            <p>${tranFormat(numTrans(item.volume_24h))}</p>
            ${(type === 'changeD' || type === 'changeA' || type === 'rank' || type === 'turnover') ? `<p class="${type === 'turnover' ? '' : 'vol'}"><span class="${item.change_percent < 0 ? 'drop' : ''}">${item.change_percent > 0 ? '+' : ''}${(item.change_percent * 100).toFixed(2)}%</span></p>` : ''}
            <p>${item.price > 0.01 ? tranFormat(numTrans(item.price)) : item.price.toFixed(6)}</p>
            ${type === 'turnover' ? `<p class="turnover"><span>${(item.turnover_rate * 100).toFixed(2)}%</span></p>` : ''}
            <p><img src="${item.svg}" class="range" alt=""></p>
        </li>`
        }).join('')
    }
    // 获取分类数量
    let getListTitle = (type) => {
        switch (type) {
            case 'changeD':
            case 'changeA':
            case 'rank':
                return `<li>
                            <p>币种</p>
                        </li>
                        <li class="dx">
                            <p>市值(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>成交额(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>涨跌幅(24h)</p>
                        </li>
                        <li>
                            <p>当前价格(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>趋势图</p>
                        </li>`
            case 'volume':
                return `<li>
                            <p>币种</p>
                        </li>
                        <li class="dx">
                            <p>市值(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>成交额(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>当前价格(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>趋势图</p>
                        </li>`
            case 'turnover':
                return `<li>
                            <p>币种</p>
                        </li>
                        <li class="dx">
                            <p>市值(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>成交额(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>涨跌幅(24h)</p>
                        </li>
                        <li>
                            <p>当前价格(${baseInfo.data('currency')})</p>
                        </li>
                        <li>
                            <p>换手率</p>
                        </li>
                        <li>
                            <p>趋势图</p>
                        </li>`
        }
    }
    // 获取分类数量
    let getListCount = (type) => {
        switch (type) {
            case 'changeD':
            case 'changeA':
            case 'rank':
                return 6
            case 'turnover':
                return 7
            case 'volume':
                return 5
        }
    }
    // 获取请求参数
    let getParams = (type, myParams) => {
        switch (type) {
            case 'changeD':
                return {
                    ...myParams,
                    order: 'change'
                }
            case 'changeA':
                return {
                    ...myParams,
                    sort: 'asc',
                    order: 'change'
                }
            case 'rank':
                return {
                    ...myParams,
                    sort: 'asc',
                    order: 'rank'
                }
            case 'turnover':
                return {
                    ...myParams,
                    order: 'turnover_rate'
                }
            case 'volume':
                return {
                    ...myParams,
                    order: 'volume'
                }
        }
    }
    // 图片加载失败处理
    let loadImgFail = (ev, type) => {
        ev.on('error', function () {
            $(this).attr('src', `https://test-hx24.huoxing24.com/coin/${type === 'svg' ? 'svg' : 'icon'}/default.${type === 'svg' ? 'svg' : 'png'}`)
            ev.unbind('error')
        })
    }
    // 货币排序表执行函数
    let marketListFn = (resData, listType, unit) => {
        let List = $('.market-list-todo')
        let sort = $('.market-list-sort')
        let sortDate = getListTitle(listType)
        let listDate = getListItem(resData.inforList, listType, unit)
        let listCount = getListCount(listType)
        sort.html(sortDate)
        List.html(listDate)
        sort.find('li').eq(0).css('width', '18%').siblings().css('width', 82 / (listCount - 1) + '%')
        $('.market-list-todo li').each((index, item) => {
            $(item).find('p').eq(0).css('width', '18%').siblings().css('width', 82 / (listCount - 1) + '%')
            loadImgFail($(item).children('p:first-child').find('img'), 'png')
            loadImgFail($(item).children('p:last-child').find('img'), 'svg')
        })
    }

    // 汇率切换
    $('.rate-switch-control').on('click', '.switch-radio', function (e) {
        e.stopPropagation()
        if (parseInt($(this).data('cur')) === 1) return
        let rateType = $('.switch-radio[name="rateType"]:checked').val()
        $(this).parent().parent().addClass('act-rate').siblings().removeClass('act-rate')
        $(this).data('cur', 1).parent().parent().siblings().find('input').data('cur', 0)
        baseInfo.data('currency', rateType)

        heatReqData && marketTempFn(heatReqData, baseInfo.data('currency'))
        rankReqData && rankChart.setOption(rankChartFn(rankReqData, baseInfo.data('currency')))
        treeReqData && treeMapChart.setOption(treeMapChartFn(treeReqData, baseInfo.data('currency')))
        volReqData && volChart.setOption(volChartFn(volReqData, baseInfo.data('currency')))
        listReqData && marketListFn(listReqData, baseInfo.data('listtype'), baseInfo.data('currency'))
    })

    // 自动更新
    let ajaxAry = [
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/tickers/total`,
                params: {},
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        heatReqData = resData.data
                        marketTempFn(resData.data, baseInfo.data('currency'))
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/coin/change_rate`,
                params: {},
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        let quotOPts = quotChartFn(resData.data)
                        quotChart.setOption(quotOPts)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/coin/change_distributed`,
                params: {},
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        let distOPts = distChartFn(resData.data)
                        distChart.setOption(distOPts)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/total_trend`,
                params: {
                    start: getStartHour(new Date().getTime())
                },
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        rankReqData = resData.data
                        let rankOPts = rankChartFn(resData.data, baseInfo.data('currency'))
                        rankChart.setOption(rankOPts)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/concept_list`,
                params: {},
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        treeReqData = resData.data
                        let tmOpts = treeMapChartFn(resData.data, baseInfo.data('currency'))
                        treeMapChart.setOption(tmOpts)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/tickers/coin/list`,
                params: {
                    page: 1,
                    size: 10,
                    sort: 'asc',
                    limit: 15,
                    order: 'rank'
                },
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        let ratOpts = ratChartFn(resData.data)
                        ratChart.setOption(ratOpts)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/coin/speed_percent`,
                params: {},
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        let accOpts = accChartFn(resData.data)
                        accChart.setOption(accOpts)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/coin/seven_day_new`,
                params: {
                    page: 1,
                    size: 10,
                    sort: 'asc',
                    limit: 15,
                    order: 'rank'
                },
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        if (resData.data.length < 1) {
                            $('.new-coin-error').show()
                        } else {
                            $('.new-coin-error').hide()
                            let ncOpts = ncChartFn(resData.data)
                            ncChart.setOption(ncOpts)
                        }
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/market/base_quote_scale`,
                params: {},
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        volRatioFn(resData.data)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/summary/market/volume_scale`,
                params: {
                    page: 1,
                    size: 10,
                    sort: 'asc',
                    limit: 15,
                    order: 'rank'
                },
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        volReqData = resData.data
                        let volOpts = volChartFn(resData.data, baseInfo.data('currency'))
                        volChart.setOption(volOpts)
                    }
                }
            })
        },
        () => {
            axiosAjax({
                type: 'GET',
                url: `${proxyUrl}/market/tickers/coin/list`,
                params: getParams(baseInfo.data('listtype'), {
                    page: 1,
                    size: 10,
                    sort: 'desc',
                    limit: 500
                }),
                noloading: true,
                fn: function (resData) {
                    if (resData.code === 1) {
                        listReqData = resData.data
                        marketListFn(resData.data, baseInfo.data('listtype'), baseInfo.data('currency'))
                    }
                }
            })
        }
    ]

    for (let i = 0; i < ajaxAry.length; i++) {
        setInterval(() => {
            ajaxAry[i]()
        }, 180000 + i * 1000)
    }

    // 涨跌比初始化
    if (marketQuot.length > 0) {
        quotChart = echarts.init(marketQuot[0])

        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/coin/change_rate`,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    let quotOPts = quotChartFn(resData.data)
                    quotChart.setOption(quotOPts)
                }
            }
        })
    }

    // 涨跌幅分布初始化
    if (marketDist.length > 0) {
        distChart = echarts.init(marketDist[0])
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/coin/change_distributed`,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    let distOPts = distChartFn(resData.data)
                    distChart.setOption(distOPts)
                }
            }
        })
    }

    // 总市值变动初始化
    if (marketRank.length > 0) {
        rankChart = echarts.init(marketRank[0])
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/total_trend`,
            params: {
                start: getStartHour(new Date().getTime())
            },
            // start: parseInt(new Date().getTime() / 1000) - 86400 * 30
            fn: function (resData) {
                if (resData.code === 1) {
                    rankReqData = resData.data
                    let rankOPts = rankChartFn(resData.data, baseInfo.data('currency'))
                    rankChart.setOption(rankOPts)
                }
            }
        })
    }

    // 区块图初始化
    if (marketTreeMap.length > 0) {
        treeMapChart = echarts.init(marketTreeMap[0])
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/concept_list`,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    treeReqData = resData.data
                    let tmOpts = treeMapChartFn(resData.data, baseInfo.data('currency'))
                    treeMapChart.setOption(tmOpts)
                }
            }
        })
    }

    // 市场占比初始化
    if (marketRation.length > 0) {
        ratChart = echarts.init(marketRation[0])
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/tickers/coin/list`,
            params: {
                page: 1,
                size: 10,
                sort: 'asc',
                limit: 15,
                order: 'rank'
            },
            fn: function (resData) {
                if (resData.code === 1) {
                    let ratOpts = ratChartFn(resData.data)
                    ratChart.setOption(ratOpts)
                }
            }
        })
    }

    // 涨速初始化
    if (marketAccer.length > 0) {
        accChart = echarts.init(marketAccer[0])
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/coin/speed_percent`,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    let accOpts = accChartFn(resData.data)
                    accChart.setOption(accOpts)
                }
            }
        })
    }

    // 七日新币初始化
    if (marketNewCoin.length > 0) {
        ncChart = echarts.init(marketNewCoin[0])
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/coin/seven_day_new`,
            params: {
                page: 1,
                size: 10,
                sort: 'asc',
                limit: 15,
                order: 'rank'
            },
            fn: function (resData) {
                if (resData.code === 1) {
                    if (resData.data.length < 1) {
                        $('.new-coin-error').show()
                    } else {
                        $('.new-coin-error').hide()
                        let ncOpts = ncChartFn(resData.data)
                        ncChart.setOption(ncOpts)
                    }
                }
            }
        })
    }

    // 交易所主要交易对 创建元素函数
    let createTopTenDom = (data) => {
        let totalAry = []
        data.forEach((item) => {
            totalAry.push(item.infoList.reduce((a, b) => a + b.volume, 0))
        })
        return data.map((item, index) => {
            return `<li class="clearfix ${index === 0 ? 'act' : ''}">
                        <div class="market-progress">
                            <p class="market-vol">
                                ${item.infoList.map((child, i) => `<span class="vol${i}" style="width: ${(child.volume / totalAry[index]).toFixed(7) * 100}%"></span>`).join('')}
                            </p>
                            <div class="market-vol-info">
                            ${item.infoList.map((child, i) => `<p class="mark${i}" style="width: ${(child.volume / totalAry[index]).toFixed(7) * 100}%"><span class="mark-name" title="${child.base}/${child.quote}">${child.base}/${child.quote}</span><span title="${(child.rate * 100).toFixed(2)}%">${(child.rate * 100).toFixed(2)}%</span></p>`).join('')}
                                    </div>
                                </div>
                                <p class="market-name">${item.market}</p>
                                <p class="market-rank">${index + 1}</p>
                            </li>`
        }).join('')
    }

    // 交易所主要交易对初始化
    if (marketVolRatio.length > 0) {
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/market/base_quote_scale`,
            params: {},
            fn: function (resData) {
                if (resData.code === 1) {
                    volRatioFn(resData.data)
                }
            }
        })
    }

    // 交易所成交量初始化
    if (marketVolume.length > 0) {
        volChart = echarts.init(marketVolume[0])
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/summary/market/volume_scale`,
            params: {
                page: 1,
                size: 10,
                sort: 'asc',
                limit: 15,
                order: 'rank'
            },
            fn: function (resData) {
                if (resData.code === 1) {
                    volReqData = resData.data
                    let volOpts = volChartFn(resData.data, baseInfo.data('currency'))
                    volChart.setOption(volOpts)
                }
            }
        })
    }

    // 货币排序表初始化
    if (marketDateList.length > 0) {
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/tickers/coin/list`,
            params: {
                page: 1,
                size: 10,
                sort: 'desc',
                order: 'change',
                limit: 500
            },
            noloading: true,
            fn: function (resData) {
                if (resData.code === 1) {
                    listReqData = resData.data
                    marketListFn(resData.data, baseInfo.data('listtype'), baseInfo.data('currency'))
                }
            }
        })
        // $('#pagination-market').pagination({
        //     items: 100,
        //     itemsOnPage: 10,
        //     hrefTextPrefix: 'javascript: void(0)',
        //     hrefTextSuffix: ';',
        //     prevText: '<span aria-hidden="true"><i class="iconfont iconfont-left"></i></span>',
        //     nextText: '<span aria-hidden="true"><i class="iconfont iconfont-right"></i></span>',
        //     onPageClick: function (page, evt) {
        //         // some code
        //
        //         // axiosAjax({
        //         //     type: 'GET',
        //         //     url: proxyUrl + '/v1/answer/get_comment_list/',
        //         //     params: {
        //         //         uid: 1,
        //         //         token: 1,
        //         //         platform: 'pc',
        //         //         answer_id: 1,
        //         //         limit: 10,
        //         //         page: page,
        //         //         order: 'new'
        //         //     },
        //         //     fn: function (data) {
        //         //         console.log(data)
        //         //     }
        //         // })
        //     }
        // })
    }

    // list 切换
    $('.market-list-tab').on('click', 'span', function () {
        let that = $(this)
        let type = that.data('type')
        let load = that.data('load')
        let List = $('.market-list-todo')
        let sort = $('.market-list-sort')
        let listCount = getListCount(type)

        if (load === 'on') return
        $('#baseInfo').data('listtype', type)
        that.data('load', 'on').addClass('act').siblings().data('load', 'off').removeClass('act')
        let myParams = {
            page: 1,
            size: 10,
            sort: 'desc',
            limit: 500
        }
        axiosAjax({
            type: 'GET',
            url: `${proxyUrl}/market/tickers/coin/list`,
            params: getParams(type, myParams),
            noloading: true,
            fn: function (resData) {
                if (resData.code === 1) {
                    listReqData = resData.data
                    let sortDate = getListTitle(type)
                    let listDate = getListItem(resData.data.inforList, type, baseInfo.data('currency'))
                    sort.html(sortDate)
                    List.html(listDate)
                    sort.find('li').eq(0).css('width', '18%').siblings().css('width', 82 / (listCount - 1) + '%')
                    $('.market-list-todo li').each((index, item) => {
                        $(item).find('p').eq(0).css('width', '18%').siblings().css('width', 82 / (listCount - 1) + '%')
                        loadImgFail($(item).children('p:first-child').find('img'), 'png')
                        loadImgFail($(item).children('p:last-child').find('img'), 'svg')
                    })
                }
            }
        })
    })

    // 交易所主要交易对 鼠标经过
    $('.top-ten').on('mouseenter', 'li', function () {
        $(this).addClass('act').siblings().removeClass('act')
    })
})
