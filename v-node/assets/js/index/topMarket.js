/**
 * Author：tantingting
 * Time：2018/8/30
 * Description：Description
 */
import Cookies from 'js-cookie'
import {
    axiosAjax,
    proxyUrl,
    fomartQuery
} from '../public/public'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')

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
                        <h5>${Math.round((Cookies.get('USD') * item.coin.price_usd) * 100) / 100}</h5>
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

// 行情下拉
// 交易所
const getBourse = (coinid) => {
    let sendData = {
        coinid: coinid,
        currentpage: 1,
        pagesize: 3
    }
    axiosAjax({
        type: 'GET',
        url: `${proxyUrl}/market/coin/exchange?${fomartQuery(sendData)}`,
        params: {},
        fn: function (resData) {
            if (resData.code === 1) {
                let str = ''
                let data = resData.data.inforList
                data.map((item, index) => {
                    str += `<tr>
                                    <td>${item.exchange_name}</td>
                                    <td>${item.pair}</td>
                                    <td>￥${Math.round((Cookies.get('USD') * item.price) * 1000) / 1000}</td>
                                </tr>`
                })
                $('#exchange tbody').html(str)
            }
        }
    })
}

export function initTopMarkets () {
    setIntervalFn(true)
    setInterval(() => {
        setIntervalFn(false)
    }, 60000)

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
            return (Math.floor((item[1] * Cookies.get('USD')) * 1000) / 1000)
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

    // 头部行情
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

    // 关闭走势图
    $('.closeBtn, .marketBtn').on('click', function () {
        $('.bottom-Market').removeClass('bounceInDown').addClass('bounceInUp')
        $('.market-active').removeClass('active')
        marketSwiper.startAutoplay()
    })

    $(document).on('click', function (e) {
        if ($('.bottom-Market').hasClass('bounceInDown')) {
            $('.bottom-Market').removeClass('bounceInDown').addClass('bounceInUp')
        }
        $('.market-active').removeClass('active')
        marketSwiper.startAutoplay()
    })

    $('.bottom-Market').on('click', function (e) {
        e.stopPropagation()
    })
}
